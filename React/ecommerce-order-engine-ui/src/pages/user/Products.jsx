
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getProducts } from "../../services/productApi";
import { getAvailability } from "../../services/inventoryApi";

import { useCart } from "../../context/CartContext";
import ProductImage from "../../components/ProductImage";

import "../../styles/components/ProductCard.css";

import {
  isStorefrontProduct,
} from "../../utils/storefrontProducts";

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("All Products");

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const {
    addToCart,
    loading: cartLoading,
  } = useCart();

  const notificationTimer = useRef(null);

  /*
   * =========================================================
   * LOAD STOREFRONT PRODUCTS
   * =========================================================
   *
   * Retrieve public product information and public
   * availability indicators.
   *
   * Exact inventory quantities are not exposed.
   */

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const productData = await getProducts();

        const productsWithAvailability =
          await Promise.all(
            productData.map(async (product) => {
              const availability =
                await getAvailability(product.id);

              return {
                ...product,
                inStock: availability.inStock,
                availability: availability.availability,
              };
            })
          );

        if (!cancelled) {
          setProducts(
            productsWithAvailability.filter(
              isStorefrontProduct
            )
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load products"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================================================
   * CLEAN UP NOTIFICATION TIMER
   * =========================================================
   */

  useEffect(() => {
    return () => {
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
      }
    };
  }, []);

  /*
   * =========================================================
   * DISMISS ADD TO CART NOTIFICATION
   * =========================================================
   */

  function dismissNotification() {
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
      notificationTimer.current = null;
    }

    setMessage("");
  }

  /*
   * =========================================================
   * DISPLAY ADD TO CART NOTIFICATION
   * =========================================================
   */

  function showCartNotification(productName) {
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }

    setMessage(
      `${productName} added to cart successfully!`
    );

    notificationTimer.current = setTimeout(() => {
      setMessage("");
      notificationTimer.current = null;
    }, 3000);
  }

  /*
   * =========================================================
   * ADD PRODUCT TO CART
   * =========================================================
   */

  function handleAddToCart(product) {
    if (!product || !product.inStock || cartLoading) {
      return;
    }

    addToCart(product);

    showCartNotification(product.name);
  }

  /*
   * =========================================================
   * PRODUCT CATEGORIES
   * =========================================================
   */

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    ).sort();

    return [
      "All Products",
      ...uniqueCategories,
    ];
  }, [products]);

  /*
   * =========================================================
   * FILTER AND SORT PRODUCTS
   * =========================================================
   */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /*
     * CATEGORY FILTER
     */

    if (selectedCategory !== "All Products") {
      result = result.filter(
        (product) =>
          product.category === selectedCategory
      );
    }

    /*
     * SEARCH
     */

    const query = searchTerm.trim().toLowerCase();

    if (query) {
      result = result.filter((product) => {
        const name =
          product.name?.toLowerCase() || "";

        const category =
          product.category?.toLowerCase() || "";

        const brand =
          product.brand?.toLowerCase() || "";

        return (
          name.includes(query) ||
          category.includes(query) ||
          brand.includes(query)
        );
      });
    }

    /*
     * SORTING
     */

    switch (sortBy) {
      case "price-low-high":
        result.sort(
          (a, b) =>
            Number(a.price) - Number(b.price)
        );
        break;

      case "price-high-low":
        result.sort(
          (a, b) =>
            Number(b.price) - Number(a.price)
        );
        break;

      case "name-a-z":
        result.sort(
          (a, b) =>
            a.name.localeCompare(b.name)
        );
        break;

      case "name-z-a":
        result.sort(
          (a, b) =>
            b.name.localeCompare(a.name)
        );
        break;

      case "in-stock-first":
        result.sort(
          (a, b) =>
            Number(b.inStock) - Number(a.inStock)
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    products,
    selectedCategory,
    searchTerm,
    sortBy,
  ]);

  /*
   * =========================================================
   * LOADING STATE
   * =========================================================
   */

  if (loading) {
    return (
      <div className="products-page">
        <div className="products-loading-card">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  /*
   * =========================================================
   * RENDER STOREFRONT
   * =========================================================
   */

  return (
    <div className="products-page">

      {/* ============================================= */}
      {/* HEADER AND FILTERS */}
      {/* ============================================= */}

      <section className="products-hero">
        <div className="products-heading">
          <span className="products-badge">
            Store
          </span>

          <h1>Explore Our Products</h1>

          <p className="products-subtitle">
            Discover products across different
            categories, compare prices and shop
            with confidence.
          </p>
        </div>

        <div className="products-filter-block">
          <h3 className="filter-title">
            Shop by Category
          </h3>

          {/* CATEGORY FILTER */}

          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  selectedCategory === category
                    ? "category-pill active"
                    : "category-pill"
                }
                onClick={() =>
                  setSelectedCategory(category)
                }
              >
                {category}
              </button>
            ))}
          </div>

          {/* SEARCH AND SORT */}

          <div className="products-toolbar">
            <input
              type="text"
              className="search-box"
              placeholder="Search products, categories or brands..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            <div className="sort-box">
              <label
                htmlFor="sortBy"
                className="sort-label"
              >
                Sort By
              </label>

              <select
                id="sortBy"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
              >
                <option value="default">
                  Default
                </option>

                <option value="price-low-high">
                  Price: Low to High
                </option>

                <option value="price-high-low">
                  Price: High to Low
                </option>

                <option value="name-a-z">
                  Name: A to Z
                </option>

                <option value="name-z-a">
                  Name: Z to A
                </option>

                <option value="in-stock-first">
                  In Stock First
                </option>
              </select>
            </div>
          </div>

          <p className="products-count">
            Showing {filteredProducts.length} of{" "}
            {products.length} products
          </p>
        </div>
      </section>

      {/* ============================================= */}
      {/* FLOATING ADD TO CART NOTIFICATION */}
      {/* ============================================= */}

      {message && (
        <div
          className="cart-toast"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            className="cart-toast-icon"
            aria-hidden="true"
          >
            ✓
          </span>

          <div className="cart-toast-content">
            <strong>
              Added to Cart
            </strong>

            <p>{message}</p>
          </div>

          <button
            type="button"
            className="cart-toast-close"
            onClick={dismissNotification}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}

      {/* ============================================= */}
      {/* ERROR MESSAGE */}
      {/* ============================================= */}

      {error && (
        <div
          className="error-message"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* ============================================= */}
      {/* PRODUCT GRID */}
      {/* ============================================= */}

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <h3>No matching products found</h3>

          <p>
            Try changing the category, search text,
            or sort option.
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div
              className="product-card"
              key={product.id}
            >

              {/* PRODUCT HEADER */}

              <div className="product-card-header">
                <span
                  className="product-category"
                  title={product.category}
                >
                  {product.category}
                </span>

                <span
                  className={
                    product.inStock
                      ? "stock-status stock-status-in"
                      : "stock-status stock-status-out"
                  }
                >
                  <span className="stock-dot" />

                  {product.inStock
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>

              {/* PRODUCT IMAGE */}

              <div className="product-image-panel">
                <ProductImage
                  productId={product.id}
                  productName={product.name}
                />
              </div>

              {/* PRODUCT CONTENT */}

              <div className="product-content">
                <h2>{product.name}</h2>

                {product.brand && (
                  <p className="product-brand">
                    {product.brand}
                  </p>
                )}

                <p className="product-price">
                  {priceFormatter.format(
                    product.price
                  )}
                </p>

                <p
                  className={
                    product.inStock
                      ? "in-stock"
                      : "out-of-stock"
                  }
                >
                  {product.inStock
                    ? "Available"
                    : "Currently unavailable"}
                </p>
              </div>

              {/* ADD TO CART BUTTON */}

              <button
                type="button"
                className="primary-button product-button"
                disabled={
                  !product.inStock || cartLoading
                }
                onClick={() =>
                  handleAddToCart(product)
                }
              >
                {!product.inStock
                  ? "Out of Stock"
                  : cartLoading
                    ? "Loading Cart..."
                    : "Add to Cart"}
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
