import { useEffect, useState } from "react";

import {
  getProducts,
} from "../../services/productApi";

import {
  getStock,
} from "../../services/inventoryApi";

import {
  useCart,
} from "../../context/CartContext";


function Products() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  const {
    addToCart,
  } = useCart();


  async function loadProducts() {

    try {

      setError("");

      const productData =
        await getProducts();


      const productsWithStock =
        await Promise.all(

          productData.map(
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


      setProducts(
        productsWithStock
      );

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadProducts();

  }, []);


  function handleAddToCart(product) {

    addToCart(product);

    setMessage(
      `${product.name} added to cart`
    );


    setTimeout(() => {

      setMessage("");

    }, 2000);
  }


  if (loading) {

    return (
      <p>Loading products...</p>
    );
  }


  return (

    <div>

      <div className="products-header">

        <div>

          <h1 className="page-title">
            Products
          </h1>

          <p>
            Browse our available products
            and add them to your cart.
          </p>

        </div>

      </div>


      {message && (

        <div className="success-message">
          {message}
        </div>

      )}


      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {products.length === 0 ? (

        <p>
          No products available.
        </p>

      ) : (

        <div className="product-grid">

          {products.map(
            (product) => (

              <div
                className="product-card"
                key={product.id}
              >

                    <div className="product-card-top">

                    <span className="product-category">
                        {product.category}
                    </span>

                    </div>


                    <div
                    className={
                        product.quantity > 0
                        ? "product-stock-status in-stock-status"
                        : "product-stock-status out-stock-status"
                    }
                    >

                    <span className="stock-dot"></span>

                    {product.quantity > 0
                        ? "In Stock"
                        : "Out of Stock"}

                    </div>


                <div className="product-placeholder">
                  🛍️
                </div>


                <h2>
                  {product.name}
                </h2>


                <p className="product-id">
                  Product ID: {product.id}
                </p>


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
                    ? `${product.quantity} available`
                    : "Currently unavailable"}

                </p>


                <button
                  className="primary-button product-button"
                  disabled={
                    product.quantity === 0
                  }
                  onClick={() =>
                    handleAddToCart(
                      product
                    )
                  }
                >

                  {product.quantity > 0
                    ? "Add to Cart"
                    : "Out of Stock"}

                </button>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}


export default Products;