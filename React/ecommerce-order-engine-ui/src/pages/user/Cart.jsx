
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

// Reuse the existing product image component.
import ProductImage from "../../components/ProductImage";

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function Cart() {
  const {
    cartItems,
    loading: cartLoading,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const itemCount = cartItems.reduce(
    (sum, item) => sum + item.cartQuantity,
    0
  );

  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.cartQuantity,
    0
  );

  const isGuest = !isAuthenticated;

  /*
   * =========================================================
   * LOADING CART
   * =========================================================
   */

  if (authLoading || cartLoading) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>

        <h1>Loading Your Cart</h1>

        <p>
          Please wait while we restore your shopping cart.
        </p>
      </div>
    );
  }

  /*
   * =========================================================
   * EMPTY CART
   * =========================================================
   */

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>

        <h1>Your Cart is Empty</h1>

        <p>
          Add some products to your cart
          before proceeding to checkout.
        </p>

        <Link
          to="/shop/products"
          className="primary-button browse-products-button"
        >
          <ShoppingBag size={19} strokeWidth={2} />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  /*
   * =========================================================
   * SHOPPING CART
   * =========================================================
   */

  return (
    <div className="cart-page">
      {/* PAGE HEADER */}

      <div className="cart-page-header">
        <div>
          <h1>Shopping Cart</h1>

          <p>
            Review your products and update
            quantities before checkout.
          </p>
        </div>
      </div>

      <div className="cart-layout">
        {/* CART ITEMS */}

        <div className="cart-items">
          {cartItems.map((item) => (
            <div
              className="cart-item"
              key={item.id}
            >
              {/*
               * =====================================
               * ACTUAL PRODUCT IMAGE
               * =====================================
               *
               * ProductImage loads the image using
               * the existing backend image API.
               *
               * The product ID is used internally
               * to retrieve the correct image.
               *
               * It is not displayed to the user.
               */}

              <div className="cart-product-icon cart-product-image">
                <ProductImage
                  productId={item.id}
                  productName={item.name}
                />
              </div>

              {/* PRODUCT INFORMATION */}

              <div className="cart-product-info">
                <p className="product-category">
                  {item.category}
                </p>

                <h3>{item.name}</h3>

                {/*
                 * Product ID intentionally hidden.
                 *
                 * We still use item.id internally
                 * for cart updates and image loading.
                 */}

                {item.brand && (
                  <p className="cart-product-brand">
                    {item.brand}
                  </p>
                )}

                <p className="cart-product-price">
                  {priceFormatter.format(
                    Number(item.price)
                  )}
                </p>
              </div>

              {/* QUANTITY CONTROLS */}

              <div className="cart-quantity">
                <p>Quantity</p>

                <div className="quantity-controls">
                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                    disabled={item.cartQuantity <= 1}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    −
                  </button>

                  <span>{item.cartQuantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* PRODUCT SUBTOTAL */}

              <div className="cart-subtotal">
                <p>Subtotal</p>

                <strong>
                  {priceFormatter.format(
                    Number(item.price) *
                      item.cartQuantity
                  )}
                </strong>
              </div>

              {/* REMOVE ITEM */}

              <button
                type="button"
                className="remove-button"
                onClick={() =>
                  removeFromCart(item.id)
                }
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* ORDER SUMMARY */}

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{itemCount}</span>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              {priceFormatter.format(total)}
            </span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span className="free-delivery">
              Free
            </span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <span>
              {priceFormatter.format(total)}
            </span>
          </div>

          {/* GUEST CHECKOUT */}

          {isGuest ? (
            <>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.5,
                  marginTop: "16px",
                }}
              >
                You can browse and add products
                as a guest. Sign in or create
                an account to place an order.
              </p>

              <Link
                to="/login"
                state={{
                  from: {
                    pathname: "/shop/checkout",
                  },
                }}
                className="primary-button checkout-button"
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Sign In to Checkout
              </Link>

              <Link
                to="/register"
                state={{
                  from: {
                    pathname: "/shop/checkout",
                  },
                }}
                className="continue-shopping"
                style={{
                  display: "block",
                  marginTop: "12px",
                  textAlign: "center",
                }}
              >
                Create an Account
              </Link>
            </>
          ) : (
            /*
             * All authenticated roles can shop.
             *
             * CUSTOMER
             * ROOT
             * SELLER_ADMIN
             * IT_SUPPORT
             */
            <Link
              to="/shop/checkout"
              className="primary-button checkout-button"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              Proceed to Checkout
            </Link>
          )}

          {/* CLEAR CART */}

          <button
            type="button"
            className="clear-cart-button"
            onClick={clearCart}
          >
            Clear Cart
          </button>

          {/* CONTINUE SHOPPING */}

          <Link
            to="/shop/products"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Cart;
