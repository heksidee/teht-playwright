const { test, describe, expect } = require('@playwright/test')

describe("Note app", () => {
    test('front page can be opened', async ({ page }) => {
        await page.goto('http://localhost:5173')

        const locator = page.getByText('Notes')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Note app, Software Developing, Department of ESEDU 2025')).toBeVisible()
    })

    test("user can log in", async ({ page }) => {
        await page.goto('http://localhost:5173')

        await page.getByRole("button", { name: "Log in" }).click()
        await page.getByRole("textbox").first().fill("root")
        await page.getByRole("textbox").last().fill("sekret")
        await page.getByRole("button", { name: "Login" }).click()

        await expect(page.getByText("root logged in")).toBeVisible()
    })
})
