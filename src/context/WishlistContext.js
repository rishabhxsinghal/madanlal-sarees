import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { useProducts } from "./ProductsContext";

const WishlistContext = createContext();

function readWishlist() {
  try {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const { products, loading } = useProducts();
  const [wishlist, setWishlist] = useState(readWishlist);

  // Once products are loaded, refresh every wishlist item
  useEffect(() => {
    if (loading) return;

    setWishlist((current) => {
      const refreshed = current
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

      return JSON.stringify(refreshed) === JSON.stringify(current)
        ? current
        : refreshed;
    });
  }, [products, loading]);

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