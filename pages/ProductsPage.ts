import { expect, Locator, Page } from "@playwright/test";

export class ProductsPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly filterDropdown: Locator;
  readonly categoryCheckbox: Locator;
  readonly productCard: Locator;
  readonly productLink: Locator;
  readonly productCountText: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page
      .getByTestId("products-search-input")
      .or(page.getByTestId("search-input"))
      .or(page.getByRole("searchbox"))
      .or(page.locator("input[placeholder*='Search']"));
    this.searchButton = page
      .getByTestId("search-submit")
      .or(page.getByRole("button", { name: /search/i }));
    this.filterDropdown = page
      .getByTestId("products-filter")
      .or(page.locator("select[data-testid='category-filter'], select"));
    this.categoryCheckbox = page
      .getByTestId("category-checkbox")
      .or(page.getByRole("checkbox"));
    this.productCard = page.getByTestId("product-card");
    this.productLink = page.locator("a[href*='/products/p']");
    this.productCountText = page
      .getByTestId("products-count")
      .or(page.getByText(/products?/i));
    this.addToCartButton = page
      .getByTestId("add-to-cart")
      .or(page.getByRole("button", { name: /add to cart/i }));
  }

  async goto(): Promise<void> {
    await this.page.goto("/products");
  }

  async searchProduct(query: string): Promise<void> {
    await this.searchInput.first().fill(query);
    await this.searchInput.first().press("Enter").catch(() => {});
    await expect(this.page).toHaveURL(new RegExp(`q=${query}`, "i"));
  }

  async applyCategoryFilter(category: string): Promise<void> {
    const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
    const categoryOption = this.page
      .getByTestId(`filter-category-${categorySlug}`)
      .or(this.page.getByTestId(`filter-${categorySlug}`))
      .or(this.page.getByRole("checkbox", { name: new RegExp(category, "i") }));
    if (await categoryOption.first().isVisible().catch(() => false)) {
      await categoryOption.first().check().catch(async () => {
        await categoryOption.first().click();
      });
      return;
    }

    if (await this.filterDropdown.first().isVisible().catch(() => false)) {
      await this.filterDropdown.first().selectOption({ label: category }).catch(async () => {
        await this.filterDropdown.first().selectOption({ value: category.toLowerCase() });
      });
    }
  }

  async addFirstProductToCart(): Promise<void> {
    await expect(this.productCard.first()).toBeVisible({ timeout: 7000 });

    if (await this.addToCartButton.first().isVisible().catch(() => false)) {
      await this.addToCartButton.first().click();
      return;
    }

    await this.productCard.first().click();
    await expect(this.page).toHaveURL(/\/products\/p/);
    await expect(this.addToCartButton.first()).toBeVisible({ timeout: 7000 });
    await this.addToCartButton.first().click();
    await expect(this.page.getByTestId("cart-count")).toHaveText(/[1-9]/, { timeout: 10000 });
  }

  async expectProductsVisible(): Promise<void> {
    await expect(this.productCard.first()).toBeVisible({ timeout: 7000 });
  }
}
