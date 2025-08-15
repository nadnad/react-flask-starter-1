const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://react-flask-starter-1.dev.nadnad.shipyard.host';
const BYPASS_TOKEN = 'mkZTRcsIbrXydyXnniJ5eiPzpv0qYAgyPmljSPARQdqiAVaUPHRgTptjxrn3R2sQ';

test.describe('Feedback Feature', () => {
  test.beforeEach(async ({ page }) => {
    // No need for cookies - we'll use the URL parameter
  });

  test('should display feedback card on home page', async ({ page }) => {
    await page.goto(`${BASE_URL}?shipyard_token=${BYPASS_TOKEN}`);
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the feedback card is visible
    const feedbackCard = page.locator('h2:text("Feedback")');
    await expect(feedbackCard).toBeVisible();
    
    // Check if the form elements are present
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('button:text("Submit Feedback")')).toBeVisible();
    
    // Check for the "View all feedback" link
    await expect(page.locator('a[href="/feedback"]')).toBeVisible();
  });

  test('should submit feedback form successfully', async ({ page }) => {
    await page.goto(`${BASE_URL}?shipyard_token=${BYPASS_TOKEN}`);
    await page.waitForLoadState('networkidle');

    // Fill out the feedback form
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('textarea[name="message"]', 'This is a test feedback message. The React + Flask starter template is working great!');
    
    // Submit the form
    await page.click('button:text("Submit Feedback")');
    
    // Wait for the success message
    const successMessage = page.locator('text="Feedback submitted successfully!"');
    await expect(successMessage).toBeVisible({ timeout: 10000 });
    
    // Check that the form is cleared
    await expect(page.locator('input[name="name"]')).toHaveValue('');
    await expect(page.locator('input[name="email"]')).toHaveValue('');
    await expect(page.locator('textarea[name="message"]')).toHaveValue('');
  });

  test('should navigate to feedback page', async ({ page }) => {
    await page.goto(`${BASE_URL}?shipyard_token=${BYPASS_TOKEN}`);
    await page.waitForLoadState('networkidle');
    
    // Click on "View all feedback" link
    await page.click('a[href="/feedback"]');
    
    // Wait for navigation to complete
    await page.waitForURL('**/feedback');
    
    // Check if we're on the feedback page
    await expect(page.locator('h1:text("Feedback")')).toBeVisible();
    await expect(page.locator('text="All feedback submissions from users"')).toBeVisible();
    
    // Check for the back button
    await expect(page.locator('a:text("← Back to Home")')).toBeVisible();
  });

  test('should display feedback entries on feedback page', async ({ page }) => {
    // First, submit some feedback
    await page.goto(`${BASE_URL}?shipyard_token=${BYPASS_TOKEN}`);
    await page.waitForLoadState('networkidle');

    await page.fill('input[name="name"]', 'Jane Smith');
    await page.fill('input[name="email"]', 'jane.smith@example.com');
    await page.fill('textarea[name="message"]', 'Another test feedback to check the display functionality.');
    await page.click('button:text("Submit Feedback")');
    
    // Wait for success confirmation
    await expect(page.locator('text="Feedback submitted successfully!"')).toBeVisible({ timeout: 10000 });
    
    // Navigate to feedback page
    await page.click('a[href="/feedback"]');
    await page.waitForURL('**/feedback');
    
    // Wait for feedback to load
    await page.waitForLoadState('networkidle');
    
    // Check if feedback entries are displayed
    const feedbackEntries = page.locator('li[class*="feedbackItem"]');
    await expect(feedbackEntries.first()).toBeVisible({ timeout: 10000 });
    
    // Check if our submitted feedback appears
    await expect(page.locator('text="Jane Smith"')).toBeVisible();
    await expect(page.locator('text="jane.smith@example.com"')).toBeVisible();
    await expect(page.locator('text="Another test feedback to check the display functionality."')).toBeVisible();
  });

  test('should navigate back to home from feedback page', async ({ page }) => {
    await page.goto(`${BASE_URL}/feedback?shipyard_token=${BYPASS_TOKEN}`);
    await page.waitForLoadState('networkidle');
    
    // Click the back button
    await page.click('a:text("← Back to Home")');
    
    // Wait for navigation to complete
    await page.waitForURL('**/');  // Just check that we're back at root
    
    // Verify we're back on the home page
    await expect(page.locator('h2:text("Feedback")')).toBeVisible();
    await expect(page.locator('text="React-Flask-Postgres-LocalStack Starter Project"')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto(`${BASE_URL}?shipyard_token=${BYPASS_TOKEN}`);
    await page.waitForLoadState('networkidle');
    
    // Try to submit form without filling required fields
    await page.click('button:text("Submit Feedback")');
    
    // Check if HTML5 validation prevents submission
    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const messageInput = page.locator('textarea[name="message"]');
    
    // These fields should be marked as invalid by HTML5 validation
    await expect(nameInput).toHaveAttribute('required');
    await expect(emailInput).toHaveAttribute('required');
    await expect(messageInput).toHaveAttribute('required');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto(`${BASE_URL}?shipyard_token=${BYPASS_TOKEN}`);
    await page.waitForLoadState('networkidle');
    
    // Mock API to return error
    await page.route('**/api/v1/feedback', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    // Fill and submit form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Test message');
    await page.click('button:text("Submit Feedback")');
    
    // Check for error message
    const errorMessage = page.locator('text="Internal server error"');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });
});