import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";

import {
  checkout,
} from "../../services/checkoutApi";


function Checkout() {

  const {
    cartItems,
    clearCart,
  } = useCart();


  /*
   * V7 SECURITY:
   *
   * customerId is intentionally NOT stored in frontend state.
   *
   * The backend identifies the customer from the authenticated
   * JWT access token.
   *
   * This prevents a customer from changing a customer ID in
   * DevTools and attempting to place an order for another user.
   */

  const [paymentType, setPaymentType] =
    useState("CARD");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [completedOrder, setCompletedOrder] =
    useState(null);


  /*
   * Calculate the current cart total for display.
   */
  const total =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.cartQuantity,
      0
    );


  /*
   * =========================================================
   * CHECKOUT
   * =========================================================
   *
   * The request contains:
   *
   * - orderId
   * - paymentType
   * - items
   *
   * It deliberately does NOT contain customerId.
   *
   * Customer identity is resolved by the Spring Boot backend
   * from the JWT userId claim.
   */
  async function handleCheckout(event) {

    event.preventDefault();

    setError("");


    if (cartItems.length === 0) {

      setError(
        "Your cart is empty"
      );

      return;
    }


    const checkoutRequest = {

      orderId: Date.now(),

      paymentType: paymentType,

      items: cartItems.map(
        (item) => ({
          productId: item.id,
          quantity: item.cartQuantity,
        })
      ),
    };


    try {

      setLoading(true);


      const order =
        await checkout(
          checkoutRequest
        );


      setCompletedOrder(
        order
      );


      /*
       * Only clear the cart after the backend confirms
       * that checkout completed successfully.
       */
      clearCart();

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }
  }


  /*
   * =========================================================
   * SUCCESS VIEW
   * =========================================================
   */
  if (completedOrder) {

    return (

      <div className="checkout-success">

        <div className="success-icon">
          ✓
        </div>

        <h1>
          Order Placed Successfully
        </h1>

        <p>
          Your order has been created
          successfully.
        </p>


        <div className="success-order-card">

          <div>

            <span>
              Order ID
            </span>

            <strong>
              {completedOrder.id}
            </strong>

          </div>


          <div>

            <span>
              Customer
            </span>

            <strong>
              {completedOrder.customerName}
            </strong>

          </div>


          <div>

            <span>
              Payment
            </span>

            <strong>
              {completedOrder.paymentType}
            </strong>

          </div>


          <div>

            <span>
              Status
            </span>

            <strong className="paid-status">
              {completedOrder.status}
            </strong>

          </div>


          <div>

            <span>
              Total
            </span>

            <strong>
              ₹{completedOrder.total}
            </strong>

          </div>

        </div>


        <div className="success-actions">

          <Link to="/shop/orders">

            <button className="primary-button">
              View My Orders
            </button>

          </Link>


          <Link to="/shop/products">

            <button className="secondary-button">
              Continue Shopping
            </button>

          </Link>

        </div>

      </div>
    );
  }


  /*
   * =========================================================
   * EMPTY CART VIEW
   * =========================================================
   */
  if (cartItems.length === 0) {

    return (

      <div className="empty-cart">

        <div className="empty-cart-icon">
          🛒
        </div>

        <h1>
          Your Cart is Empty
        </h1>

        <p>
          Add products before proceeding
          to checkout.
        </p>


        <Link to="/shop/products">

          <button className="primary-button">
            Browse Products
          </button>

        </Link>

      </div>
    );
  }


  /*
   * =========================================================
   * CHECKOUT PAGE
   * =========================================================
   */
  return (

    <div>

      <div className="checkout-header">

        <h1>
          Checkout
        </h1>

        <p>
          Review your order and complete
          your purchase.
        </p>

      </div>


      <div className="checkout-layout">


        {/* ===================================================
            CHECKOUT FORM
            =================================================== */}

        <div className="checkout-form-section">

          <h2>
            Payment Details
          </h2>


          <form
            className="checkout-form"
            onSubmit={handleCheckout}
          >

            {/*
             * Customer ID field was intentionally removed.
             *
             * The logged-in customer's identity comes from
             * the JWT access token.
             */}


            <div>

              <label htmlFor="paymentType">
                Payment Method
              </label>


              <select
                id="paymentType"
                value={paymentType}
                onChange={(event) =>
                  setPaymentType(
                    event.target.value
                  )
                }
              >

                <option value="CARD">
                  Card
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="WALLET">
                  Wallet
                </option>

              </select>

            </div>


            {error && (

              <div className="error-message">
                {error}
              </div>

            )}


            <button
              className="primary-button place-order-button"
              type="submit"
              disabled={loading}
            >

              {
                loading
                  ? "Processing..."
                  : "Place Order"
              }

            </button>

          </form>

        </div>


        {/* ===================================================
            ORDER SUMMARY
            =================================================== */}

        <aside className="checkout-summary">

          <h2>
            Order Summary
          </h2>


          <div className="checkout-items">

            {cartItems.map(
              (item) => (

                <div
                  className="checkout-item"
                  key={item.id}
                >

                  <div>

                    <strong>
                      {item.name}
                    </strong>

                    <p>
                      Qty: {item.cartQuantity}
                    </p>

                  </div>


                  <strong>

                    ₹{
                      item.price *
                      item.cartQuantity
                    }

                  </strong>

                </div>

              )
            )}

          </div>


          <hr />


          <div className="summary-row">

            <span>
              Subtotal
            </span>

            <span>
              ₹{total}
            </span>

          </div>


          <div className="summary-row">

            <span>
              Delivery
            </span>

            <span className="free-delivery">
              Free
            </span>

          </div>


          <div className="summary-total">

            <span>
              Total
            </span>

            <span>
              ₹{total}
            </span>

          </div>


          <Link
            to="/shop/cart"
            className="edit-cart-link"
          >
            ← Edit Cart
          </Link>

        </aside>

      </div>

    </div>
  );
}


export default Checkout;