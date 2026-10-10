import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import localProducts from "../data/products";

const ProductsContext = createContext({ products: [], loading: true });

const CACHE_KEY = "productsCache";

function readCache() {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY));
    return Array.isArray(saved) && saved.length > 0 ? saved : null;
  } catch {
    return null;
  }
}

// make every database record look exactly like a products.js record
function normalize(data) {
  const image = data.image || (data.images && data.images[0]) || "";

  return {
    ...data,
    id: Number(data.id) || 0,
    image,
    images: data.images && data.images.length > 0 ? data.images : [image],
    price: String(data.price ?? "0"),
    originalPrice: data.originalPrice ? String(data.originalPrice) : "",
    stock: Number(data.stock) || 0,
    badge: data.badge || ""
  };
}

export function ProductsProvider({ children }) {
  // null = nothing yet (first visit, still loading)
  const [products, setProducts] = useState(readCache);

  useEffect(() => {
    return onSnapshot(
      collection(db, "products"),
      (snap) => {
        const list = snap.docs.map((d) => normalize(d.data()));

        if (list.length === 0) {
          // database empty: keep the site working with the old list
          setProducts(localProducts);
          return;
        }

        setProducts(list);

        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(list));
        } catch {
          // storage full or blocked: ignore
        }
      },
      () => {
        // offline or error: use what we have
        setProducts((current) => current || localProducts);
      }
    );
  }, []);

  return (
    <ProductsContext.Provider
      value={{ products: products || [], loading: products === null }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}