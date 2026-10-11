import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function ProductCard({
  image,
  images,
  name,
  price,
  fabric,
  originalPrice,
  occasion,
  description,
  badge,
  stock,
  variants
}) {
  const navigate = useNavigate();

  const { cart, addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const colours = Array.isArray(variants) ? variants : [];
  const hasColours = colours.length > 1;

  // total of this saree in the cart, across all colours
  const inCartQty = cart
    .filter((item) => (item.productName || item.name) === name)
    .reduce((sum, item) => sum + item.quantity, 0);

  const cartItem = hasColours
    ? null
    : cart.find((item) => item.name === name);

  const isLiked = wishlist.some((item) => item.name === name);

  const discount = originalPrice
    ? Math.round(
        ((Number(originalPrice.replace(/,/g, "")) -
          Number(price.replace(/,/g, ""))) /
          Number(originalPrice.replace(/,/g, ""))) *
          100
      )
    : 0;

  const openProduct = () =>
    navigate("/product", {
      state: {
        image,
        images,
        name,
        price,
        originalPrice,
        fabric,
        occasion,
        description,
        stock,
        variants
      }
    });

  const handleAddToCart = () => {
    if (stock === 0) return;

    // many colours: the customer must pick one on the product page
    if (hasColours) {
      openProduct();
      return;
    }

    addToCart({
      image,
      images,
      name,
      productName: name,
      colour: "",
      price,
      fabric,
      occasion,
      description,
      stock
    });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    toggleWishlist({
      image,
      images,
      name,
      price,
      fabric,
      occasion,
      description,
      stock
    });
  };

  return (
    <div className="product-card">

      <div className="product-image" onClick={openProduct}>

        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
        />

        {badge && (
          <span className="product-badge">
            {badge}
          </span>
        )}

        <button
          className="wishlist-btn"
          onClick={handleWishlist}
        >
          {isLiked ? "♥" : "♡"}
        </button>

      </div>

      <div className="product-info">

        <h5>{name}</h5>

        <div className="product-price">

          <span className="current-price">
            ₹{price}
          </span>

          {originalPrice && (
            <span className="original-price">
              ₹{originalPrice}
            </span>
          )}

          {discount > 0 && (
            <span className="discount-percent">
              {discount}% OFF
            </span>
          )}

        </div>

        {hasColours && (
          <div
            className="color-dots"
            aria-label={`${colours.length} colours available`}
          >
            {colours.slice(0, 5).map((v, i) => (
              <span
                key={v.colour + i}
                style={{ background: v.hex }}
                title={v.colour}
              />
            ))}

            {colours.length > 5 && <em>+{colours.length - 5}</em>}
          </div>
        )}

        <div className="product-meta-small">
          <span>{fabric}</span>
          <span>{occasion}</span>

          {stock > 0 && stock <= 2 && (
            <span className="low-stock">
              Only {stock} left
            </span>
          )}

          {stock === 0 && (
            <span className="out-of-stock">
              Out of Stock
            </span>
          )}
        </div>

        <div className="product-cart-actions">

          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
            disabled={stock === 0}
          >
            {stock === 0
              ? "OUT OF STOCK"
              : hasColours
              ? "SELECT COLOUR"
              : cartItem
              ? `In Cart (${cartItem.quantity})`
              : "Add to Cart"}
          </button>

          {inCartQty > 0 && (
            <button
              className="view-cart-btn"
              onClick={() => navigate("/cart")}
            >
              VIEW CART
            </button>
          )}

        </div>

      </div>

    </div>
  );
}

export default ProductCard;