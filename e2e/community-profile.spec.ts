import { test, expect, Page } from '@playwright/test';

const viewer = { id: 1, fullName: 'Test Student', email: 'student@um6p.ma', userRole: 'student', isVerified: true };
const publicProfile = {
  user: { id: 2, fullName: 'Test Staff', userRole: 'staff', department: 'UM6P', isVerified: true, createdAt: '2025-01-10T00:00:00Z' },
  stats: { activeListingsCount: 2 },
  items: [
    { id: 10, title: 'Study desk', price: 350, category: 'Furniture', condition: 'Good', photos: [] },
    { id: 11, title: 'Desk lamp', price: 80, category: 'Home & Garden', condition: 'Like New', photos: [] },
  ],
  pagination: { page: 1, limit: 12, total: 2, totalPages: 1, hasMore: false },
};

async function authenticate(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('access_token', 'test-community-token');
    localStorage.setItem('refresh_token', 'test-refresh-token');
    localStorage.setItem('token_expires', String(Date.now() + 3600000));
  });
}

async function mockApi(page: Page, profile: any = publicProfile, status = 200) {
  await page.route(/\/(users|items|auth)\//, async route => {
    const path = new URL(route.request().url()).pathname;
    const headers = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization,content-type', 'access-control-allow-methods': 'GET,POST,OPTIONS' };
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
    if (path.endsWith('/users/profile')) return route.fulfill({ json: viewer, headers });
    if (path.includes('/users/2/community')) return route.fulfill({ status, json: profile, headers });
    if (path.endsWith('/items/favorites')) return route.fulfill({ json: { success: true, data: [], pagination: { page: 1, limit: 12, total: 0, pages: 0 } }, headers });
    return route.fulfill({ json: {}, headers });
  });
}

test('a student can view another member profile and open their listings', async ({ page }, testInfo) => {
  await authenticate(page);
  await mockApi(page);
  await page.goto('/user/2');
  await expect(page.getByRole('heading', { name: 'Test Staff' })).toBeVisible();
  await expect(page.getByText('Staff · UM6P', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Study desk/ })).toHaveAttribute('href', '/item/10');
  await expect(page.getByRole('link', { name: 'Contact on WhatsApp' })).toHaveCount(0);
  await expect(page.getByText('Purchase history', { exact: true })).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath('community-profile-desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { name: 'Test Staff' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('community-profile-mobile.png'), fullPage: true });
});

test('WhatsApp contact is available when the member opts in', async ({ page }) => {
  await authenticate(page);
  await mockApi(page, { ...publicProfile, user: { ...publicProfile.user, whatsappNumber: '+212612345678' } });
  await page.goto('/user/2');
  await expect(page.getByRole('link', { name: 'Contact on WhatsApp' })).toHaveAttribute('href', 'https://wa.me/212612345678');
});

test('an empty profile has a clear listing state', async ({ page }) => {
  await authenticate(page);
  await mockApi(page, { ...publicProfile, items: [], stats: { activeListingsCount: 0 } });
  await page.goto('/user/2');
  await expect(page.getByRole('heading', { name: 'No items available right now' })).toBeVisible();
});

test('unavailable members have a clear error state', async ({ page }) => {
  await authenticate(page);
  await mockApi(page, { message: 'Community member not found' }, 404);
  await page.goto('/user/2');
  await expect(page.getByRole('heading', { name: 'Profile unavailable' })).toBeVisible();
  await expect(page.getByText('This community member could not be found.')).toBeVisible();
});

