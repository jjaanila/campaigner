const { defineConfig } = require('@playwright/test')

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: 'http://localhost:8080',
    viewport: { width: 1980, height: 1024 },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npx http-server dist -p 8080',
    port: 8080,
    reuseExistingServer: true,
  },
})
