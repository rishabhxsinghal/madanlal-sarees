import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { useProducts } from "./ProductsContext";

const CartContext = createContext();

function readCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { products, loading } = useProducts();
  const [cart, setCart] = useState(readCart);

  // Once products are loaded, refresh every cart item (image, price, stock)
  useEffect(() => {
    if (loading) return;

    setCart((current) => {
      const refreshed = current
        .map((item) => {
          const latest = products.find((p) => p.name === item.name);
          if (!latest) return null;

          return {
            ...item,
            image: latest.image,
            price: latest.price,
            fabric: latest.fabric,
            occasion: latest.occasion,
            stock: latest.stock,
            quantity: Math.min(item.quantity, latest.stock)
          };
        })
        .filter((item) => item && item.quantity > 0);

      return JSON.stringify(refreshed) === JSON.stringify(current)
        ? current
        : refreshed;
    });
  }, [products, loading]);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // qty = how many to add (default 1)
  const addToCart = (product, qty = 1) => {
    if (product.stock === 0) {
      alert("This product is out of stock.");
      return;
    }

    const existing = cart.find((item) => item.name === product.name);
    const currentQty = existing ? existing.quantity : 0;
    const maxQty =
      product.stock !== undefined ? product.stock : Infinity;

    if (currentQty >= maxQty) {
      alert(`Only ${product.stock} available in stock.`);
      return;
    }

    const addQty = Math.min(qty, maxQty - currentQty);

    setCart((current) => {
      const found = current.find((item) => item.name === product.name);

      return found
        ? current.map((item) =>
            item.name === product.name
              ? { ...item, quantity: item.quantity + addQty }
              : item
          )
        : [...current, { ...product, quantity: addQty }];
    });
  };

  const increaseQuantity = (name) => {
    const target = cart.find((item) => item.name === name);
    if (!target) return;

    if (target.stock !== undefined && target.quantity >= target.stock) {
      alert(`Only ${target.stock} available in stock.`);
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.name === name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (name) => {
    setCart((current) =>
      current
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (index) => {
    setCart((current) => current.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}