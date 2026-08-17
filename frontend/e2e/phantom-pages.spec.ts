import { expect, test } from '@playwright/test'

const expectNoOverflow = async (page: import('@playwright/test').Page) => expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('goddb:phantom-intro-seen', '1'))
})

for (const route of ['/about', '/projects', '/essays', '/tools']) {
  test(`${route} 使用怪盗编辑部壳且无横向溢出`, async ({ page }) => {
    await page.goto(route)
    await expect(page.locator('.phantom-page-lead')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expectNoOverflow(page)
  })
}

test('作品筛选保留 query 并可进入真实详情', async ({ page }) => {
  await page.goto('/projects')
  await page.locator('[data-filter-value="online"]').click()
  await expect(page).toHaveURL(/status=online/)
  await page.locator('.project-card a').first().click()
  await expect(page.locator('.phantom-detail-header')).toBeVisible()
})

test('随笔搜索保留 query 并进入阅读工作台', async ({ page }) => {
  await page.goto('/essays')
  await page.getByRole('searchbox').fill('网站')
  await expect(page).toHaveURL(/q=/)
  await page.locator('.post-row h3 a').first().click()
  await expect(page.locator('.article-header')).toBeVisible()
  await expect(page.locator('.markdown-body')).toBeVisible()
  await expect(page.locator('.comments-section')).toBeVisible()
})

test('工具页诚实展示建设中空态', async ({ page }) => {
  await page.goto('/tools')
  await expect(page.locator('.phantom-empty-state')).toContainText(/BUILDING|建设|工具/i)
  await expect(page.locator('.tool-card')).toHaveCount(0)
})

test('普通与 DB 宇宙继续保持壳层隔离', async ({ page }) => {
  await page.goto('/about')
  await expect(page.locator('.site-footer')).toBeVisible()
  await page.goto('/dbverse')
  await expect(page.locator('.site-footer')).toHaveCount(0)
  await expect(page.locator('.phantom-page-lead')).toHaveCount(0)
})

test('全局与局部 404 使用信号中断面板', async ({ page }) => {
  await page.goto('/not-a-route')
  await expect(page.locator('.phantom-empty-state')).toBeVisible()
  await page.goto('/projects/not-a-project')
  await expect(page.locator('.phantom-empty-state a[href="/projects"]')).toBeVisible()
})
