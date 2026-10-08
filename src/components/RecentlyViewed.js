import React from "react";
import { useNavigate } from "react-router-dom";

function RecentlyViewed() {
  const navigate = useNavigate();

  const recentlyViewed = JSON.parse(
    localStorage.getItem("recentlyViewed") || "[]"
  );

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="recently-viewed">

      <div className="section-heading">
        <p>YOUR HISTORY</p>
        <h2>Recently Viewed</h2>
      </div>

      <div className="recently-viewed-grid">

        {recentlyViewed.map((product, index) => (
          <div
            className="recently-viewed-card"
            key={index}
            onClick={() =>
              navigate("/product", {
                state: product
              })
            }
          >
            <div className="recently-viewed-image">
              <img
                src={product.image}
                alt={product.name}
              />
            </div>

            <h3>{product.name}</h3>

            <p>₹{product.price}</p>
          </div>
        ))}

      </div>

    </section>
  );
}

export default RecentlyViewed;