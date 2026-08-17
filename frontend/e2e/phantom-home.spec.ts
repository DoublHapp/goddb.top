import { expect, test } from '@playwright/test'

const expectNoOverflow = async (page: import('@playwright/test').Page) => expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

test('phantom 首页完成开场并允许从眼标重播与跳过', async ({ page }) => {
  await page.goto('/')
  const intro = page.getByTestId('phantom-intro')

  await expect(intro).toHaveAttribute('data-stage', /idle|split|gaze|collapse|brand-lock/)
  await expect(intro).toHaveAttribute('data-stage', 'brand-lock', { timeout: 1500 })
  await page.getByRole('button', { name: /重播.*开场|DB.*首页/ }).first().click()
  await expect(intro).not.toHaveAttribute('data-stage', 'brand-lock')
  await page.keyboard.press('Escape')
  await expect(intro).toHaveAttribute('data-stage', 'brand-lock')
})

test('声音默认关闭并在刷新后保留开启状态', async ({ page }) => {
  await page.goto('/')
  const sound = page.getByRole('button', { name: /静音|声音/ }).first()

  await expect(sound).toHaveAttribute('aria-pressed', 'false')
  await sound.click()
  await expect(sound).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(page.getByRole('button', { name: /声音已开启|声音/ }).first()).toHaveAttribute('aria-pressed', 'true')
})

test('频道卡打开任务面板并可进入真实随笔', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('phantom-intro')).toHaveAttribute('data-stage', 'brand-lock', { timeout: 1500 })
  const trigger = page.getByRole('button', { name: /随笔/ }).last()

  await trigger.click()
  const panel = page.getByRole('dialog', { name: /随笔|任务/ })
  await expect(panel).toBeVisible()
  await panel.getByRole('link', { name: /网站搬迁记/ }).click()
  await expect(page).toHaveURL(/\/essays\/website-migration-to-self-hosted$/)
})

test('任务面板通过 Escape 关闭并将焦点还给频道卡', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('phantom-intro')).toHaveAttribute('data-stage', 'brand-lock', { timeout: 1500 })
  const trigger = page.getByRole('button', { name: /随笔/ }).last()

  await trigger.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('低动态模式跳过裂屏运动并保留首页核心入口', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  await expect(page.getByTestId('phantom-intro')).toHaveAttribute('data-motion', 'reduced')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/想和 DB SAMA/)
  await expect(page.getByRole('button', { name: /随笔/ }).last()).toBeVisible()
  await expectNoOverflow(page)
})

test('移动首页提供单列频道与可关闭菜单且没有横向溢出', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', '仅验证移动项目')
  await page.goto('/')
  await expect(page.getByTestId('phantom-intro')).toHaveAttribute('data-stage', 'brand-lock', { timeout: 1500 })
  const menu = page.getByRole('button', { name: /菜单/ })

  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#mobile-navigation')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await expectNoOverflow(page)
})
