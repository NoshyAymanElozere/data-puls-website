import { defineConfig, devices } from '@playwright/test'

const apiPort = process.env.E2E_API_PORT ?? '8010'
const webPort = process.env.E2E_WEB_PORT ?? '5179'

export const API_URL = process.env.E2E_API_URL ?? `http://127.0.0.1:${apiPort}/admin`
const WEB_URL = process.env.E2E_WEB_URL ?? `http://127.0.0.1:${webPort}`

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.cache/test-results',
  fullyParallel: false,
  // php artisan serve is single-threaded, so parallel workers only queue behind each other.
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { outputFolder: './e2e/.cache/report', open: 'never' }]],
  use: {
    baseURL: `${WEB_URL}/hirz/`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: './e2e/.cache/admin.json' },
      dependencies: ['setup'],
    },
  ],
  webServer: [
    {
      command: 'node e2e/scripts/start-backend.mjs',
      url: `http://127.0.0.1:${apiPort}/up`,
      env: { E2E_API_PORT: apiPort },
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: `npx vite --host 127.0.0.1 --port ${webPort} --strictPort`,
      url: `${WEB_URL}/hirz/`,
      env: { VITE_API_URL: API_URL },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
})
