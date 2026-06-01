import { test } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { ProductsPage } from "../pages/ProductsPage";
import { testData } from "../utils/testData";

test.describe("Swiftcart Checkout", () => {
  test("should validate checkout form when required fields are empty", async ({ page }) => {
    test.setTimeout(60_000);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await productsPage.goto();
    await productsPage.addFirstProductToCart();
    await cartPage.openCart();
    await cartPage.goToCheckout();

    await checkoutPage.fillCheckoutForm({
      firstName: testData.invalidCheckout.firstName,
      lastName: testData.invalidCheckout.lastName,
      address: testData.invalidCheckout.address,
      city: testData.invalidCheckout.city,
      zip: testData.invalidCheckout.zip
    });
    await checkoutPage.submitOrder();
    await checkoutPage.expectValidationError();
  });
});
