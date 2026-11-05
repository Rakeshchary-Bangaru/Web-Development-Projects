
import { useEffect, useState } from "react";
import "./ProductImageManager.css";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/$/, "");

const MAX_IMAGES = 8;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export default function ProductImageManager({
  productId,
  productName,
  token,
  onClose,
}) {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const endpoint =
    `${API_BASE}/api/products/${productId}/images`;

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");
    setImages([]);
    setFile(null);

    fetch(endpoint, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load product images");
        }

        return response.json();
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setImages(data);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [endpoint]);

  async function loadImages() {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Unable to refresh product images");
    }

    const data = await response.json();
    setImages(data);
  }

  async function authenticatedRequest(url, options) {
    if (!token) {
      throw new Error(
        "Authentication token is missing. Please sign in again."
      );
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage =
        `Operation failed (HTTP ${response.status})`;

      try {
        const data = await response.json();

        if (data.message) {
          errorMessage = data.message;
        }
      } catch {
        // Keep HTTP status message.
      }

      throw new Error(errorMessage);
    }

    return response;
  }


async function handleUpload(event) {
  event.preventDefault();

  // Capture the form before any asynchronous operations.
  const uploadForm = event.currentTarget;

  if (!file || busy) {
    return;
  }

  if (images.length >= MAX_IMAGES) {
    setError("Maximum 8 images per product");
    return;
  }

  if (!["image/jpeg", "image/png"].includes(file.type)) {
    setError("Select a JPEG or PNG image");
    return;
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    setError("Maximum upload size is 5 MB");
    return;
  }

  setBusy(true);
  setError("");
  setMessage("");

  try {
    const formData = new FormData();
    formData.append("file", file);

    await authenticatedRequest(endpoint, {
      method: "POST",
      body: formData,
    });

    await loadImages();

    setFile(null);
    uploadForm.reset();

    setMessage("Image uploaded successfully");
  } catch (err) {
    setError(err.message);
  } finally {
    setBusy(false);
  }
}


  async function handleSetPrimary(imageId) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      await authenticatedRequest(
        `${endpoint}/${imageId}/primary`,
        { method: "PUT" }
      );

      await loadImages();
      setMessage("Primary image updated");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(imageId) {
    if (!window.confirm("Delete this image?")) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      await authenticatedRequest(
        `${endpoint}/${imageId}`,
        { method: "DELETE" }
      );

      await loadImages();
      setMessage("Image deleted successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="product-image-manager">
      <div className="product-image-manager-header">
        <div>
          <h2>Manage Product Images</h2>
          <p>
            {productName} — Product ID: {productId}
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading images...</p>
      ) : (
        <>
          <p className="product-image-count">
            {images.length} / {MAX_IMAGES} images
          </p>

          <div className="product-image-manager-gallery">
            {images.map((image) => (
              <div
                className="product-image-manager-card"
                key={image.id}
              >
                <img
                  src={`${API_BASE}${image.url}`}
                  alt={`${productName} - ${image.originalFilename}`}
                  loading="lazy"
                />

                <div className="product-image-manager-details">
                  <p title={image.originalFilename}>
                    {image.originalFilename}
                  </p>

                  {image.primary && (
                    <span className="product-primary-badge">
                      Primary Image
                    </span>
                  )}

                  <div className="product-image-manager-actions">
                    {!image.primary && (
                      <button
                        type="button"
                        className="secondary-button"
                        disabled={busy}
                        onClick={() =>
                          handleSetPrimary(image.id)
                        }
                      >
                        Set Primary
                      </button>
                    )}

                    <button
                      type="button"
                      className="admin-delete-button"
                      disabled={busy}
                      onClick={() =>
                        handleDelete(image.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && (
            <p>No images uploaded for this product.</p>
          )}

          {images.length < MAX_IMAGES && (
            <form
              className="product-image-upload-form"
              onSubmit={handleUpload}
            >
              <label htmlFor="product-image-file">
                Upload Product Image
              </label>

              <input
                id="product-image-file"
                type="file"
                accept="image/jpeg,image/png"
                required
                disabled={busy}
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  setError("");
                }}
              />

              <button
                type="submit"
                className="primary-button"
                disabled={busy || !file}
              >
                {busy ? "Processing..." : "Upload Image"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
