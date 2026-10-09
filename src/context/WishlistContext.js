import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import products from "../data/products";

const WishlistContext = createContext();

// Load wishlist and refresh every item from products.js
function loadWishlist() {
  try {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];

    return saved
      .map((item) => {
        const latest = products.find((p) => p.name === item.name);
        if (!latest) return null;

        return {
          ...item,
          image: latest.image,
          images: latest.images,
          price: latest.price,
          originalPrice: latest.originalPrice,
          fabric: latest.fabric,
          occasion: latest.occasion,
          description: latest.description,
          stock: latest.stock
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(loadWishlist);

  // Save wishlist whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.name === product.name);

      return exists
        ? current.filter((item) => item.name !== product.name)
        : [...current, product];
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}