import { defineConfig } from '@playwright/test'

/**
 * Tests du formulaire et de la navigation. Lancer d’abord `pnpm dev:essai`
 * (service d’envoi « essai » : rien n’est envoyé), puis `pnpm test:e2e`.
 */
export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  use: {
    baseURL: process.env.BASE ?? 'http://localhost:4321',
    launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
  },
  webServer: {
    command: 'pnpm dev:essai',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
  },
})
