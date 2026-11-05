
import { useEffect, useState } from "react";

import {
  getProducts,
  getSellerProducts,
  createProduct,
  updateProduct,
  updateProductPrice,
  deleteProduct,
} from "../../services/productApi";

import { useAuth } from "../../context/AuthContext";

import ProductImageManager from "../../components/ProductImageManager";

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);
  const [selectedImageProduct, setSelectedImageProduct] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { currentUser, accessToken } = useAuth();

  const isSeller =
    currentUser?.role === "SELLER_ADMIN";

  const canManageImages =
    currentUser?.role === "ROOT" ||
    currentUser?.role === "SELLER_ADMIN";

  /*
   * Prefer a token supplied by AuthContext.
   *
   * Local/session storage fallbacks are included for
   * frontends that already store their JWT there.
   *
   * Match this to your actual AuthContext implementation.
   */
  const token =
    accessToken ||
    currentUser?.accessToken ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  async function loadProducts() {
    try {
      setError("");

      const data = isSeller
        ? await getSellerProducts()
        : await getProducts();

      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUser) {
      loadProducts();
    }
  }, [currentUser, isSeller]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    const price = Number(form.price);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid price");
      return;
    }

    /*
     * MySQL generates the product ID automatically.
     * Do not include an ID in the create request.
     */
    const product = {
      name: form.name.trim(),
      category: form.category.trim(),
      price,
    };

    if (!product.name || !product.category) {
      setError("Product name and category are required");
      return;
    }

    try {
      if (editingId !== null) {
        await updateProduct(editingId, product);
        setMessage("Product updated successfully");
      } else {
        await createProduct(product);
        setMessage("Product created successfully");
      }

      resetForm();
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
    });

    setMessage("");
    setError("");
  }

  async function handlePriceUpdate(product) {
    const newPrice = window.prompt(
      `Enter new price for ${product.name}`,
      product.price
    );

    if (newPrice === null) {
      return;
    }

    const price = Number(newPrice);

    if (!Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid price");
      return;
    }

    try {
      setError("");
      setMessage("");

      await updateProductPrice(product.id, price);

      setMessage("Product price updated successfully");
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteProduct(id);

      if (selectedImageProduct?.id === id) {
        setSelectedImageProduct(null);
      }

      setMessage("Product deleted successfully");
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleCancelEdit() {
    resetForm();
    setMessage("");
    setError("");
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function handleManageImages(product) {
    setSelectedImageProduct(product);
    setError("");
    setMessage("");
  }

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>
          {isSeller ? "My Products" : "Products"}
        </h1>

        <p>
          {isSeller
            ? "Create and manage products belonging to your seller account."
            : "Create, edit, update and manage products in the store."}
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
                min="0.01"
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
                onClick={handleCancelEdit}
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
              {isSeller
                ? "My Product List"
                : "Product List"}
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
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>

                  <td>
                    <strong>{product.name}</strong>
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
                        type="button"
                        className="admin-edit-button"
                        onClick={() =>
                          handleEdit(product)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-price-button"
                        onClick={() =>
                          handlePriceUpdate(product)
                        }
                      >
                        Price
                      </button>

                      {canManageImages && (
                        <button
                          type="button"
                          className="admin-edit-button"
                          onClick={() =>
                            handleManageImages(product)
                          }
                        >
                          Manage Images
                        </button>
                      )}

                      <button
                        type="button"
                        className="admin-delete-button"
                        onClick={() =>
                          handleDelete(product.id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {canManageImages && selectedImageProduct && (
        <ProductImageManager
          key={selectedImageProduct.id}
          productId={selectedImageProduct.id}
          productName={selectedImageProduct.name}
          token={token}
          onClose={() =>
            setSelectedImageProduct(null)
          }
        />
      )}
    </div>
  );
}

export default AdminProducts;
