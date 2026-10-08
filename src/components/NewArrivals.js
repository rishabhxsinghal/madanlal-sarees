import ProductCard from "./ProductCard";
import products from "../data/products";

function NewArrivals({ selectedCategory, sortBy }) {

  let filteredProducts = selectedCategory
  ? products.filter(
      (product) => product.category === selectedCategory
    )
  : products;

if (sortBy === "price-low") {
  filteredProducts = [...filteredProducts].sort(
    (a, b) =>
      Number(a.price.replace(/,/g, "")) -
      Number(b.price.replace(/,/g, ""))
  );
}

if (sortBy === "price-high") {
  filteredProducts = [...filteredProducts].sort(
    (a, b) =>
      Number(b.price.replace(/,/g, "")) -
      Number(a.price.replace(/,/g, ""))
  );
}

  return (
    <section className="new-arrivals">

      <div className="section-heading">
  <p>OUR LATEST COLLECTION</p>
  <h2>New Arrivals</h2>

  <span className="product-count">
  {filteredProducts.length}{" "}
  {filteredProducts.length === 1
    ? "SAREE"
    : "SAREES"}
</span>
</div>

      {filteredProducts.length > 0 ? (
  <div className="product-grid">
    {filteredProducts.map((product) => (
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
      Try selecting another category or explore our full collection.
    </p>
  </div>
)}
      <div className="view-all-products">
  <button onClick={() => window.location.href = "/shop"}>
    VIEW ALL SAREES
  </button>
</div>

    </section>
  );
}

export default NewArrivals;