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

      // Existing backend requires orderId.
      // Date.now() gives us a positive long value.
      orderId: Date.now(),

      customerId: id,

      paymentType: paymentType,

      items: cartItems.map(
        (item) => ({
          productId: item.id,
          quantity:
            item.cartQuantity,
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

      <div>

        <h1>
          Order Placed Successfully
        </h1>


        <p>
          Order ID:{" "}
          {completedOrder.id}
        </p>


        <p>
          Customer:{" "}
          {completedOrder.customerName}
        </p>


        <p>
          Payment:{" "}
          {completedOrder.paymentType}
        </p>


        <p>
          Status:{" "}
          {completedOrder.status}
        </p>


        <p>
          Total: ₹
          {completedOrder.total}
        </p>


        <Link to="/shop/orders">

          View My Orders

        </Link>

      </div>
    );
  }


  if (cartItems.length === 0) {

    return (

      <div>

        <h1>Checkout</h1>

        <p>
          Your cart is empty.
        </p>

        <Link to="/shop/products">
          Continue Shopping
        </Link>

      </div>
    );
  }


  return (

    <div>

      <h1>Checkout</h1>


      <h2>Order Summary</h2>


      <table>

        <thead>

          <tr>

            <th>Product</th>

            <th>Price</th>

            <th>Quantity</th>

            <th>Subtotal</th>

          </tr>

        </thead>


        <tbody>

          {cartItems.map(
            (item) => (

              <tr key={item.id}>

                <td>
                  {item.name}
                </td>

                <td>
                  ₹{item.price}
                </td>

                <td>
                  {item.cartQuantity}
                </td>

                <td>

                  ₹{
                    item.price *
                    item.cartQuantity
                  }

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>


      <h2>
        Total: ₹{total}
      </h2>


      <h2>
        Customer Details
      </h2>


      <form
        onSubmit={handleCheckout}
      >

        <div>

          <label
            htmlFor="customerId"
          >
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
            required
          />

        </div>


        <div>

          <label
            htmlFor="paymentType"
          >
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
          <p>{error}</p>
        )}


        <button
          type="submit"
          disabled={loading}
        >

          {loading
            ? "Processing..."
            : "Place Order"}

        </button>

      </form>

    </div>
  );
}


export default Checkout;