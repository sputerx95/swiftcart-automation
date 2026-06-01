import { expect, Locator, Page } from "@playwright/test";

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email?: string;
  address: string;
  city: string;
  state?: string;
  zip: string;
  country?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
};

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly countryInput: Locator;
  readonly emailInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvcInput: Locator;
  readonly placeOrderButton: Locator;
  readonly validationMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page
      .getByTestId("checkout-first-name")
      .or(page.locator("input[name='firstName'], input[placeholder*='First']"));
    this.lastNameInput = page
      .getByTestId("checkout-last-name")
      .or(page.locator("input[name='lastName'], input[placeholder*='Last']"));
    this.addressInput = page
      .getByTestId("checkout-address")
      .or(page.locator("input[name='address'], input[placeholder*='Address']"));
    this.emailInput = page
      .getByTestId("checkout-email")
      .or(page.getByRole("textbox", { name: /email/i }));
    this.cityInput = page
      .getByTestId("checkout-city")
      .or(page.locator("input[name='city'], input[placeholder*='City']"));
    this.stateInput = page
      .getByTestId("checkout-state")
      .or(page.locator("input[name='state'], input[placeholder*='State']"));
    this.zipInput = page
      .getByTestId("checkout-zip")
      .or(page.locator("input[name='zip'], input[placeholder*='Zip'], input[placeholder*='Postal']"));
    this.countryInput = page
      .getByTestId("checkout-country")
      .or(page.locator("input[name='country'], input[placeholder*='Country']"));
    this.cardNumberInput = page
      .getByTestId("payment-card-number")
      .or(page.getByRole("textbox", { name: /card number/i }));
    this.cardExpiryInput = page
      .getByTestId("payment-card-expiry")
      .or(page.getByRole("textbox", { name: /expiry|exp/i }));
    this.cardCvcInput = page
      .getByTestId("payment-card-cvc")
      .or(page.getByRole("textbox", { name: /cvc|cvv/i }));
    this.placeOrderButton = page
      .getByTestId("place-order")
      .or(page.getByRole("button", { name: /place order|submit|pay/i }));
    this.validationMessage = page
      .getByTestId("checkout-validation-error")
      .or(page.locator(".error, .text-red-500, [role='alert']"));
  }

  async fillCheckoutForm(data: CheckoutFormData): Promise<void> {
    await this.firstNameInput.first().fill(data.firstName);
    await this.lastNameInput.first().fill(data.lastName);
    if (await this.emailInput.first().isVisible().catch(() => false)) {
      await this.emailInput.first().fill(data.email ?? "");
    }
    await this.addressInput.first().fill(data.address);
    await this.cityInput.first().fill(data.city);
    if (await this.stateInput.first().isVisible().catch(() => false)) {
      await this.stateInput.first().fill(data.state ?? "");
    }
    await this.zipInput.first().fill(data.zip);
    if (await this.countryInput.first().isVisible().catch(() => false)) {
      await this.countryInput.first().fill(data.country ?? "");
    }
    if (await this.cardNumberInput.first().isVisible().catch(() => false)) {
      await this.cardNumberInput.first().fill(data.cardNumber ?? "");
    }
    if (await this.cardExpiryInput.first().isVisible().catch(() => false)) {
      await this.cardExpiryInput.first().fill(data.cardExpiry ?? "");
    }
    if (await this.cardCvcInput.first().isVisible().catch(() => false)) {
      await this.cardCvcInput.first().fill(data.cardCvc ?? "");
    }
  }

  async submitOrder(): Promise<void> {
    await this.placeOrderButton.first().click();
  }

  async expectValidationError(): Promise<void> {
    const generalError = this.page.getByText(/please fix the highlighted fields and try again/i);
    if (await generalError.first().isVisible().catch(() => false)) {
      await expect(generalError.first()).toBeVisible({ timeout: 7000 });
      return;
    }
    await expect(this.validationMessage.first()).toBeVisible({ timeout: 7000 });
  }
}
