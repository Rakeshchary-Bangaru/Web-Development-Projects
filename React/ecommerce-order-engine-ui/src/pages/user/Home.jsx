import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getProducts,
} from "../../services/productApi";

import {
  getStock,
} from "../../services/inventoryApi";


function Home() {

  const [featuredProducts, setFeaturedProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  async function loadFeaturedProducts() {

    try {

      setError("");

      const products =
        await getProducts();

      const firstProducts =
        products.slice(0, 3);


      const productsWithStock =
        await Promise.all(

          firstProducts.map(
            async (product) => {

              const stock =
                await getStock(
                  product.id
                );

              return {
                ...product,
                quantity: stock.quantity,
              };

            }
          )

        );


      setFeaturedProducts(
        productsWithStock
      );

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadFeaturedProducts();

  }, []);


  return (

    <div>

      {/* HERO SECTION */}

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

            <Link to="/shop/products">

              <button className="primary-button">
                Shop Now
              </button>

            </Link>


            <Link to="/shop/orders">

              <button className="secondary-button">
                My Orders
              </button>

            </Link>

          </div>

        </div>

      </section>


      {/* FEATURES */}

      <section className="section">

        <div className="section-header">

          <h2>
            Shop With Us
          </h2>

          <p>
            Everything you need for a
            simple shopping experience.
          </p>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              🛍️
            </div>

            <h3>
              Browse Products
            </h3>

            <p>
              Explore our product catalogue,
              prices and live stock availability.
            </p>

            <Link
              to="/shop/products"
              className="feature-link"
            >
              View Products →
            </Link>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🛒
            </div>

            <h3>
              Shopping Cart
            </h3>

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


          <div className="feature-card">

            <div className="feature-icon">
              📦
            </div>

            <h3>
              Track Orders
            </h3>

            <p>
              View your previous purchases,
              payment information and
              order status.
            </p>

            <Link
              to="/shop/orders"
              className="feature-link"
            >
              My Orders →
            </Link>

          </div>

        </div>

      </section>


      {/* FEATURED PRODUCTS */}

      <section className="section">

        <div className="section-header">

          <h2>
            Featured Products
          </h2>

          <p>
            A few products currently
            available in our store.
          </p>

        </div>


        {loading && (
          <p>
            Loading products...
          </p>
        )}


        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        {!loading &&
          !error &&
          featuredProducts.length === 0 && (

            <p>
              No products available.
            </p>

          )}


        <div className="product-grid">

          {featuredProducts.map(
            (product) => (

              <div
                className="product-card"
                key={product.id}
              >

                <p className="product-category">
                  {product.category}
                </p>


                <h3>
                  {product.name}
                </h3>


                <p className="product-price">
                  ₹{product.price}
                </p>


                <p
                  className={
                    product.quantity > 0
                      ? "in-stock"
                      : "out-of-stock"
                  }
                >

                  {product.quantity > 0
                    ? `${product.quantity} in stock`
                    : "Out of stock"}

                </p>


                <Link
                  to="/shop/products"
                >

                  <button className="primary-button product-button">
                    View Product
                  </button>

                </Link>

              </div>

            )
          )}

        </div>


        {!loading &&
          featuredProducts.length > 0 && (

            <div className="view-all-container">

              <Link to="/shop/products">

                <button className="secondary-button">
                  View All Products
                </button>

              </Link>

            </div>

          )}

      </section>

    </div>
  );
}


export default Home;