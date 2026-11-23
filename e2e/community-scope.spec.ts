import { test, expect } from '@playwright/test';

test.describe('Community marketplace scope', () => {
  for (const path of ['/messages', '/users', '/services', '/marketplace/services/42', '/add-service']) {
    test(`retired page ${path} redirects to the marketplace`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status()).toBe(307);
      expect(new URL(response.headers().location, response.url()).pathname).toBe('/marketplace');
    });
  }

  for (const path of ['/signup/external', '/join-request', '/auth/register', '/signup/um6p-student', '/signup/1337-student', '/auth/discord/callback']) {
    test(`legacy registration ${path} redirects to community signup`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status()).toBe(307);
      expect(new URL(response.headers().location, response.url()).pathname).toBe('/signup');
    });
  }

  test('external access requests cannot be submitted through the frontend', async ({ request }) => {
    const response = await request.post('/api/join-requests', { data: { email: 'external@example.com' } });
    expect(response.status()).toBe(410);
  });
});
