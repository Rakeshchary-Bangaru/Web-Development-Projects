
const TEST_PRODUCT_NAMES = new Set([
  "test laptop",
  "audit test product",
]);

export function isStorefrontProduct(product) {
  if (!product || !product.name) {
    return false;
  }

  const name = product.name.trim().toLowerCase();
  const category =
    product.category?.trim().toLowerCase();

  // Hide known development/test records.
  if (
    TEST_PRODUCT_NAMES.has(name) ||
    category === "testing"
  ) {
    return false;
  }

  // Respect backend active state when provided.
  if (product.active === false) {
    return false;
  }

  return true;
}

export function selectFeaturedProducts(
  products,
  limit = 6
) {
  const candidates = products.filter(
    isStorefrontProduct
  );

  // Show available products first.
  const sorted = [...candidates].sort(
    (a, b) =>
      Number(Boolean(b.inStock)) -
      Number(Boolean(a.inStock))
  );

  const featured = [];
  const selectedIds = new Set();
  const usedCategories = new Set();

  // First pass: one product per category.
  for (const product of sorted) {
    if (featured.length >= limit) {
      break;
    }

    const category = product.category;

    if (
      !usedCategories.has(category) &&
      !selectedIds.has(product.id)
    ) {
      featured.push(product);
      selectedIds.add(product.id);
      usedCategories.add(category);
    }
  }

  // Second pass: fill remaining slots.
  for (const product of sorted) {
    if (featured.length >= limit) {
      break;
    }

    if (!selectedIds.has(product.id)) {
      featured.push(product);
      selectedIds.add(product.id);
    }
  }

  return featured;
}
