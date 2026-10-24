import { NavLink } from "react-router-dom";

import {
  useCart,
} from "../context/CartContext";


function Navbar() {

  const {
    cartItems,
  } = useCart();


  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total + item.cartQuantity,
      0
    );


  return (

    <header className="shop-navbar">

      <NavLink
        to="/shop"
        className="shop-logo"
      >
        E-Commerce Store
      </NavLink>


      <nav className="shop-nav-links">

  <NavLink
    to="/shop"
    end
  >
    Home
  </NavLink>

  <NavLink
    to="/shop/products"
  >
    Products
  </NavLink>

  <NavLink
    to="/shop/cart"
    className="cart-link"
  >
    Cart

    {cartCount > 0 && (
      <span className="cart-badge">
        {cartCount}
      </span>
    )}

  </NavLink>

  <NavLink
    to="/shop/orders"
  >
    My Orders
  </NavLink>

</nav>

    </header>
  );
}


export default Navbar;