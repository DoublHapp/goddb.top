import { expect, test } from '@playwright/test'

const expectNoOverflow = async (page: import('@playwright/test').Page) => expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

test('主页可通过 HTML 控件完成聚焦和确认', async ({ page }) => {
  await page.goto('/dbverse')
  await expect(page.locator('canvas, [data-testid="fallback-map"]')).toBeVisible()
  const naruto = page.getByRole('button', { name: /火影忍者|Naruto/ })
  const sekiro = page.getByRole('button', { name: /只狼|Sekiro/ })
  await expect(naruto).toBeVisible()
  await expect(sekiro).toBeVisible()
  await naruto.click()
  await expect(page).toHaveURL(/\/dbverse$/)
  await expect(page.locator('[data-state="focusing"]')).toBeVisible()
  await expect(page.getByText(/正在锁定天体|Locking target/)).toBeVisible()
  await expect(page.locator('[data-state="focused"]')).toBeVisible()
  await naruto.click()
  await expect(page).toHaveURL(/\/dbverse\/ip\/naruto$/)
  await expectNoOverflow(page)
})

test('聚合页进入内容且详情深链接可刷新', async ({ page }) => {
  await page.goto('/dbverse/ip/sekiro')
  await page.getByRole('link', { name: /只狼Sekiro|Sekiro: A Story/ }).click()
  await expect(page).toHaveURL(/sekiro-immortality-story$/)
  await page.reload()
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/只狼Sekiro|Sekiro/)
})

test('IP 页提供可点击的 3D 内容信标等价控件', async ({ page }) => {
  await page.goto('/dbverse/ip/naruto')
  await expect(page.getByText('IP 星域', { exact: true })).toBeVisible()
  await expect(page.getByText('IP STAR SYSTEM', { exact: true })).toHaveCount(0)
  const beacon = page.getByRole('button', { name: /打开 3D 内容信标|Open 3D content beacon/ })
  await expect(beacon).toBeVisible()
  await beacon.click()
  await expect(page).toHaveURL(/naruto-blue-bird-memory$/)
})

test('详情复制按钮保持深色横向按钮且历史回退不恢复旧目录页', async ({ page }) => {
  await page.goto('/dbverse')
  const naruto = page.getByRole('button', { name: /火影忍者|Naruto/ })
  await naruto.click()
  await expect(page.locator('[data-state="focused"]')).toBeVisible()
  await naruto.click()
  await expect(page).toHaveURL(/\/dbverse\/ip\/naruto$/)
  await page.getByRole('link', { name: /不知不觉|Six Years Later/ }).click()
  await expect(page).toHaveURL(/naruto-blue-bird-memory$/)
  const copy = page.locator('.dbverse-detail .copy-link')
  await expect(copy).toContainText(/复制文章链接|Copy article link/)
  await expect(copy).toBeVisible()
  const copyStyle = await copy.evaluate((element) => {
    const style = getComputedStyle(element)
    const bounds = element.getBoundingClientRect()
    return { width: bounds.width, height: bounds.height, background: style.backgroundColor, whiteSpace: style.whiteSpace }
  })
  expect(copyStyle.width).toBeGreaterThan(copyStyle.height * 2)
  expect(copyStyle.background).not.toBe('rgb(255, 255, 255)')
  expect(copyStyle.whiteSpace).toBe('nowrap')
  await page.goBack()
  await expect(page).toHaveURL(/\/dbverse\/ip\/naruto$/)
  await expect(page.locator('[data-route-view="dbverse-detail"]')).toHaveCount(0, { timeout: 750 })
  await expect(page.locator('[data-route-view="dbverse-ip"], [role="status"]')).toBeVisible({ timeout: 750 })
  await expect(page.getByText('IP 星域', { exact: true })).toBeVisible({ timeout: 750 })
  await expect(page.locator('.dbverse-filters, .dbverse-grid, .dbverse-hero')).toHaveCount(0)
  await page.goBack()
  await expect(page).toHaveURL(/\/dbverse$/)
  await expect(page.locator('canvas, [data-testid="fallback-map"]')).toBeVisible()
  await expect(page.locator('.dbverse-filters, .dbverse-grid, .dbverse-hero')).toHaveCount(0)
})

test('详情复制在 Clipboard API 失败时安全降级并保持成功反馈', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new DOMException('Denied', 'NotAllowedError')) } })
    Object.defineProperty(document, 'execCommand', { configurable: true, value: (command: string) => command === 'copy' })
  })
  await page.goto('/dbverse/naruto-blue-bird-memory')
  const copy = page.locator('.dbverse-detail .copy-link')
  await expect(copy).toContainText(/复制文章链接|Copy article link/)
  await copy.click()
  await expect(copy).toContainText(/链接已复制|Link copied/)
  await expect(page.locator('textarea[aria-hidden="true"]')).toHaveCount(0)
})

test('WebGL 失败后兼容星图仍可导航', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
      if (type.startsWith('webgl')) return null
      return original.call(this, type, ...args as [])
    } as typeof original
  })
  await page.goto('/dbverse')
  await expect(page.getByTestId('fallback-map')).toBeVisible()
  const sekiro = page.getByRole('button', { name: /只狼|Sekiro/ })
  await sekiro.click()
  await sekiro.click()
  await expect(page).toHaveURL(/\/dbverse\/ip\/sekiro$/)
})

test('低动态模式保留核心导航', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/dbverse')
  await expect(page.locator('[data-motion="reduced"]')).toBeVisible()
  await expect(page.getByRole('button', { name: /火影忍者|Naruto/ })).toBeVisible()
  await expectNoOverflow(page)
})
