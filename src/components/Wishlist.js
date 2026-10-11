import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import Navbar from "./Navbar";

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();

  const [addedName, setAddedName] = useState("");

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

  const handleAddToCart = (item, latest) => {
    const stock = latest ? latest.stock : item.stock;

    if (stock === 0) return;

    // many colours: the customer must choose one on the product page
    if (latest && latest.variants.length > 1) {
      handleProductClick(item);
      return;
    }

    addToCart({ ...item, productName: item.name, colour: "", stock });

    setAddedName(item.name);
    setTimeout(() => setAddedName(""), 2000);
  };

  return (
    <>
      <Navbar />

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

            <button onClick={() => navigate("/shop")}>
              EXPLORE SAREES
            </button>

          </div>
        ) : (
          <div className="wishlist-grid">

            {wishlist.map((item) => {
              const latest = products.find((p) => p.name === item.name);
              const stock = latest ? latest.stock : item.stock;
              const colours = latest ? latest.variants : [];
              const hasColours = colours.length > 1;

              return (
                <div className="wishlist-item" key={item.name}>

                  <img
                    src={item.image}
                    alt={item.name}
                    onClick={() => handleProductClick(item)}
                  />

                  <div className="wishlist-info">

                    <h3 onClick={() => handleProductClick(item)}>
                      {item.name}
                    </h3>

                    <p>₹{item.price}</p>

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

                        {colours.length > 5 && (
                          <em>+{colours.length - 5}</em>
                        )}
                      </div>
                    )}

                    <button
                      className="wishlist-cart-btn"
                      onClick={() => handleAddToCart(item, latest)}
                      disabled={stock === 0}
                    >
                      {stock === 0
                        ? "OUT OF STOCK"
                        : hasColours
                        ? "SELECT COLOUR"
                        : addedName === item.name
                        ? "ADDED ✓"
                        : "ADD TO CART"}
                    </button>

                    <button
                      onClick={() => toggleWishlist(item)}
                      className="remove-wishlist-btn"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </>
  );
}

export default Wishlist;