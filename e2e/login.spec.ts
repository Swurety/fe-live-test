// Candidate: Write your Playwright E2E test for login here.
import { test, expect, Page } from "@playwright/test";

const BASE_URL = "http://localhost:5173/";
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "secret";

// Helper function with proper type
async function login(page: Page, username = "", password = "") {
  if (username) await page.getByLabel("Username").fill(username);
  if (password) await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
}

test.describe("Login E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test("renders login form", async ({ page }) => {
    await expect(page.getByLabel("Username")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
  });

  test("shows error when fields are empty", async ({ page }) => {
    await login(page);
    await expect(page.getByRole("alert")).toHaveText(
      "Username and password are required"
    );
  });

  test("logs in successfully with valid credentials", async ({ page }) => {
    await login(page, VALID_USERNAME, VALID_PASSWORD);
    await expect(page.getByText(`Welcome, ${VALID_USERNAME}!`)).toBeVisible();
  });
});
