import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import products from "../data/products";
import ProductCard from "./ProductCard";
import Navbar from "./Navbar";

function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const {
    image,
    images,
    name,
    price,
    originalPrice,
    fabric,
    occasion,
    description,
    stock
  } = location.state || {};

  const productImages = useMemo(
    () => images || [image],
    [images, image]
  );

  const [selectedImage, setSelectedImage] = useState(
    productImages[0]
  );

  const [quantity, setQuantity] = useState(
    stock > 0 ? 1 : 0
  );

  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    setSelectedImage(productImages[0]);
    setQuantity(stock > 0 ? 1 : 0);
  }, [productImages, stock]);

  useEffect(() => {
    if (!name) return;

    const existing = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );

    const updated = [
      {
        image,
        images: productImages,
        name,
        price,
        originalPrice,
        fabric,
        occasion,
        description,
        stock
      },
      ...existing.filter(
        (item) => item.name !== name
      )
    ].slice(0, 4);

    localStorage.setItem(
      "recentlyViewed",
      JSON.stringify(updated)
    );
  }, [
    name,
    image,
    productImages,
    price,
    originalPrice,
    fabric,
    occasion,
    description,
    stock
  ]);

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (!stock || stock === 0) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        image,
        images: productImages,
        name,
        price,
        fabric,
        occasion,
        description,
        stock
      });
    }

    alert(`${quantity} saree added to cart!`);
  };

  const handleBuyNow = () => {
    if (!stock || stock === 0) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        image,
        images: productImages,
        name,
        price,
        fabric,
        occasion,
        description,
        stock
      });
    }

    navigate("/checkout");
  };

  if (!name) {
    return (
      <>
        <Navbar />

        <div className="product-not-found">
          <h2>Product Not Found</h2>

          <button onClick={() => navigate("/shop")}>
            BACK TO SHOP
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="product-details">

        <div className="product-gallery">

          <div className="product-thumbnails">
            {productImages.map((img, index) => (
              <button
                key={index}
                className={
                  selectedImage === img
                    ? "thumbnail active"
                    : "thumbnail"
                }
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img}
                  alt={`${name} ${index + 1}`}
                />
              </button>
            ))}
          </div>

          <div
            className="product-details-image"
            onClick={() => setShowImage(true)}
          >
            <img
              src={selectedImage}
              alt={name}
            />

            <span className="image-zoom-text">
              CLICK TO VIEW
            </span>
          </div>

        </div>

        <div className="product-details-info">

          <button
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <p className="product-details-small">
            {stock === 0
              ? "SOLD OUT"
              : "NEW ARRIVAL"}
          </p>

          <h1>{name}</h1>

          <div className="details-price">
            <span className="details-current-price">
              ₹{price}
            </span>

            {originalPrice && (
              <span className="details-original-price">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {stock > 0 && stock <= 2 && (
            <p className="details-low-stock">
              Only {stock} left in stock
            </p>
          )}

          {stock > 2 && (
            <p className="details-in-stock">
              In Stock
            </p>
          )}

          {stock === 0 && (
            <p className="details-out-of-stock">
              Out of Stock
            </p>
          )}

          <p className="product-description">
            {description}
          </p>

          <div className="product-meta">

            <div>
              <span>FABRIC</span>
              <strong>{fabric}</strong>
            </div>

            <div>
              <span>OCCASION</span>
              <strong>{occasion}</strong>
            </div>

          </div>

          <div className="quantity-selector">
            <button
              onClick={decreaseQuantity}
              disabled={
                stock === 0 || quantity <= 1
              }
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              onClick={increaseQuantity}
              disabled={
                stock === 0 ||
                quantity >= stock
              }
            >
              +
            </button>
          </div>

          <div className="product-action-buttons">

            <button
              className="details-cart-btn"
              onClick={handleAddToCart}
              disabled={stock === 0}
            >
              {stock === 0
                ? "OUT OF STOCK"
                : "ADD TO CART"}
            </button>

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={stock === 0}
            >
              {stock === 0
                ? "OUT OF STOCK"
                : "BUY NOW"}
            </button>

          </div>

        </div>
      </div>

      <section className="related-products">

        <div className="section-heading">
          <p>COMPLETE YOUR COLLECTION</p>
          <h2>You May Also Like</h2>
        </div>

        <div className="product-grid">

          {products
            .filter(
              (product) =>
                product.name !== name
            )
            .slice(0, 3)
            .map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                images={product.images}
                name={product.name}
                price={product.price}
                originalPrice={
                  product.originalPrice
                }
                fabric={product.fabric}
                occasion={product.occasion}
                description={
                  product.description
                }
                badge={product.badge}
                stock={product.stock}
              />
            ))}

        </div>

      </section>

      {showImage && (
        <div
          className="image-modal"
          onClick={() => setShowImage(false)}
        >
          <button
            className="image-modal-close"
            onClick={() => setShowImage(false)}
          >
            ×
          </button>

          <img
            src={selectedImage}
            alt={name}
            onClick={(e) =>
              e.stopPropagation()
            }
          />
        </div>
      )}

    </>
  );
}

export default ProductDetails;