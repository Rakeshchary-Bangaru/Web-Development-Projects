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

  const [inventory, setInventory] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  async function loadInventory() {

    try {

      setError("");

      const products =
        await getProducts();


      const inventoryData =
        await Promise.all(

          products.map(
            async (product) => {

              const stock =
                await getStock(
                  product.id
                );


              return {
                productId:
                  product.id,

                name:
                  product.name,

                category:
                  product.category,

                quantity:
                  stock.quantity,
              };

            }
          )

        );


      setInventory(
        inventoryData
      );

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

    const value =
      window.prompt(
        `Set stock quantity for ${item.name}`,
        item.quantity
      );


    if (value === null) {
      return;
    }


    const quantity =
      Number(value);


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

    const value =
      window.prompt(
        `Enter quantity to add for ${item.name}`
      );


    if (value === null) {
      return;
    }


    const quantity =
      Number(value);


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

    return (
      <p>
        Loading inventory...
      </p>
    );
  }


  return (

    <div>

      {/* PAGE HEADER */}

      <div className="admin-page-header">

        <h1>
          Inventory
        </h1>

        <p>
          Monitor stock levels and
          update product inventory.
        </p>

      </div>


      {/* SUCCESS */}

      {message && (

        <div className="success-message">
          {message}
        </div>

      )}


      {/* ERROR */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* INVENTORY SUMMARY */}

      <div className="inventory-summary">

        <div className="dashboard-card">

          <p>
            Products
          </p>

          <h2>
            {inventory.length}
          </h2>

        </div>


        <div className="dashboard-card">

          <p>
            Total Units
          </p>

          <h2>

            {inventory.reduce(
              (total, item) =>
                total +
                Number(item.quantity),

              0
            )}

          </h2>

        </div>


        <div className="dashboard-card">

          <p>
            Out of Stock
          </p>

          <h2 className="dashboard-warning">

            {
              inventory.filter(
                (item) =>
                  Number(item.quantity) === 0
              ).length
            }

          </h2>

        </div>

      </div>


      {/* INVENTORY TABLE */}

      <div className="admin-card admin-table-card">

        <div className="admin-section-header">

          <div>

            <h2>
              Inventory List
            </h2>

            <p>
              Current stock availability
              for all products.
            </p>

          </div>

        </div>


        <div className="table-container">

          <table className="admin-table">

            <thead>

              <tr>

                <th>
                  Product ID
                </th>

                <th>
                  Product
                </th>

                <th>
                  Category
                </th>

                <th>
                  Quantity
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {inventory.map(
                (item) => (

                  <tr
                    key={
                      item.productId
                    }
                  >

                    <td>
                      {item.productId}
                    </td>


                    <td>

                      <strong>
                        {item.name}
                      </strong>

                    </td>


                    <td>

                      <span className="category-badge">
                        {item.category}
                      </span>

                    </td>


                    <td>

                      <strong className="inventory-quantity">
                        {item.quantity}
                      </strong>

                    </td>


                    <td>

                      <span
                        className={
                          item.quantity > 0
                            ? "inventory-status in-stock-inventory"
                            : "inventory-status out-stock-inventory"
                        }
                      >

                        <span className="inventory-dot"></span>


                        {item.quantity > 0
                          ? "In Stock"
                          : "Out of Stock"}

                      </span>

                    </td>


                    <td>

                      <div className="admin-action-buttons">

                        <button
                          className="admin-edit-button"
                          onClick={() =>
                            handleSetStock(
                              item
                            )
                          }
                        >
                          Set Stock
                        </button>


                        <button
                          className="admin-stock-button"
                          onClick={() =>
                            handleAddStock(
                              item
                            )
                          }
                        >
                          Add Stock
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}


export default AdminInventory;