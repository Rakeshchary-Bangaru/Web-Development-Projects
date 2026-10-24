import { useEffect, useState } from "react";

import {
  getStock,
  setStock,
  addStock,
} from "../../services/inventoryApi";

import {
  getProducts,
} from "../../services/productApi";


function AdminInventory() {

  const [inventory, setInventory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");


  async function loadInventory() {

    try {

      setError("");

      const products = await getProducts();


      const inventoryData =
        await Promise.all(

          products.map(async (product) => {

            const stock =
              await getStock(product.id);

            return {
              productId: product.id,
              name: product.name,
              category: product.category,
              quantity: stock.quantity,
            };

          })
        );


      setInventory(inventoryData);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadInventory();

  }, []);


  async function handleSetStock(item) {

    const value = window.prompt(
      `Set stock quantity for ${item.name}`,
      item.quantity
    );


    if (value === null) {
      return;
    }


    const quantity = Number(value);


    if (
      Number.isNaN(quantity) ||
      quantity < 0
    ) {

      setError(
        "Please enter a valid stock quantity"
      );

      return;
    }


    try {

      setError("");
      setMessage("");


      await setStock(
        item.productId,
        quantity
      );


      setMessage(
        "Stock updated successfully"
      );


      await loadInventory();

    } catch (error) {

      setError(error.message);

    }
  }


  async function handleAddStock(item) {

    const value = window.prompt(
      `Enter quantity to add for ${item.name}`
    );


    if (value === null) {
      return;
    }


    const quantity = Number(value);


    if (
      Number.isNaN(quantity) ||
      quantity <= 0
    ) {

      setError(
        "Please enter a valid quantity"
      );

      return;
    }


    try {

      setError("");
      setMessage("");


      await addStock(
        item.productId,
        quantity
      );


      setMessage(
        "Stock added successfully"
      );


      await loadInventory();

    } catch (error) {

      setError(error.message);

    }
  }


  if (loading) {

    return <p>Loading inventory...</p>;
  }


  return (

    <div>

      <h1>Inventory</h1>


      {message && (
        <p>{message}</p>
      )}


      {error && (
        <p>{error}</p>
      )}


      <h2>Inventory List</h2>


      <table>

        <thead>

          <tr>

            <th>Product ID</th>

            <th>Product</th>

            <th>Category</th>

            <th>Quantity</th>

            <th>Actions</th>

          </tr>

        </thead>


        <tbody>

          {inventory.map((item) => (

            <tr key={item.productId}>

              <td>
                {item.productId}
              </td>

              <td>
                {item.name}
              </td>

              <td>
                {item.category}
              </td>

              <td>
                {item.quantity}
              </td>

              <td>

                <button
                  onClick={() =>
                    handleSetStock(item)
                  }
                >
                  Set Stock
                </button>

                {" "}

                <button
                  onClick={() =>
                    handleAddStock(item)
                  }
                >
                  Add Stock
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}


export default AdminInventory;