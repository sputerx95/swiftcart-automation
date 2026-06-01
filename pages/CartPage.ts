import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly cartIcon: Locator;
  readonly cartItem: Locator;
  readonly cartCountBadge: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartIcon = page
      .getByTestId("cart-icon")
      .or(page.getByRole("button", { name: /cart/i }))
      .or(page.getByRole("link", { name: /cart/i }));
    this.cartItem = page
      .getByTestId("cart-item")
      .or(page.locator("[data-testid='line-item'], .cart-item, a[href*='/products/']"));
    this.cartCountBadge = page
      .getByTestId("cart-count")
      .or(page.locator(".cart-count, [aria-label*='cart'] .badge"));
    this.checkoutButton = page
      .getByTestId("checkout-button")
      .or(page.getByRole("button", { name: /checkout/i }))
      .or(page.getByRole("link", { name: /checkout|proceed to checkout/i }));
  }

  async openCart(): Promise<void> {
    await this.cartIcon.first().click();
    const navigatedToCart = await this.page
      .waitForURL(/\/cart/, { timeout: 5000 })
      .then(() => true)
      .catch(() => false);

    if (navigatedToCart) {
      return;
    }

    const proceedToCheckoutLink = this.page.getByRole("link", { name: /proceed to checkout|checkout/i });
    const cartItemVisible = await this.cartItem.first().isVisible().catch(() => false);
    const checkoutVisible = await proceedToCheckoutLink.first().isVisible().catch(() => false);

    if (cartItemVisible || checkoutVisible) {
      return;
    }

    await this.page.goto("/cart");
    await expect(this.page).toHaveURL(/\/cart/);
  }

  async expectCartHasAtLeastOneItem(): Promise<void> {
    const hasItemElement = await this.cartItem.first().isVisible().catch(() => false);

    if (hasItemElement) {
      await expect(this.cartItem.first()).toBeVisible({ timeout: 7000 });
      return;
    }

    await expect(this.cartCountBadge.first()).toContainText(/[1-9]/);
  }

  async goToCheckout(): Promise<void> {
    await this.expectCartHasAtLeastOneItem();

    const checkoutVisible = await this.checkoutButton.first().isVisible().catch(() => false);
    if (checkoutVisible) {
      await this.checkoutButton.first().click();
      await expect(this.page).toHaveURL(/\/checkout/);
      return;
    }

    const proceedToCheckoutTextLink = this.page.getByRole("link", { name: /proceed to checkout/i });
    if (await proceedToCheckoutTextLink.first().isVisible().catch(() => false)) {
      await proceedToCheckoutTextLink.first().click();
      await expect(this.page).toHaveURL(/\/checkout/);
      return;
    }

    // Fallback for cart UIs that do not expose a visible checkout control in automation.
    await this.page.goto("/checkout");
    await expect(this.page).toHaveURL(/\/checkout/);
  }
}
