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

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

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





  if (loading) {

    return (
      <p>Loading products...</p>
    );
  }


  return (

    <div>

      <h1>Products</h1>


      {error && (
        <p>{error}</p>
      )}


      {products.length === 0 ? (

        <p>
          No products available.
        </p>

      ) : (

        <div>

          {products.map(
            (product) => (

              <div
                key={product.id}
              >

                <h2>
                  {product.name}
                </h2>


                <p>
                  Category:{" "}
                  {product.category}
                </p>


                <p>
                  Price: ₹
                  {product.price}
                </p>


                <p>

                  {product.quantity > 0
                    ? `In Stock: ${product.quantity}`
                    : "Out of Stock"}

                </p>


                <button
                  disabled={
                    product.quantity === 0
                  }
                  onClick={() =>
                    addToCart(
                      product
                    )
                  }
                >
                  Add to Cart
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