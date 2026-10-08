import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import products from "../data/products";
import Navbar from "./Navbar";

function Search() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = products.filter((product) => {
    const searchText = `
      ${product.name}
      ${product.category}
      ${product.fabric}
      ${product.occasion}
    `.toLowerCase();

    return searchText.includes(query.toLowerCase());
  });

  const handleProductClick = (product) => {
    navigate("/product", {
     state: {
  image: product.image,
  images: product.images,
  name: product.name,
  price: product.price,
  originalPrice: product.originalPrice,
  fabric: product.fabric,
  occasion: product.occasion,
  description: product.description,
  stock: product.stock
}
    });
  };

  return (
    <>
      <Navbar />

      <div className="search-page">

        <div className="search-content">

          <p className="search-small">
            FIND YOUR PERFECT SAREE
          </p>

          <h1>Search Collection</h1>

          <input
            type="text"
            placeholder="Search sarees..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
  <button
    className="clear-search-btn"
    onClick={() => setQuery("")}
  >
    CLEAR SEARCH
  </button>
)}

          {query && (
            <p className="search-result-count">
              {results.length}{" "}
              {results.length === 1 ? "Saree" : "Sarees"} found
            </p>
          )}

          {query && (
            <div className="search-results">

              {results.length > 0 ? (
                results.map((product) => (
                  <div
                    className="search-result"
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                    />

                    <div>
                      <h3>{product.name}</h3>
                      <p>₹{product.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="search-empty">
                  <h3>No Sarees Found</h3>
                  <p>
                    Try searching for another saree or fabric.
                  </p>
                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </>
  );
}

export default Search;