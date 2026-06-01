# swiftcart-automation

Playwright + TypeScript end-to-end automation framework for validating core user journeys in Swiftcart.

## Tech Stack

- Playwright
- TypeScript
- Page Object Model (POM)
- GitHub Actions

## Project Structure

```text
swiftcart-automation/
├── tests/                        # Test specifications grouped by feature flow
│   ├── login.spec.ts             # Login success and failure scenarios
│   ├── products.spec.ts          # Product search and category filtering scenarios
│   ├── cart.spec.ts              # Add-to-cart and cart behavior scenarios
│   └── checkout.spec.ts          # Checkout form validation scenarios
├── pages/                        # Page Object Model classes (selectors + actions)
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── utils/
│   └── testData.ts               # Test data and reusable constants
├── .github/workflows/
│   └── playwright.yml            # CI pipeline to run tests on push/PR
├── playwright.config.ts          # Playwright configuration and projects
├── package.json                  # Scripts and dependencies
└── README.md
```

## Installation

```bash
npm install
npx playwright install
```

## Target application

Tests run against the published Swiftcart Lovable deployment. Override the URL if you republish under a different hostname:

```bash
BASE_URL=https://your-swiftcart.lovable.app npm test
```

The default is `https://swiftcart-sanaev-dev.lovable.app`. The older `swiftcart-shop-app.lovable.app` URL is no longer published and will cause all tests to fail.

## Run Tests

Run the full suite:

```bash
npx playwright test
```

Optional headed execution:

```bash
npx playwright test --headed
```

## View HTML Report

After test execution, open the Playwright HTML report:

```bash
npx playwright show-report
```

## Test Coverage

This framework currently validates the following functional areas:

- **Login**: successful login and invalid credential handling
- **Products**: product search and category filter behavior
- **Cart**: add item to cart and cart workflow validation
- **Checkout**: required-field and form validation behavior

## Project Note

This automation framework targets **Swiftcart**, a demo e-commerce application created for portfolio and interview demonstration purposes.