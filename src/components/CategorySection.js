import { useNavigate } from "react-router-dom";

import banarasi from "../assets/images/categories/banarasi.jpg";
import silk from "../assets/images/categories/silk.jpg";
import cotton from "../assets/images/categories/cotton.jpg";
import festive from "../assets/images/categories/party.jpg";

function CategorySection() {
  const navigate = useNavigate();

  const categories = [
    {
      image: banarasi,
      name: "Banarasi Sarees",
      category: "banarasi"
    },
    {
      image: silk,
      name: "Silk Sarees",
      category: "silk"
    },
    {
      image: cotton,
      name: "Cotton Sarees",
      category: "cotton"
    },
    {
      image: festive,
      name: "Festive Sarees",
      category: "festive"
    }
  ];

  return (
    <section className="categories">

      <div className="section-heading">
        <p>EXPLORE OUR COLLECTIONS</p>
        <h2>Shop By Category</h2>
      </div>

      <div className="category-grid">

        {categories.map((category, index) => (
          <div
            className="category-card"
            key={index}
            onClick={() =>
              navigate(`/shop?category=${category.category}`)
            }
          >
            <div className="category-image">
              <img
                src={category.image}
                alt={category.name}
              />
            </div>

            <h3>{category.name}</h3>

            <p>EXPLORE COLLECTION</p>
          </div>
        ))}

      </div>

    </section>
  );
}

export default CategorySection;