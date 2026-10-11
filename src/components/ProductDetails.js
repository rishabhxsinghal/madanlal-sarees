import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import normalizeProduct from "../utils/normalizeProduct";
import shop from "../config";
import ProductCard from "./ProductCard";
import Navbar from "./Navbar";

const toNumber = (value) => Number(String(value).replace(/,/g, ""));

function ProductView({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useProducts();

  const variants = product.variants;
  const hasColours = variants.length > 1;

  const [colourIndex, setColourIndex] = useState(() => {
    const firstInStock = variants.findIndex((v) => v.stock > 0);
    return firstInStock >= 0 ? firstInStock : 0;
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showImage, setShowImage] = useState(false);
  const [added, setAdded] = useState(false);

  const variant = variants[colourIndex] || variants[0];
  const productImages = variant.images;
  const mainImage =
    selectedImage && productImages.includes(selectedImage)
      ? selectedImage
      : productImages[0];

  const stock = variant.stock;
  const qty = stock > 0 ? Math.min(Math.max(quantity, 1), stock) : 0;

  useEffect(() => {
    let existing = [];

    try {
      existing = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
    } catch {
      existing = [];
    }

    const updated = [
      {
        image: product.image,
        images: product.images,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        fabric: product.fabric,
        occasion: product.occasion,
        description: product.description,
        stock: product.stock
      },
      ...existing.filter((item) => item.name !== product.name)
    ].slice(0, 4);

    localStorage.setItem("recentlyViewed", JSON.stringify(updated));
  }, [product]);

  const chooseColour = (index) => {
    setColourIndex(index);
    setSelectedImage(null);
    setQuantity(1);
    setAdded(false);
  };

  const cartName =
    hasColours && variant.colour
      ? `${product.name} - ${variant.colour}`
      : product.name;

  const productData = {
    image: productImages[0],
    images: productImages,
    name: cartName,
    productName: product.name,
    colour: hasColours ? variant.colour : "",
    price: product.price,
    fabric: product.fabric,
    occasion: product.occasion,
    description: product.description,
    stock
  };

  const handleAddToCart = () => {
    if (stock === 0) return;

    addToCart(productData, qty);
    setAdded(true);
  };

  const handleBuyNow = () => {
    if (stock === 0) return;

    addToCart(productData, qty);
    navigate("/checkout");
  };

  const discount = product.originalPrice
    ? Math.round(
        ((toNumber(product.originalPrice) - toNumber(product.price)) /
          toNumber(product.originalPrice)) *
          100
      )
    : 0;

  const askLink = `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(
    `Hello ${shop.name}, I am interested in "${product.name}"${
      hasColours && variant.colour ? ` in ${variant.colour}` : ""
    } (₹${product.price}). Is it available?`
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
                  key={img + index}
                  className={
                    mainImage === img
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          )}

          <div
            className="product-details-image"
            onClick={() => setShowImage(true)}
          >
            <img src={mainImage} alt={product.name} />

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
            {product.stock === 0
              ? "SOLD OUT"
              : product.badge || "MADANLAL SAREES"}
          </p>

          <h1>{product.name}</h1>

          <div className="details-price">
            <span className="details-current-price">
              ₹{product.price}
            </span>

            {product.originalPrice && (
              <span className="details-original-price">
                ₹{product.originalPrice}
              </span>
            )}

            {discount > 0 && (
              <span className="details-discount">
                {discount}% OFF
              </span>
            )}
          </div>

          {hasColours && (
            <div className="colour-picker">
              <p className="colour-label">
                COLOUR: <strong>{variant.colour}</strong>
                {stock === 0 && " (Sold out)"}
              </p>

              <div className="colour-options">
                {variants.map((v, i) => (
                  <button
                    key={v.colour + i}
                    type="button"
                    className={
                      "colour-swatch" +
                      (i === colourIndex ? " active" : "") +
                      (v.stock === 0 ? " soldout" : "")
                    }
                    style={{ "--swatch": v.hex }}
                    onClick={() => chooseColour(i)}
                    title={v.colour}
                    aria-label={v.colour}
                  >
                    <span />
                  </button>
                ))}
              </div>
            </div>
          )}

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
            {product.description}
          </p>

          <div className="product-meta">

            <div>
              <span>FABRIC</span>
              <strong>{product.fabric}</strong>
            </div>

            <div>
              <span>OCCASION</span>
              <strong>{product.occasion}</strong>
            </div>

          </div>

          <div className="quantity-selector">
            <button
              onClick={() => setQuantity(qty - 1)}
              disabled={stock === 0 || qty <= 1}
            >
              −
            </button>

            <span>{qty}</span>

            <button
              onClick={() => setQuantity(qty + 1)}
              disabled={stock === 0 || qty >= stock}
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
            .filter((p) => p.name !== product.name)
            .slice(0, 3)
            .map((p) => (
              <ProductCard
                key={p.id}
                image={p.image}
                images={p.images}
                name={p.name}
                price={p.price}
                originalPrice={p.originalPrice}
                fabric={p.fabric}
                occasion={p.occasion}
                description={p.description}
                badge={p.badge}
                stock={p.stock}
                variants={p.variants}
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
            src={mainImage}
            alt={product.name}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

    </>
  );
}

function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products } = useProducts();

  const state = location.state;
  const name = state?.name;
  const found = products.find((p) => p.name === name);

  // latest data from the database, falling back to what the card sent
  const product = useMemo(
    () => (name ? normalizeProduct({ ...state, ...(found || {}) }) : null),
    [name, state, found]
  );

  if (!product) {
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

  return <ProductView key={product.name} product={product} />;
}

export default ProductDetails;