import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',

    specPattern: 'cypress/e2e/**/*.js',

    // Node event listeners (optional)
    setupNodeEvents(on, config) {
      // Implement any event listeners or plugins here if needed
    },

    screenshotOnRunFailure: true,
    video: true,
  },
});