/**
 * E2E Tests: Add Item Flow
 * Tests the complete user journey for adding a new item
 */

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Add Item Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/add');
    await page.waitForLoadState('networkidle');
  });

  test('user can add a new item with all details', async ({ page }) => {
    // Verify add item page loads
    await expect(page.locator('h1')).toContainText('Post New Item');
    
    // Step 1: Upload photos
    const fileInput = page.locator('input[type="file"]');
    const testImagePath = path.join(__dirname, '..', 'public', 'test-image.jpg');
    
    // Create a test image file if it doesn't exist (mock file upload)
    await fileInput.setInputFiles([{
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data')
    }]);
    
    // Verify photo preview appears
    await expect(page.locator('[data-testid="photo-preview"]')).toBeVisible();
    
    // Continue to next step
    await page.locator('[data-testid="next-button"]').click();
    
    // Step 2: Fill item details
    await page.locator('[data-testid="title-input"]').fill('Test MacBook Pro');
    await page.locator('[data-testid="category-select"]').selectOption('electronics');
    await page.locator('[data-testid="price-input"]').fill('25000');
    await page.locator('[data-testid="description-textarea"]').fill('Excellent condition MacBook Pro, perfect for university and professional work. Includes original charger and box.');
    
    // Submit the form
    await page.locator('[data-testid="submit-button"]').click();
    
    // Verify success message appears
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Item posted successfully!');
    
    // Should redirect to home page or item detail
    await expect(page).toHaveURL(/\/(item\/\d+)?/);
  });

  test('form validation works correctly', async ({ page }) => {
    // Try to proceed without photos
    await page.locator('[data-testid="next-button"]').click();
    
    // Should show photo error
    await expect(page.locator('[data-testid="photo-error"]')).toContainText('At least one photo is required');
    
    // Add photo and proceed
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([{
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data')
    }]);
    
    await page.locator('[data-testid="next-button"]').click();
    
    // Try to submit without required fields
    await page.locator('[data-testid="submit-button"]').click();
    
    // Should show validation errors
    await expect(page.locator('[data-testid="title-error"]')).toContainText('Title must be at least 5 characters');
    await expect(page.locator('[data-testid="price-error"]')).toContainText('Price is required');
    await expect(page.locator('[data-testid="description-error"]')).toContainText('Description must be at least 20 characters');
  });

  test('user can remove uploaded photos', async ({ page }) => {
    // Upload multiple photos
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([
      {
        name: 'test-image1.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-data-1')
      },
      {
        name: 'test-image2.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('fake-image-data-2')
      }
    ]);
    
    // Verify both photos appear
    await expect(page.locator('[data-testid="photo-preview"]')).toHaveCount(2);
    
    // Remove first photo
    await page.locator('[data-testid="remove-photo-0"]').click();
    
    // Verify only one photo remains
    await expect(page.locator('[data-testid="photo-preview"]')).toHaveCount(1);
  });

  test('drag and drop file upload works', async ({ page }) => {
    // Create file data for drag and drop
    const dataTransfer = await page.evaluateHandle(() => new DataTransfer());
    
    // Simulate drag and drop
    const dropZone = page.locator('[data-testid="drop-zone"]');
    
    // Hover over drop zone
    await dropZone.hover();
    
    // Verify drop zone visual feedback
    await expect(dropZone).toHaveClass(/border-primary/);
    await expect(page.locator('[data-testid="drop-message"]')).toContainText('Drop your photos here');
    
    // Simulate file drop (in real scenario, this would be handled by the browser)
    await page.locator('input[type="file"]').setInputFiles([{
      name: 'dropped-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-dropped-image-data')
    }]);
    
    // Verify photo was added
    await expect(page.locator('[data-testid="photo-preview"]')).toBeVisible();
  });

  test('character count shows correct limits', async ({ page }) => {
    // Add photo and proceed to details
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([{
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data')
    }]);
    
    await page.locator('[data-testid="next-button"]').click();
    
    // Test title character count
    const titleInput = page.locator('[data-testid="title-input"]');
    await titleInput.fill('Test');
    
    await expect(page.locator('[data-testid="title-count"]')).toContainText('4/100');
    
    // Test description character count
    const descriptionTextarea = page.locator('[data-testid="description-textarea"]');
    await descriptionTextarea.fill('Short description');
    
    await expect(page.locator('[data-testid="description-count"]')).toContainText('17/1000');
  });

  test('category selection works correctly', async ({ page }) => {
    // Add photo and proceed to details
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([{
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data')
    }]);
    
    await page.locator('[data-testid="next-button"]').click();
    
    // Open category selector
    await page.locator('[data-testid="category-select"]').click();
    
    // Verify all categories are available
    await expect(page.locator('[data-testid="category-electronics"]')).toBeVisible();
    await expect(page.locator('[data-testid="category-furniture"]')).toBeVisible();
    await expect(page.locator('[data-testid="category-clothing"]')).toBeVisible();
    await expect(page.locator('[data-testid="category-books"]')).toBeVisible();
    await expect(page.locator('[data-testid="category-other"]')).toBeVisible();
    
    // Select category
    await page.locator('[data-testid="category-electronics"]').click();
    
    // Verify selection
    await expect(page.locator('[data-testid="category-select"]')).toContainText('Electronics');
  });

  test('price formatting works correctly', async ({ page }) => {
    // Add photo and proceed to details
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([{
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data')
    }]);
    
    await page.locator('[data-testid="next-button"]').click();
    
    // Enter price
    const priceInput = page.locator('[data-testid="price-input"]');
    await priceInput.fill('1500000');
    
    // Verify price formatting preview
    await expect(page.locator('[data-testid="price-preview"]')).toContainText('EGP 1,500,000');
  });

  test('user can navigate back and forth between steps', async ({ page }) => {
    // Add photo and proceed to details
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles([{
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake-image-data')
    }]);
    
    await page.locator('[data-testid="next-button"]').click();
    
    // Verify we're on step 2
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('2 of 2');
    
    // Go back to step 1
    await page.locator('[data-testid="back-button"]').click();
    
    // Verify we're back on step 1
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('1 of 2');
    await expect(page.locator('[data-testid="photo-preview"]')).toBeVisible(); // Photo should still be there
  });
});
