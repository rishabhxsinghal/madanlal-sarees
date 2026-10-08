import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.name === product.name
      );

      if (existingItem) {
        if (
          product.stock !== undefined &&
          existingItem.quantity >= product.stock
        ) {
          alert(`Only ${product.stock} available in stock.`);
          return currentCart;
        }

        const updatedCart = currentCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        localStorage.setItem(
          "cart",
          JSON.stringify(updatedCart)
        );

        return updatedCart;
      }

      if (product.stock === 0) {
        alert("This product is out of stock.");
        return currentCart;
      }

      const updatedCart = [
        ...currentCart,
        {
          ...product,
          quantity: 1
        }
      ];

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const increaseQuantity = (name) => {
    setCart((currentCart) => {
      const updatedCart = currentCart.map((item) => {
        if (item.name !== name) {
          return item;
        }

        if (
          item.stock !== undefined &&
          item.quantity >= item.stock
        ) {
          alert(`Only ${item.stock} available in stock.`);
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1
        };
      });

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const decreaseQuantity = (name) => {
    setCart((currentCart) => {
      const updatedCart = currentCart
        .map((item) =>
          item.name === name
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter((item) => item.quantity > 0);

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const removeFromCart = (index) => {
    setCart((currentCart) => {
      const updatedCart = currentCart.filter(
        (_, i) => i !== index
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
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