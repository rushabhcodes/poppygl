import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./playwright",
  testMatch: "**/*.pw.ts",
  timeout: 120_000,
  expect: {
    timeout: 30_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5050",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "PORT=5050 bun run start",
    url: "http://localhost:5050",
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
