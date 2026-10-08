import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import saree1 from "../assets/images/products/saree1.jpg";
import saree2 from "../assets/images/products/saree2.jpg";
import saree3 from "../assets/images/products/saree3.jpg";
import saree4 from "../assets/images/products/saree4.jpg";

function Collections() {
  const navigate = useNavigate();

  const collections = [
    {
      id: 1,
      title: "Silk Sarees",
      subtitle: "TIMELESS LUXURY",
      description:
        "Rich textures and graceful drapes crafted for elegant celebrations.",
      image: saree1,
      category: "silk"
    },

    {
      id: 2,
      title: "Banarasi Sarees",
      subtitle: "HERITAGE CRAFT",
      description:
        "Traditional craftsmanship woven into timeless Banarasi elegance.",
      image: saree2,
      category: "banarasi"
    },

    {
      id: 3,
      title: "Cotton Sarees",
      subtitle: "EFFORTLESS ELEGANCE",
      description:
        "Lightweight comfort designed for graceful everyday dressing.",
      image: saree3,
      category: "cotton"
    },

    {
      id: 4,
      title: "Festive Sarees",
      subtitle: "CELEBRATE IN STYLE",
      description:
        "Statement sarees designed for weddings, festivals and special moments.",
      image: saree4,
      category: "festive"
    }
  ];

  const handleCollectionClick = (category) => {
    navigate(`/shop?category=${category}`);
  };

  return (
    <>
      <Navbar />

      <main className="collections-page">

        {/* HEADER */}

        <section className="collections-hero">

          <div className="collections-hero-content">

            <p>THE MADANLAL EDIT</p>

            <h1>
              Our Collections
            </h1>

            <span>
              Discover sarees chosen for every
              occasion, mood and moment.
            </span>

          </div>

        </section>

        {/* COLLECTIONS */}

        <section className="collections-section">

          <div className="collections-heading">

            <p>EXPLORE OUR WORLD</p>

            <h2>
              Crafted For Every Occasion
            </h2>

          </div>

          <div className="collections-grid">

            {collections.map((collection) => (
              <article
                className="collection-card"
                key={collection.id}
                onClick={() =>
                  handleCollectionClick(
                    collection.category
                  )
                }
              >

                <div className="collection-image">

                  <img
                    src={collection.image}
                    alt={collection.title}
                  />

                  <div className="collection-overlay">
                    <span>
                      EXPLORE COLLECTION
                    </span>
                  </div>

                </div>

                <div className="collection-info">

                  <p>{collection.subtitle}</p>

                  <h3>
                    {collection.title}
                  </h3>

                  <span>
                    {collection.description}
                  </span>

                  <button>
                    SHOP NOW →
                  </button>

                </div>

              </article>
            ))}

          </div>

        </section>

        {/* BOTTOM EDITORIAL */}

        <section className="collection-story">

          <div className="collection-story-content">

            <p>
              MADANLAL SAREES
            </p>

            <h2>
              Tradition,
              <br />
              Reimagined.
            </h2>

            <span>
              From timeless Banarasi weaves to
              elegant silks and comfortable cottons,
              every saree is chosen to bring together
              heritage and contemporary elegance.
            </span>

            <button
              onClick={() => navigate("/shop")}
            >
              VIEW ALL SAREES
            </button>

          </div>

        </section>

      </main>
    </>
  );
}

export default Collections;