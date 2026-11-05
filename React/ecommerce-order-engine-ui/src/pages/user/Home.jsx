
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { getProducts } from "../../services/productApi";
import { getAvailability } from "../../services/inventoryApi";

import { useAuth } from "../../context/AuthContext";
import ProductImage from "../../components/ProductImage";

import {
  isStorefrontProduct,
  selectFeaturedProducts,
} from "../../utils/storefrontProducts";

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  /*
   * =========================================================
   * SHOPPING PERMISSIONS
   * =========================================================
   *
   * Every authenticated role can shop and view own orders:
   *
   * CUSTOMER
   * ROOT
   * SELLER_ADMIN
   * IT_SUPPORT
   *
   * Administrative roles do not restrict shopping.
   */

  const canViewOwnOrders =
    !authLoading && isAuthenticated;

  /*
   * =========================================================
   * LOAD FEATURED PRODUCTS
   * =========================================================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadFeaturedProducts() {
      try {
        setLoading(true);
        setError("");

        // Fetch public products from Spring Boot.
        const products = await getProducts();

        // Exclude known development and test products.
        const publicProducts =
          products.filter(isStorefrontProduct);

        // Fetch public stock availability.
        // Exact inventory quantities remain private.
        const productsWithAvailability =
          await Promise.all(
            publicProducts.map(async (product) => {
              try {
                const availability =
                  await getAvailability(product.id);

                return {
                  ...product,
                  inStock: availability.inStock,
                  availability:
                    availability.availability,
                };
              } catch {
                // Never assume stock exists if
                // the availability request fails.
                return {
                  ...product,
                  inStock: false,
                  availability: "UNAVAILABLE",
                };
              }
            })
          );

        // Select up to six featured products.
        const selectedProducts =
          selectFeaturedProducts(
            productsWithAvailability,
            6
          );

        if (!cancelled) {
          setFeaturedProducts(selectedProducts);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              "Unable to load featured products"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFeaturedProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * =========================================================
   * HOMEPAGE
   * =========================================================
   */

  return (
    <div>
      {/* ============================================= */}
      {/* HERO SECTION */}
      {/* ============================================= */}

      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">
            SIMPLE. FAST. RELIABLE.
          </p>

          <h1>
            Everything You Need,
            All in One Place
          </h1>

          <p className="hero-description">
            Discover quality products,
            manage your cart and place
            orders through our simple
            shopping experience.
          </p>

          <div className="hero-actions">
            {/* SHOP NOW: EVERYONE */}

            <Link
              to="/shop/products"
              className="hero-shop-button"
            >
              <span>Shop Now</span>

              <ArrowRight
                size={19}
                strokeWidth={2.3}
                aria-hidden="true"
              />
            </Link>

            {/* MY ORDERS: ALL AUTHENTICATED ROLES */}

            {canViewOwnOrders && (
              <Link
                to="/shop/orders"
                className="hero-orders-button"
              >
                My Orders
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* SHOP FEATURES */}
      {/* ============================================= */}

      <section className="section">
        <div className="section-header">
          <h2>Shop With Us</h2>

          <p>
            Everything you need for a
            simple shopping experience.
          </p>
        </div>

        <div className="feature-grid">
          {/* BROWSE PRODUCTS */}

          <div className="feature-card">
            <div className="feature-icon">
              🛍️
            </div>

            <h3>Browse Products</h3>

            <p>
              Explore our product catalogue,
              prices and live availability.
            </p>

            <Link
              to="/shop/products"
              className="feature-link"
            >
              View Products →
            </Link>
          </div>

          {/* SHOPPING CART */}

          <div className="feature-card">
            <div className="feature-icon">
              🛒
            </div>

            <h3>Shopping Cart</h3>

            <p>
              Add your favourite products
              and manage quantities before
              checkout.
            </p>

            <Link
              to="/shop/cart"
              className="feature-link"
            >
              View Cart →
            </Link>
          </div>

          {/* TRACK OWN ORDERS */}

          <div className="feature-card">
            <div className="feature-icon">
              📦
            </div>

            <h3>Track Orders</h3>

            <p>
              View your previous purchases,
              payment information and
              order status.
            </p>

            <Link
              to={
                canViewOwnOrders
                  ? "/shop/orders"
                  : "/login"
              }
              state={
                canViewOwnOrders
                  ? undefined
                  : {
                      from: {
                        pathname: "/shop/orders",
                      },
                    }
              }
              className="feature-link"
            >
              {canViewOwnOrders
                ? "My Orders →"
                : "Sign in to view orders →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* FEATURED PRODUCTS */}
      {/* ============================================= */}

      <section className="section">
        <div className="section-header">
          <h2>Featured Products</h2>

          <p>
            Explore popular products from
            different categories in our store.
          </p>
        </div>

        {/* LOADING */}

        {loading && (
          <p>Loading featured products...</p>
        )}

        {/* ERROR */}

        {error && (
          <p
            className="error-message"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* EMPTY STATE */}

        {!loading &&
          !error &&
          featuredProducts.length === 0 && (
            <p>No featured products available.</p>
          )}

        {/* FEATURED PRODUCT CARDS */}

        {!loading &&
          !error &&
          featuredProducts.length > 0 && (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <div
                  className="product-card"
                  key={product.id}
                >
                  {/* PRODUCT IMAGE */}

                  <div className="product-image-panel">
                    <ProductImage
                      productId={product.id}
                      productName={product.name}
                    />
                  </div>

                  {/* CATEGORY */}

                  <p className="product-category">
                    {product.category}
                  </p>

                  {/* PRODUCT NAME */}

                  <h3>{product.name}</h3>

                  {/* BRAND */}

                  {product.brand && (
                    <p className="product-brand">
                      {product.brand}
                    </p>
                  )}

                  {/* PRICE */}

                  <p className="product-price">
                    {priceFormatter.format(
                      Number(product.price)
                    )}
                  </p>

                  {/* AVAILABILITY */}

                  <p
                    className={
                      product.inStock
                        ? "in-stock"
                        : "out-of-stock"
                    }
                  >
                    {product.inStock
                      ? "In Stock"
                      : "Out of Stock"}
                  </p>

                  {/* PRODUCT CATALOGUE LINK */}

                  <Link
                    to="/shop/products"
                    className="primary-button product-button"
                  >
                    View Products
                  </Link>
                </div>
              ))}
            </div>
          )}

        {/* ========================================= */}
        {/* VIEW ALL PRODUCTS */}
        {/* ========================================= */}

        {!loading &&
          !error &&
          featuredProducts.length > 0 && (
            <div className="view-all-container">
              <Link
                to="/shop/products"
                className="view-all-products-button"
              >
                <ShoppingBag
                  size={19}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <span>View All Products</span>

                <ArrowRight
                  size={19}
                  strokeWidth={2}
                  className="view-all-arrow"
                  aria-hidden="true"
                />
              </Link>
            </div>
          )}
      </section>
    </div>
  );
}

export default Home;
