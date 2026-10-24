import { useEffect, useState } from "react";

import {
  getProducts,
  createProduct,
  updateProduct,
  updateProductPrice,
  deleteProduct,
} from "../../services/productApi";


function AdminProducts() {

  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    id: "",
    name: "",
    category: "",
    price: "",
  });

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  async function loadProducts() {

    try {

      setError("");

      const data =
        await getProducts();

      setProducts(data);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadProducts();

  }, []);


  function handleChange(event) {

    const {
      name,
      value,
    } = event.target;


    setForm(
      (previousForm) => ({
        ...previousForm,
        [name]: value,
      })
    );
  }


  async function handleSubmit(event) {

    event.preventDefault();

    setError("");
    setMessage("");


    const product = {

      id:
        Number(form.id),

      name:
        form.name,

      category:
        form.category,

      price:
        Number(form.price),
    };


    try {

      if (editingId !== null) {

        await updateProduct(
          editingId,
          product
        );

        setMessage(
          "Product updated successfully"
        );

      } else {

        await createProduct(
          product
        );

        setMessage(
          "Product created successfully"
        );
      }


      resetForm();

      await loadProducts();

    } catch (error) {

      setError(error.message);

    }
  }


  function handleEdit(product) {

    setEditingId(
      product.id
    );


    setForm({
      id:
        product.id,

      name:
        product.name,

      category:
        product.category,

      price:
        product.price,
    });


    setMessage("");
    setError("");
  }


  async function handlePriceUpdate(
    product
  ) {

    const newPrice =
      window.prompt(
        `Enter new price for ${product.name}`,
        product.price
      );


    if (newPrice === null) {
      return;
    }


    const price =
      Number(newPrice);


    if (
      price <= 0 ||
      Number.isNaN(price)
    ) {

      setError(
        "Please enter a valid price"
      );

      return;
    }


    try {

      setError("");
      setMessage("");


      await updateProductPrice(
        product.id,
        price
      );


      setMessage(
        "Product price updated successfully"
      );


      await loadProducts();

    } catch (error) {

      setError(error.message);

    }
  }


  async function handleDelete(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setMessage("");


      await deleteProduct(id);


      setMessage(
        "Product deleted successfully"
      );


      await loadProducts();

    } catch (error) {

      setError(error.message);

    }
  }


  function handleCancelEdit() {

    resetForm();

    setMessage("");
    setError("");
  }


  function resetForm() {

    setForm({
      id: "",
      name: "",
      category: "",
      price: "",
    });

    setEditingId(null);
  }


  if (loading) {

    return (
      <p>
        Loading products...
      </p>
    );
  }


  return (

    <div>

      <div className="admin-page-header">

        <h1>
          Products
        </h1>

        <p>
          Create, edit, update and manage
          products in the store.
        </p>

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


      <div className="admin-card admin-form-card">

        <div className="admin-section-header">

          <h2>

            {editingId !== null
              ? "Edit Product"
              : "Add Product"}

          </h2>

        </div>


        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-form-grid">

            <div>

              <label htmlFor="id">
                Product ID
              </label>

              <input
                id="id"
                name="id"
                type="number"
                value={form.id}
                onChange={handleChange}
                disabled={
                  editingId !== null
                }
                placeholder="Enter product ID"
                required
              />

            </div>


            <div>

              <label htmlFor="name">
                Product Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />

            </div>


            <div>

              <label htmlFor="category">
                Category
              </label>

              <input
                id="category"
                name="category"
                type="text"
                value={form.category}
                onChange={handleChange}
                placeholder="Enter category"
                required
              />

            </div>


            <div>

              <label htmlFor="price">
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />

            </div>

          </div>


          <div className="admin-form-actions">

            <button
              className="primary-button"
              type="submit"
            >

              {editingId !== null
                ? "Update Product"
                : "Add Product"}

            </button>


            {editingId !== null && (

              <button
                className="secondary-button"
                type="button"
                onClick={
                  handleCancelEdit
                }
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      <div className="admin-card admin-table-card">

        <div className="admin-section-header">

          <div>

            <h2>
              Product List
            </h2>

            <p>
              {products.length} products
              currently available.
            </p>

          </div>

        </div>


        <div className="table-container">

          <table className="admin-table">

            <thead>

              <tr>

                <th>ID</th>

                <th>Name</th>

                <th>Category</th>

                <th>Price</th>

                <th>Actions</th>

              </tr>

            </thead>


            <tbody>

              {products.map(
                (product) => (

                  <tr key={product.id}>

                    <td>
                      {product.id}
                    </td>

                    <td>
                      <strong>
                        {product.name}
                      </strong>
                    </td>

                    <td>

                      <span className="category-badge">
                        {product.category}
                      </span>

                    </td>

                    <td className="admin-price">
                      ₹{product.price}
                    </td>

                    <td>

                      <div className="admin-action-buttons">

                        <button
                          className="admin-edit-button"
                          onClick={() =>
                            handleEdit(
                              product
                            )
                          }
                        >
                          Edit
                        </button>


                        <button
                          className="admin-price-button"
                          onClick={() =>
                            handlePriceUpdate(
                              product
                            )
                          }
                        >
                          Price
                        </button>


                        <button
                          className="admin-delete-button"
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                        >
                          Delete
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


export default AdminProducts;