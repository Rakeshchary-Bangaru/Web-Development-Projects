import { Link } from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";


function Cart() {

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();


  const total =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price * item.cartQuantity,
      0
    );


  if (cartItems.length === 0) {

    return (

      <div className="empty-cart">

        <div className="empty-cart-icon">
          🛒
        </div>

        <h1>Your Cart is Empty</h1>

        <p>
          Add some products to your cart
          before proceeding to checkout.
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

      <div className="cart-page-header">

        <div>

          <h1>
            Shopping Cart
          </h1>

          <p>
            Review your products and update
            quantities before checkout.
          </p>

        </div>

      </div>


      <div className="cart-layout">

        <div className="cart-items">

          {cartItems.map((item) => (

            <div
              className="cart-item"
              key={item.id}
            >

              <div className="cart-product-icon">
                🛍️
              </div>


              <div className="cart-product-info">

                <p className="product-category">
                  {item.category}
                </p>

                <h3>
                  {item.name}
                </h3>

                <p className="cart-product-id">
                  Product ID: {item.id}
                </p>

                <p className="cart-product-price">
                  ₹{item.price}
                </p>

              </div>


              <div className="cart-quantity">

                <p>
                  Quantity
                </p>

                <div className="quantity-controls">

                  <button
                    onClick={() =>
                      decreaseQuantity(
                        item.id
                      )
                    }
                    disabled={
                      item.cartQuantity <= 1
                    }
                  >
                    −
                  </button>


                  <span>
                    {item.cartQuantity}
                  </span>


                  <button
                    onClick={() =>
                      increaseQuantity(
                        item.id
                      )
                    }
                    disabled={
                      item.cartQuantity >=
                      item.quantity
                    }
                  >
                    +
                  </button>

                </div>

              </div>


              <div className="cart-subtotal">

                <p>
                  Subtotal
                </p>

                <strong>
                  ₹{
                    item.price *
                    item.cartQuantity
                  }
                </strong>

              </div>


              <button
                className="remove-button"
                onClick={() =>
                  removeFromCart(
                    item.id
                  )
                }
              >
                Remove
              </button>

            </div>

          ))}

        </div>


        <aside className="cart-summary">

          <h2>
            Order Summary
          </h2>


          <div className="summary-row">

            <span>
              Items
            </span>

            <span>
              {
                cartItems.reduce(
                  (total, item) =>
                    total +
                    item.cartQuantity,
                  0
                )
              }
            </span>

          </div>


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


          <hr />


          <div className="summary-total">

            <span>
              Total
            </span>

            <span>
              ₹{total}
            </span>

          </div>


          <Link
            to="/shop/checkout"
            className="checkout-link"
          >

            <button className="primary-button checkout-button">
              Proceed to Checkout
            </button>

          </Link>


          <button
            className="clear-cart-button"
            onClick={clearCart}
          >
            Clear Cart
          </button>


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