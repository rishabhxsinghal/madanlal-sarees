import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Navbar from "./Navbar";

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
  if (item.stock === 0) return;

  addToCart(item);
  alert("Saree added to cart!");
};

  const handleProductClick = (item) => {
  navigate("/product", {
    state: {
      image: item.image,
      images: item.images,
      name: item.name,
      price: item.price,
      fabric: item.fabric,
      occasion: item.occasion,
      description: item.description,
      originalPrice: item.originalPrice,
      stock: item.stock
    }
  });
};

  return (
    <>
    < Navbar />
    <div className="wishlist-page">

      <h1>My Wishlist</h1>

      {wishlist.length === 0 ? (
  <div className="wishlist-empty">

    <p className="wishlist-empty-small">
      YOUR COLLECTION
    </p>

    <h2>Your Wishlist is Empty</h2>

    <p>
      Save your favourite sarees here and come back to them anytime.
    </p>

    <button
      onClick={() => navigate("/shop")}
    >
      EXPLORE SAREES
    </button>

  </div>
) : (
        <div className="wishlist-grid">

          {wishlist.map((item, index) => (

            <div
              className="wishlist-item"
              key={index}
            >

              <img
                src={item.image}
                alt={item.name}
                onClick={() => handleProductClick(item)}
              />

              <div className="wishlist-info">

                <h3
                  onClick={() => handleProductClick(item)}
                >
                  {item.name}
                </h3>

                <p>₹{item.price}</p>

                <button
  className="wishlist-cart-btn"
  onClick={() => handleAddToCart(item)}
  disabled={item.stock === 0}
>
  {item.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
</button>

                <button
                  onClick={() => toggleWishlist(item)}
                  className="remove-wishlist-btn"
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
    </>
  );
}

export default Wishlist;