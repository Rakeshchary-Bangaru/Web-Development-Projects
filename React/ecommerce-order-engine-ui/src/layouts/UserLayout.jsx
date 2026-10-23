import { Link, Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div>
      <h2>E-Commerce Store</h2>

      <nav>
        <Link to="/shop">Home</Link>{" | "}
        <Link to="/shop/products">Products</Link>{" | "}
        <Link to="/shop/cart">Cart</Link>{" | "}
        <Link to="/shop/checkout">Checkout</Link>{" | "}
        <Link to="/shop/orders">My Orders</Link>
      </nav>

      <hr />

      <Outlet />
    </div>
  );
}

export default UserLayout;