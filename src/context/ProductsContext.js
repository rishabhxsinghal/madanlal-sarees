import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import localProducts from "../data/products";
import normalizeProduct from "../utils/normalizeProduct";

const ProductsContext = createContext({ products: [], loading: true });

const CACHE_KEY = "productsCache";
const localList = localProducts.map(normalizeProduct);

function readCache() {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY));
    return Array.isArray(saved) && saved.length > 0
      ? saved.map(normalizeProduct)
      : null;
  } catch {
    return null;
  }
}

export function ProductsProvider({ children }) {
  // null = nothing yet (first visit, still loading)
  const [products, setProducts] = useState(readCache);

  useEffect(() => {
    return onSnapshot(
      collection(db, "products"),
      (snap) => {
        const list = snap.docs.map((d) => normalizeProduct(d.data()));

        if (list.length === 0) {
          // database empty: keep the site working with the old list
          setProducts(localList);
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
        setProducts((current) => current || localList);
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