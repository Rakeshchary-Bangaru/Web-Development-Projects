
import { useEffect, useState } from "react";
import "./ProductImage.css";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/$/, "");

export default function ProductImage({
  productId,
  productName = "Product",
  className = "",
}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!productId) {
      setImageUrl(null);
      return;
    }

    const controller = new AbortController();

    setImageUrl(null);
    setFailed(false);

    async function fetchPrimaryImage() {
      try {
        const response = await fetch(
          `${API_BASE}/api/products/${productId}/images`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Could not load product images");
        }

        const images = await response.json();

        const primaryImage =
          images.find((image) => image.primary) ||
          images[0];

        if (primaryImage && !controller.signal.aborted) {
          setImageUrl(
            `${API_BASE}${primaryImage.url}`
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Product image error:", error);
          setFailed(true);
        }
      }
    }

    fetchPrimaryImage();

    return () => controller.abort();
  }, [productId]);

  return (
    <div className={`product-image-container ${className}`}>
      {imageUrl && !failed ? (
        <img
          src={imageUrl}
          alt={productName}
          className="product-image"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="product-image-placeholder">
          <span>📦</span>
          <p>No Image Available</p>
        </div>
      )}
    </div>
  );
}
