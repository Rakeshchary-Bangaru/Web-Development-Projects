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


  const [customerId, setCustomerId] =
    useState("");

  const [paymentType, setPaymentType] =
    useState("CARD");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [completedOrder, setCompletedOrder] =
    useState(null);


  const total =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.cartQuantity,
      0
    );


  async function handleCheckout(event) {

    event.preventDefault();

    setError("");


    if (cartItems.length === 0) {

      setError(
        "Your cart is empty"
      );

      return;
    }


    const id =
      Number(customerId);


    if (
      Number.isNaN(id) ||
      id <= 0
    ) {

      setError(
        "Please enter a valid customer ID"
      );

      return;
    }


    const checkoutRequest = {

      orderId: Date.now(),

      customerId: id,

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

      setCompletedOrder(order);

      clearCart();

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


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
            <span>Order ID</span>
            <strong>
              {completedOrder.id}
            </strong>
          </div>

          <div>
            <span>Customer</span>
            <strong>
              {completedOrder.customerName}
            </strong>
          </div>

          <div>
            <span>Payment</span>
            <strong>
              {completedOrder.paymentType}
            </strong>
          </div>

          <div>
            <span>Status</span>
            <strong className="paid-status">
              {completedOrder.status}
            </strong>
          </div>

          <div>
            <span>Total</span>
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

        <div className="checkout-form-section">

          <h2>
            Customer Details
          </h2>


          <form
            className="checkout-form"
            onSubmit={handleCheckout}
          >

            <div>

              <label htmlFor="customerId">
                Customer ID
              </label>

              <input
                id="customerId"
                type="number"
                value={customerId}
                onChange={(event) =>
                  setCustomerId(
                    event.target.value
                  )
                }
                placeholder="Enter customer ID"
                required
              />

            </div>


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

              {loading
                ? "Processing..."
                : "Place Order"}

            </button>

          </form>

        </div>


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