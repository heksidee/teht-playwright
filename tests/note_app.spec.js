const { test, describe, expect } = require('@playwright/test')
const { beforeEach } = require('node:test')

describe("Note app", () => {
    beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173')
    })

    test('front page can be opened', async ({ page }) => {
        const locator = page.getByText('Notes')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Note app, Software Developing, Department of ESEDU 2025')).toBeVisible()
    })

    test("user can log in", async ({ page }) => {
        await page.goto('http://localhost:5173')

        await page.getByRole("button", { name: "Log in" }).click()
        await page.getByLabel("username").fill("root")
        await page.getByLabel("password").fill("sekret")

        await page.getByRole("button", { name: "Login" }).click()

        await expect(page.getByText("root logged in")).toBeVisible()
    })

    describe("when logged in", () => {
        beforeEach(async ({ page }) => {
            await page.getByRole('button', { name: 'Log in' }).click()
            await page.getByLabel('username').fill('root')
            await page.getByLabel('password').fill('sekret')
            await page.getByRole('button', { name: 'Login' }).click()
        })
        test("a new note can be created", async ({ page }) => {
            await page.getByRole("button", { name: "new note" }).click()
            await page.getByRole("textbox").fill("a note created by playwright")
            await page.getByRole("button", { name: "Save"}).click()
            await expect(page.getByText("a note created by root")).toBeVisible()
        })
    })
})