test('members can open a profile from an item listing', async ({ page }) => {
  await authenticate(page);
  await mockApi(page);
  await page.route('**/items/10', route => route.fulfill({
    headers: { 'access-control-allow-origin': '*' },
    json: {
      id: 10, title: 'Study desk', description: 'A desk for your study space.', price: 350,
      condition: 'Good', category: 'Furniture', quantity: 1, images: [],
      sellerId: 2, seller: publicProfile.user, isActive: true, isSold: false, anonymous: false,
    },
  }));
  await page.goto('/item/10');
  const profileLink = page.getByRole('link', { name: 'View profile', exact: true }).first();
  await expect(profileLink).toHaveAttribute('href', '/user/2');
  await profileLink.click();
  await expect(page.getByRole('heading', { name: 'Test Staff' })).toBeVisible();
});

test('members can paginate through another member listings', async ({ page }) => {
  await authenticate(page);
  await mockApi(page);
  await page.route(/\/users\/2\/community/, route => {
    const pageNumber = Number(new URL(route.request().url()).searchParams.get('page') || 1);
    return route.fulfill({ headers: { 'access-control-allow-origin': '*' }, json: {
      ...publicProfile,
      stats: { activeListingsCount: 13 },
      items: pageNumber === 1 ? publicProfile.items : [{ ...publicProfile.items[0], id: 12, title: 'Remaining item' }],
      pagination: { page: pageNumber, limit: 12, total: 13, totalPages: 2, hasMore: pageNumber === 1 },
    } });
  });
  await page.goto('/user/2');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('Page 2 of 2')).toBeVisible();
  await expect(page.getByRole('link', { name: /Remaining item/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled();
});

for (const email of ['member@um6p.ma', 'member@student.1337.ma']) {
  test(`community email signup works for ${email}`, async ({ page }) => {
    await mockApi(page);
    await page.route(/\/auth\/(send-otp|verify-otp|signup)/, async route => {
      const headers = { 'access-control-allow-origin': '*', 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'POST,OPTIONS' };
      if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
      if (route.request().url().includes('/auth/signup')) {
        return route.fulfill({ status: 201, json: {
          user: viewer, access_token: 'test-token', refresh_token: 'test-refresh', expires_in: 3600,
        }, headers });
      }
      return route.fulfill({ json: { message: 'Verified', registrationToken: 'test-email-proof' }, headers });
    });
    await page.goto('/signup');
    await page.getByPlaceholder('your.name@um6p.ma').fill(email);
    await page.getByRole('button', { name: 'Send Verification Code' }).click();
    await page.getByPlaceholder('000000').fill('123456');
    await page.getByRole('button', { name: 'Verify Code' }).click();
    await expect(page.getByRole('heading', { name: 'Complete Your Profile' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Student', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Staff', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /seller|Discord|External People/i })).toHaveCount(0);
    await page.getByPlaceholder('Enter your first name').fill('Test');
    await page.getByPlaceholder('Enter your last name').fill('Member');
    await page.getByPlaceholder('0612345678 or +212612345678').fill('0612345678');
    await page.getByPlaceholder('Create a strong password').fill('Community123');
    await page.getByPlaceholder('Confirm your password').fill('Community123');
    const role = email.endsWith('@student.1337.ma') ? 'student' : 'staff';
    await page.getByRole('button', { name: role === 'staff' ? 'Staff' : 'Student', exact: true }).click();
    const signup = page.waitForRequest(request => request.url().includes('/auth/signup') && request.method() === 'POST');
    await page.getByRole('button', { name: 'Create Account', exact: true }).click();
    const data = (await signup).postDataJSON();
    expect(data).toMatchObject({ email, role, registrationToken: 'test-email-proof' });
  });
}

test('signup rejects other email domains before sending a code', async ({ page }) => {
  let otpRequests = 0;
  page.on('request', request => { if (request.url().includes('/auth/send-otp')) otpRequests++; });
  await page.goto('/signup');
  await page.getByPlaceholder('your.name@um6p.ma').fill('external@gmail.com');
  await page.getByRole('button', { name: 'Send Verification Code' }).click();
  await expect(page.getByText('Use your @um6p.ma or @student.1337.ma community email.')).toBeVisible();
  expect(otpRequests).toBe(0);
});
