const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Image Upload - LocalStack S3', () => {
  test.beforeEach(async ({ page }) => {
    // Add bypass token if testing against Shipyard environment
    const bypassToken = process.env.SHIPYARD_BYPASS_TOKEN;
    const url = bypassToken ? `/?shipyard_token=${bypassToken}` : '/';
    
    await page.goto(url);
    await page.waitForLoadState('networkidle');
  });

  test('should display LocalStack S3 upload section', async ({ page }) => {
    // Check for the LocalStack section heading
    const s3Heading = page.locator('h2').filter({ hasText: 'Store files in S3, locally' });
    await expect(s3Heading).toBeVisible();
    
    // Check for LocalStack logo and description
    await expect(page.locator('img[alt="LocalStack Logo"]')).toBeVisible();
    await expect(page.locator('text=powered by')).toBeVisible();
    
    // Check for upload button - use more specific selector
    const uploadButton = page.getByRole('button', { name: 'Upload Image' });
    await expect(uploadButton).toBeVisible();
  });

  test('should successfully upload an image to LocalStack S3', async ({ page }) => {
    // Create a test image file path (you may need to adjust this path)
    const testImagePath = path.join(__dirname, '..', 'test-image.png');
    
    // Get initial number of uploaded images
    const initialImages = await page.locator('img[alt="Uploaded to LocalStack"]').count();
    
    // Click upload button
    const uploadButton = page.getByRole('button', { name: 'Upload Image' });
    await uploadButton.click();
    
    // Handle file upload
    const fileChooserPromise = page.waitForEvent('filechooser');
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(testImagePath);
    
    // Wait for the image to be uploaded and displayed
    await page.waitForTimeout(2000); // Give time for upload to complete
    
    // Verify a new image appears in the list
    const finalImages = await page.locator('img[alt="Uploaded to LocalStack"]').count();
    expect(finalImages).toBeGreaterThan(initialImages);
    
    // Verify the uploaded images are visible
    const uploadedImages = page.locator('img[alt="Uploaded to LocalStack"]');
    await expect(uploadedImages.first()).toBeVisible();
  });

  test('should display uploaded images in a list format', async ({ page }) => {
    // If there are uploaded images, verify they're visible
    const imageCount = await page.locator('img[alt="Uploaded to LocalStack"]').count();
    
    if (imageCount > 0) {
      // Just verify the first uploaded image is visible
      const firstImage = page.locator('img[alt="Uploaded to LocalStack"]').first();
      await expect(firstImage).toBeVisible();
    } else {
      // Skip test if no images are uploaded yet
      test.skip();
    }
  });

  test('should have proper LocalStack integration setup', async ({ page }) => {
    // Verify LocalStack branding and links - use first() to avoid strict mode violation
    const localStackLink = page.locator('a').filter({ hasText: 'LocalStack' }).first();
    await expect(localStackLink).toBeVisible();
    await expect(localStackLink).toHaveAttribute('href', 'https://github.com/localstack/localstack');
    
    // Check descriptive text
    await expect(page.locator('text=stored in a local S3 bucket')).toBeVisible();
    await expect(page.locator('text=fully functional local AWS cloud stack')).toBeVisible();
  });
});