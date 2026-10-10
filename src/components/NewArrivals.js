import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { useProducts } from "../context/ProductsContext";

const toNumber = (value) => Number(String(value).replace(/,/g, ""));

const HOME_LIMIT = 8;

export const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "under", label: "Under ₹3,000", test: (p) => p < 3000 },
  {
    value: "mid",
    label: "₹3,000 – ₹6,000",
    test: (p) => p >= 3000 && p <= 6000
  },
  { value: "above", label: "Above ₹6,000", test: (p) => p > 6000 }
];

function NewArrivals({
  selectedCategory,
  sortBy = "newest",
  priceFilter = "all",
  shopMode = false,
  onClearFilter
}) {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  // 1. Category
  let list = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // 2. Price (Shop page only)
  if (shopMode) {
    const range = priceRanges.find((r) => r.value === priceFilter);

    if (range && range.test) {
      list = list.filter((p) => range.test(toNumber(p.price)));
    }
  }

  // 3. Sort
  list = [...list].sort((a, b) => {
    if (sortBy === "price-low") return toNumber(a.price) - toNumber(b.price);
    if (sortBy === "price-high") return toNumber(b.price) - toNumber(a.price);
    return b.id - a.id; // newest first
  });

  // 4. Home shows only the latest few
  const visible = shopMode ? list : list.slice(0, HOME_LIMIT);

  const countText = loading
    ? "LOADING..."
    : `${visible.length} ${visible.length === 1 ? "SAREE" : "SAREES"}`;

  return (
    <section className="new-arrivals">

      {shopMode ? (
        <p className="shop-result-count">{countText}</p>
      ) : (
        <div className="section-heading">
          <p>OUR LATEST COLLECTION</p>
          <h2>New Arrivals</h2>
          <span className="product-count">{countText}</span>
        </div>
      )}

      {loading ? null : visible.length > 0 ? (
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              images={product.images}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              fabric={product.fabric}
              occasion={product.occasion}
              description={product.description}
              badge={product.badge}
              stock={product.stock}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h3>No Sarees Found</h3>
          <p>
            Try another price range or category to see more sarees.
          </p>

          {shopMode && priceFilter !== "all" && onClearFilter && (
            <button className="clear-filters-btn" onClick={onClearFilter}>
              CLEAR FILTER
            </button>
          )}
        </div>
      )}

      {!shopMode && !loading && (
        <div className="view-all-products">
          <button onClick={() => navigate("/shop")}>
            VIEW ALL SAREES
          </button>
        </div>
      )}

    </section>
  );
}

export default NewArrivals;