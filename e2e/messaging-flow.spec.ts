/**
 * E2E Tests: Messaging Flow
 * Tests the messaging system functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Messaging Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/messages');
    await page.waitForLoadState('networkidle');
  });

  test('user can view conversations list', async ({ page }) => {
    // Verify messages page loads
    await expect(page.locator('h1')).toContainText('Messages');
    
    // Should show conversations or empty state
    const hasConversations = await page.locator('[data-testid="conversation-item"]').count() > 0;
    const hasEmptyState = await page.locator('[data-testid="empty-messages"]').isVisible();
    
    expect(hasConversations || hasEmptyState).toBe(true);
  });

  test('user can start conversation from item detail', async ({ page }) => {
    // Navigate to an item first
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for items and click first one
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    await page.locator('[data-testid="item-card"]').first().click();
    
    // Verify item detail page
    await expect(page).toHaveURL(/\/item\/\d+/);
    
    // Click contact seller button
    await page.locator('[data-testid="contact-seller"]').click();
    
    // Should navigate to messages with conversation started
    await expect(page).toHaveURL('/messages');
    await expect(page.locator('[data-testid="conversation-item"]')).toHaveCount(1);
  });

  test('user can send and receive messages in conversation', async ({ page }) => {
    // Navigate to home and create a conversation first
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    await page.locator('[data-testid="item-card"]').first().click();
    await page.locator('[data-testid="contact-seller"]').click();
    
    // Should be in messages with conversation
    await expect(page.locator('[data-testid="conversation-item"]')).toBeVisible();
    
    // Click on conversation to open it
    await page.locator('[data-testid="conversation-item"]').click();
    
    // Verify chat interface loads
    await expect(page.locator('[data-testid="chat-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="message-input"]')).toBeVisible();
    
    // Type and send message
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill('Hi! Is this item still available?');
    await page.locator('[data-testid="send-button"]').click();
    
    // Verify message appears in chat
    await expect(page.locator('[data-testid="message"]').last()).toContainText('Hi! Is this item still available?');
    
    // Verify message is marked as sent
    await expect(page.locator('[data-testid="message-status"]').last()).toContainText('Sent');
  });

  test('user can see message timestamps', async ({ page }) => {
    // Setup conversation (same as previous test)
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    await page.locator('[data-testid="item-card"]').first().click();
    await page.locator('[data-testid="contact-seller"]').click();
    await page.locator('[data-testid="conversation-item"]').click();
    
    // Send a message
    await page.locator('[data-testid="message-input"]').fill('Test message');
    await page.locator('[data-testid="send-button"]').click();
    
    // Verify timestamp is shown
    await expect(page.locator('[data-testid="message-time"]').last()).toBeVisible();
    
    // Timestamp should be "Just now" or similar
    const timeText = await page.locator('[data-testid="message-time"]').last().textContent();
    expect(timeText).toMatch(/just now|now|\d+:\d+/i);
  });

  test('conversations show last message preview', async ({ page }) => {
    // Setup conversation and send message
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    await page.locator('[data-testid="item-card"]').first().click();
    await page.locator('[data-testid="contact-seller"]').click();
    await page.locator('[data-testid="conversation-item"]').click();
    
    const testMessage = 'This is a test message for preview';
    await page.locator('[data-testid="message-input"]').fill(testMessage);
    await page.locator('[data-testid="send-button"]').click();
    
    // Go back to conversations list
    await page.locator('[data-testid="back-to-conversations"]').click();
    
    // Verify conversation shows message preview
    await expect(page.locator('[data-testid="conversation-preview"]')).toContainText(testMessage);
  });

  test('user can see online status of other users', async ({ page }) => {
    // Setup conversation
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    await page.locator('[data-testid="item-card"]').first().click();
    await page.locator('[data-testid="contact-seller"]').click();
    await page.locator('[data-testid="conversation-item"]').click();
    
    // Check for online status indicator
    const hasOnlineStatus = await page.locator('[data-testid="online-status"]').isVisible();
    const hasLastSeenStatus = await page.locator('[data-testid="last-seen"]').isVisible();
    
    // Should show either online status or last seen
    expect(hasOnlineStatus || hasLastSeenStatus).toBe(true);
  });

  test('message input has character limit', async ({ page }) => {
    // Setup conversation
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    await page.locator('[data-testid="item-card"]').first().click();
    await page.locator('[data-testid="contact-seller"]').click();
    await page.locator('[data-testid="conversation-item"]').click();
    
    // Type long message
    const longMessage = 'A'.repeat(1001); // Assuming 1000 char limit
    const messageInput = page.locator('[data-testid="message-input"]');
    await messageInput.fill(longMessage);
    
    // Verify character counter appears
    await expect(page.locator('[data-testid="char-counter"]')).toBeVisible();
    await expect(page.locator('[data-testid="char-counter"]')).toContainText('1000');
    
    // Send button should be disabled
    await expect(page.locator('[data-testid="send-button"]')).toBeDisabled();
  });

  test('conversations are sorted by last message time', async ({ page }) => {
    // This test assumes multiple conversations exist
    const conversationCount = await page.locator('[data-testid="conversation-item"]').count();
    
    if (conversationCount > 1) {
      // Get timestamps of conversations
      const timestamps = await page.locator('[data-testid="conversation-time"]').allTextContents();
      
      // Verify they are in descending order (newest first)
      for (let i = 0; i < timestamps.length - 1; i++) {
        const current = new Date(timestamps[i]);
        const next = new Date(timestamps[i + 1]);
        expect(current.getTime()).toBeGreaterThanOrEqual(next.getTime());
      }
    }
  });

  test('user can delete conversations', async ({ page }) => {
    // Setup conversation first
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    await page.locator('[data-testid="item-card"]').first().click();
    await page.locator('[data-testid="contact-seller"]').click();
    
    // Verify conversation exists
    await expect(page.locator('[data-testid="conversation-item"]')).toHaveCount(1);
    
    // Long press or right click for delete option
    await page.locator('[data-testid="conversation-item"]').click({ button: 'right' });
    
    // Click delete option
    await page.locator('[data-testid="delete-conversation"]').click();
    
    // Confirm deletion
    await page.locator('[data-testid="confirm-delete"]').click();
    
    // Verify conversation is deleted
    await expect(page.locator('[data-testid="conversation-item"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="empty-messages"]')).toBeVisible();
  });

  test('messages show delivery status', async ({ page }) => {
    // Setup conversation
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="item-card"]')).toHaveCount(10, { timeout: 10000 });
    await page.locator('[data-testid="item-card"]').first().click();
    await page.locator('[data-testid="contact-seller"]').click();
    await page.locator('[data-testid="conversation-item"]').click();
    
    // Send message
    await page.locator('[data-testid="message-input"]').fill('Test message status');
    await page.locator('[data-testid="send-button"]').click();
    
    // Check message status progression: Sending -> Sent -> Delivered
    const messageStatus = page.locator('[data-testid="message-status"]').last();
    
    // Initially should show "Sending" or "Sent"
    const statusText = await messageStatus.textContent();
    expect(statusText).toMatch(/sending|sent/i);
  });
});
