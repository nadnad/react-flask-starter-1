const { test, expect } = require("@playwright/test");

test.describe("Material-UI Components", () => {
  test.beforeEach(async ({ page }) => {
    // You can set BASE_URL environment variable for different environments
    // For Shipyard testing, you would set BASE_URL to your Shipyard environment URL
    // Example: BASE_URL=https://react-flask-starter-1.dev.nadnad.shipyard.host

    // Add bypass token if testing against Shipyard environment
    const bypassToken = process.env.SHIPYARD_BYPASS_TOKEN;
    const url = bypassToken ? `/?shipyard_token=${bypassToken}` : "/";

    await page.goto(url);
  });

  test('should display "Use Material-UI components" heading', async ({
    page,
  }) => {
    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Check for the "Use Material-UI components" heading
    const heading = page
      .locator("h1, h2, h3, h4, h5, h6")
      .filter({ hasText: "Use Material-UI components" });

    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Use Material-UI components");

    // Verify it's an h2 element specifically
    const headingTag = await heading.evaluate((el) => el.tagName);
    expect(headingTag).toBe("H2");
  });

  test("should display Material-UI chips for seasons", async ({ page }) => {
    await page.waitForLoadState("networkidle");

    // Check that the seasons are displayed as chips
    const seasons = ["Winter", "Spring", "Summer", "Fall"];

    for (const season of seasons) {
      const seasonElement = page.locator("text=" + season);
      await expect(seasonElement).toBeVisible();
    }
  });

  test("should have Material-UI theme switching instructions", async ({
    page,
  }) => {
    await page.waitForLoadState("networkidle");

    // Check for theme-related content
    const themeHeading = page
      .locator("h2")
      .filter({ hasText: "Update appearance" });
    await expect(themeHeading).toBeVisible();

    // Check for Dark Mode/Light Mode references
    await expect(page.locator("text=Dark Mode")).toBeVisible();
    await expect(page.locator("text=Light Mode")).toBeVisible();
  });
});
