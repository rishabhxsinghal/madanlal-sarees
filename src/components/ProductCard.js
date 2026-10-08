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
  stock
}) {
  const navigate = useNavigate();

  const { cart, addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const cartItem = cart.find(
    (item) => item.name === name
  );

  const isLiked = wishlist.some(
    (item) => item.name === name
  );

  const discount = originalPrice
    ? Math.round(
        ((Number(originalPrice.replace(/,/g, "")) -
          Number(price.replace(/,/g, ""))) /
          Number(originalPrice.replace(/,/g, ""))) *
          100
      )
    : 0;

  const handleAddToCart = () => {
  if (stock === 0) return;

  addToCart({
    image,
    name,
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
      description
    });
  };

  return (
    <div className="product-card">

      <div
        className="product-image"
        onClick={() =>
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
              stock
            }
          })
        }
      >

        <img src={image} alt={name} />

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
    : cartItem
    ? `In Cart (${cartItem.quantity})`
    : "Add to Cart"}
</button>

          {cartItem && (
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