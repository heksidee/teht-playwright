const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe("Note app", () => {
    beforeEach(async ({ page, request }) => {
        await request.post("/api/testing/reset")
        await request.post("/api/users", { 
            data: {
                name: "Anders Ceebelson",
                username: "AC",
                password: "beebelintorni"
            }
        })
        await page.goto('/')
    })

    test('front page can be opened', async ({ page }) => {
        const locator = page.getByText('Notes')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Note app, Software Developing, Department of ESEDU 2025')).toBeVisible()
    })

    test("user can login with correct credentials", async ({ page }) => {
        await loginWith(page, "AC", "beebelintorni")
        await expect(page.getByText("AC logged in")).toBeVisible()
    })

    test("login fails with wrong password", async ({ page }) => {
        await loginWith(page, "AC", "wrong")

        const errorDiv = page.locator(".error")
        await expect(errorDiv).toContainText("wrong credentials")
        await expect(errorDiv).toHaveCSS("border-style", "solid")
        await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)")

        await expect(page.getByText("AC logged in")).not.toBeVisible()
    })

    describe("when logged in", () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, "AC", "beebelintorni")
        })

        test("a new note can be created", async ({ page }) => {
            await createNote(page, "a note created by playwright")
            await expect(page.getByText("a note created by playwright")).toBeVisible()
        })

        describe("and a note exist", () => {
            beforeEach(async ({ page }) => {
                await createNote(page, "another note by playwright")
            })
            test("importance can be change", async ({ page }) => {
                const noteItem = page.locator("li.note", { hasText: "another note by playwright" })
                await noteItem.getByRole("button", { name: "make not important" }).click()
                await expect(noteItem.getByRole("button", { name: "make important" })).toBeVisible()
            })
        })

        describe("and severeal notes exist", () => {
            beforeEach(async ({ page }) => {
                await createNote(page, "first note", true)
                await createNote(page, "second note", true)
                await createNote(page, "third note", true)
            })

            test("one of those can be made nonimportant", async ({ page }) => {
                const otherNotetext = page.getByText("second note")
                const otherNoteElement = otherNotetext.locator("..")

                await otherNoteElement.getByRole("button", { name: "make not important" }).click()
                await expect(otherNoteElement.getByText("make important")).toBeVisible()
            })
        })
    })
})
