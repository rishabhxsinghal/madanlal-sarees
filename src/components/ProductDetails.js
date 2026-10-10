import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import shop from "../config";
import ProductCard from "./ProductCard";
import Navbar from "./Navbar";

const toNumber = (value) => Number(String(value).replace(/,/g, ""));

function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();

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

  const [quantity, setQuantity] = useState(stock > 0 ? 1 : 0);
  const [showImage, setShowImage] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSelectedImage(productImages[0]);
    setQuantity(stock > 0 ? 1 : 0);
    setAdded(false);
  }, [productImages, stock, name]);

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
      ...existing.filter((item) => item.name !== name)
    ].slice(0, 4);

    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
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

  const productData = {
    image,
    images: productImages,
    name,
    price,
    fabric,
    occasion,
    description,
    stock
  };

  const handleAddToCart = () => {
    if (!stock || stock === 0) return;

    addToCart(productData, quantity);
    setAdded(true);
  };

  const handleBuyNow = () => {
    if (!stock || stock === 0) return;

    addToCart(productData, quantity);
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

  const matched = products.find((p) => p.name === name);

  const discount = originalPrice
    ? Math.round(
        ((toNumber(originalPrice) - toNumber(price)) /
          toNumber(originalPrice)) *
          100
      )
    : 0;

  const askLink = `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(
    `Hello ${shop.name}, I am interested in "${name}" (₹${price}). Is it available?`
  )}`;

  return (
    <>
      <Navbar />

      <div className="product-details">

        <div className="product-gallery">

          {productImages.length > 1 && (
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
          )}

          <div
            className="product-details-image"
            onClick={() => setShowImage(true)}
          >
            <img src={selectedImage} alt={name} />

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
              : matched?.badge || "MADANLAL SAREES"}
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

            {discount > 0 && (
              <span className="details-discount">
                {discount}% OFF
              </span>
            )}
          </div>

          {stock > 0 && stock <= 2 && (
            <p className="details-low-stock">
              Only {stock} left in stock
            </p>
          )}

          {stock > 2 && (
            <p className="details-in-stock">In Stock</p>
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
              disabled={stock === 0 || quantity <= 1}
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              onClick={increaseQuantity}
              disabled={stock === 0 || quantity >= stock}
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
                : added
                ? "ADDED ✓"
                : "ADD TO CART"}
            </button>

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={stock === 0}
            >
              {stock === 0 ? "OUT OF STOCK" : "BUY NOW"}
            </button>

          </div>

          {added && (
            <div className="cart-added-note">
              <span>Added to your cart.</span>
              <button onClick={() => navigate("/cart")}>
                VIEW CART
              </button>
            </div>
          )}

          <a
            className="details-whatsapp-btn"
            href={askLink}
            target="_blank"
            rel="noreferrer"
          >
            ASK ABOUT THIS SAREE ON WHATSAPP
          </a>

          <ul className="product-trust">
            <li>Order directly on WhatsApp</li>
            <li>We confirm availability before dispatch</li>
            <li>Visit our showroom in {shop.city}</li>
          </ul>

        </div>
      </div>

      <section className="related-products">

        <div className="section-heading">
          <p>COMPLETE YOUR COLLECTION</p>
          <h2>You May Also Like</h2>
        </div>

        <div className="product-grid">

          {products
            .filter((product) => product.name !== name)
            .slice(0, 3)
            .map((product) => (
              <ProductCard
                key={product.id}
                image={product.image}
                images={product.images}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                fabric={product.fabric}
                occasion={product.occasion}
                description={product.description}
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
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </>
  );
}

export default ProductDetails;