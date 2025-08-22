import { test, expect } from '@playwright/test';

const rpcResponse = {
  jsonrpc: '2.0',
  id: 1,
  result: {
    height: 1,
    finalizedHeight: 1,
    epoch: 0,
    round: 0,
    peers: 4,
  },
};

test('landing has hero', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /JEM/i })).toBeVisible();
});

test('join form submits', async ({ page }) => {
  await page.route('/api/join', (route) => {
    route.fulfill({ status: 200, body: JSON.stringify({ ok: true }), contentType: 'application/json' })
  })
  await page.goto('/join')
  await page.fill('input[name="name"]', 'Test User')
  await page.fill('input[name="email"]', 'test@example.com')
  await page.click('button:has-text("Join")')
  await expect(page.getByRole('status')).toHaveText(/waitlist/i)
})

test.skip('docs roadmap renders content', async ({ page }) => {
  await page.goto('/docs/roadmap');
  await expect(page.getByText('Consensus design')).toBeVisible();
});

test('status page shows numbers', async ({ page }) => {
  await page.route('http://127.0.0.1:7070', (route) => {
    route.fulfill({ body: JSON.stringify(rpcResponse), contentType: 'application/json' });
  });
  await page.goto('/status');
  await expect(page.getByText('Height')).toBeVisible();
  await expect(page.getByText('Finalized')).toBeVisible();
});
