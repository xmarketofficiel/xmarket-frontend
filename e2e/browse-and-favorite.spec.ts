/**
 * E2E Tests: User Browse and Favorite Flow
 * Tests the complete user journey from browsing items to adding favorites
 */

import { test, expect } from '@playwright/test';

test.describe('Browse and Favorite Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('user can browse items and view details', async ({ page }) => {
    // Verify homepage loads with items
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    
    // Click on first item
    const firstItem = page.locator('[data-testid="item-card"]').first();
    const itemTitle = await firstItem.locator('h3').textContent();
    await firstItem.click();
    
    // Should navigate to item detail page
    await expect(page).toHaveURL(/\/item\/\d+/);
    
    // Verify item details page loads
    await expect(page.locator('h1')).toContainText(itemTitle || '');
    await expect(page.locator('[data-testid="item-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="item-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="seller-info"]')).toBeVisible();
  });

  test('user can add and remove items from favorites', async ({ page }) => {
    // Wait for items to load
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    
    // Click favorite button on first item
    const firstItem = page.locator('[data-testid="item-card"]').first();
    const favoriteButton = firstItem.locator('[data-testid="favorite-button"]');
    
    // Add to favorites
    await favoriteButton.click();
    
    // Verify button state changes
    await expect(favoriteButton).toHaveClass(/text-red-500/);
    
    // Navigate to favorites page
    await page.locator('[data-testid="favorites-nav"]').click();
    await expect(page).toHaveURL('/favorites');
    
    // Verify item appears in favorites
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(1);
    
    // Remove from favorites
    await page.locator('[data-testid="favorite-button"]').click();
    
    // Verify empty state
    await expect(page.locator('[data-testid="empty-favorites"]')).toBeVisible();
  });

  test('user can filter items by category', async ({ page }) => {
    // Wait for items to load
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    
    // Click Electronics filter
    await page.locator('[data-testid="category-filter-electronics"]').click();
    
    // Verify filter is applied (should show fewer items)
    await page.waitForTimeout(1000); // Wait for filter to apply
    const filteredItems = page.locator('[data-testid="item-card"]');
    const itemCount = await filteredItems.count();
    
    // Should have fewer than 10 items
    expect(itemCount).toBeLessThan(10);
    
    // Verify all visible items are in Electronics category
    const categoryBadges = page.locator('[data-testid="category-badge"]');
    const badgeTexts = await categoryBadges.allTextContents();
    badgeTexts.forEach(text => {
      expect(text.toLowerCase()).toBe('electronics');
    });
  });

  test('user can search for items', async ({ page }) => {
    // Enter search term
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('iPhone');
    
    // Submit search
    await searchInput.press('Enter');
    
    // Wait for search results
    await page.waitForURL('/?search=iPhone');
    await page.waitForLoadState('networkidle');
    
    // Verify search results contain search term
    const itemTitles = page.locator('[data-testid="item-title"]');
    const titles = await itemTitles.allTextContents();
    
    // At least one item should contain iPhone
    const hasIPhone = titles.some(title => 
      title.toLowerCase().includes('iphone')
    );
    expect(hasIPhone).toBe(true);
  });

  test('user can navigate between pages', async ({ page }) => {
    // Verify navbar links
    await expect(page.locator('[data-testid="nav-home"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-favorites"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-add"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-messages"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-profile"]')).toBeVisible();
    
    // Navigate to Add Item page
    await page.locator('[data-testid="nav-add"]').click();
    await expect(page).toHaveURL('/add-item');
    await expect(page.locator('h1')).toContainText('Post New Item');
    
    // Navigate to Messages page
    await page.locator('[data-testid="nav-messages"]').click();
    await expect(page).toHaveURL('/messages');
    
    // Navigate back to home
    await page.locator('[data-testid="nav-home"]').click();
    await expect(page).toHaveURL('/');
  });

  test('infinite scroll loads more items', async ({ page }) => {
    // Wait for initial items
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    
    // Scroll to bottom
    await page.keyboard.press('End');
    
    // Wait for more items to load (if pagination is implemented)
    await page.waitForTimeout(2000);
    
    // Should have loaded more items or show "load more" button
    const itemCount = await page.locator('[data-testid="item-card"]').count();
    const loadMoreButton = page.locator('[data-testid="load-more"]');
    
    // Either more items loaded or load more button is visible
    const hasMoreItems = itemCount > 10;
    const hasLoadMoreButton = await loadMoreButton.isVisible();
    
    expect(hasMoreItems || hasLoadMoreButton).toBe(true);
  });

  test('responsive design works on mobile', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }
    
    // Verify mobile navbar
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();
    
    // Verify items are displayed in mobile layout
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    
    // Test mobile search
    await page.locator('[data-testid="mobile-search-button"]').click();
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
    
    await page.locator('[data-testid="search-input"]').fill('MacBook');
    await page.locator('[data-testid="search-input"]').press('Enter');
    
    await page.waitForURL('/?search=MacBook');
    await expect(page.locator('[data-testid="item-card"]')).toBeVisible();
  });
});
