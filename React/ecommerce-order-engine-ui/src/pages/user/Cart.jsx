import {
  useCart,
} from "../../context/CartContext";

import { Link } from "react-router-dom";


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
        item.price *
          item.cartQuantity,
      0
    );


  if (cartItems.length === 0) {

    return (

      <div>

        <h1>Shopping Cart</h1>

        <p>
          Your cart is empty.
        </p>

      </div>
    );
  }


  return (

    <div>

      <h1>Shopping Cart</h1>


      <table>

        <thead>

          <tr>

            <th>Product</th>

            <th>Price</th>

            <th>Quantity</th>

            <th>Subtotal</th>

            <th>Actions</th>

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
                    -
                  </button>


                  {" "}

                  {item.cartQuantity}

                  {" "}


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

                </td>


                <td>

                  ₹{
                    item.price *
                    item.cartQuantity
                  }

                </td>


                <td>

                  <button
                    onClick={() =>
                      removeFromCart(
                        item.id
                      )
                    }
                  >
                    Remove
                  </button>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>


      <h2>
        Total: ₹{total}
      </h2>


          <Link to="/shop/checkout">
            <button>
                Proceed to Checkout
            </button>
            </Link>

            {" "}

      <button
        onClick={clearCart}
      >
        Clear Cart
      </button>

    </div>
  );
}


export default Cart;