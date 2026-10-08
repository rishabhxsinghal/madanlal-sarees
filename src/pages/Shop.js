import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "../components/Navbar";
import NewArrivals from "../components/NewArrivals";

function Shop() {
  const [sortBy, setSortBy] = useState("newest");
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category");

  const categories = [
    { value: "all", label: "ALL SAREES" },
    { value: "silk", label: "SILK" },
    { value: "banarasi", label: "BANARASI" },
    { value: "cotton", label: "COTTON" },
    { value: "festive", label: "FESTIVE" }
  ];

  const handleCategory = (value) => {
    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  const getHeading = () => {
    if (!category) return "Shop Sarees";

    const selected = categories.find(
      (item) => item.value === category
    );

    return selected
      ? `${selected.label.charAt(0)}${selected.label.slice(1).toLowerCase()} Sarees`
      : "Shop Sarees";
  };

  return (
    <>
      <Navbar />

      <main className="shop-page">

        {/* SHOP HERO */}

        <section className="shop-hero">

          <div className="shop-hero-content">

            <p className="shop-eyebrow">
              THE MADANLAL COLLECTION
            </p>

            <h1>{getHeading()}</h1>

            <p className="shop-intro">
              Discover timeless Indian elegance through our
              carefully selected collection of sarees.
            </p>

          </div>

        </section>

        {/* FILTER BAR */}

        <section className="shop-toolbar">

          <div className="shop-categories">

            {categories.map((item) => (
              <button
                key={item.value}
                className={
                  (!category && item.value === "all") ||
                  category === item.value
                    ? "shop-category active"
                    : "shop-category"
                }
                onClick={() =>
                  handleCategory(item.value)
                }
              >
                {item.label}
              </button>
            ))}

          </div>

          <div className="shop-sort">

            <SlidersHorizontal
              size={16}
              strokeWidth={1.5}
            />

            <label htmlFor="sort">
              SORT BY
            </label>

            <select
              id="sort"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >
              <option value="newest">
                Newest
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>
            </select>

          </div>

        </section>

        {/* PRODUCTS */}

        <NewArrivals
          selectedCategory={category}
          sortBy={sortBy}
        />

      </main>
    </>
  );
}

export default Shop;