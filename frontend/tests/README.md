# E2E Testing with Playwright

This directory contains end-to-end tests for the React Flask Starter project using Playwright.

## Setup

1. Install Playwright browsers:
   ```bash
   npm run playwright:install
   ```

## Running Tests

### Local Development
To test against your local development server (http://localhost:3000):
```bash
npm run test:e2e
```

### Shipyard Environment
To test against a Shipyard environment:

1. Set environment variables:
   ```bash
   export BASE_URL=https://your-environment.dev.nadnad.shipyard.host
   export SHIPYARD_BYPASS_TOKEN=your-bypass-token
   ```

2. Run the tests:
   ```bash
   npm run test:e2e
   ```

### Other Options
- Run tests with UI mode: `npm run test:e2e:ui`
- Run tests in headed mode (see browser): `npm run test:e2e:headed`

## Test Files

- `material-ui-components.spec.js` - Tests for Material-UI components and headings

## Configuration

- `playwright.config.js` - Main Playwright configuration
- `.env.test` - Example environment configuration