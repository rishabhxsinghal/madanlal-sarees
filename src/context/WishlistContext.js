import React, { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const toggleWishlist = (product) => {
    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some(
        (item) => item.name === product.name
      );

      let updatedWishlist;

      if (exists) {
        updatedWishlist = currentWishlist.filter(
          (item) => item.name !== product.name
        );
      } else {
        updatedWishlist = [...currentWishlist, product];
      }

      localStorage.setItem(
        "wishlist",
        JSON.stringify(updatedWishlist)
      );

      return updatedWishlist;
    });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}