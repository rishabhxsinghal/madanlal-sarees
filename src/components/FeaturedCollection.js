import featuredSaree from "../assets/images/featured-saree.jpg";

function FeaturedCollection() {
  return (
    <section className="featured">

      <div className="featured-image">
        <img src={featuredSaree} alt="Featured Saree Collection" />
      </div>

      <div className="featured-content">

        <p>THE SIGNATURE COLLECTION</p>

        <h2>
          Crafted For
          <br />
          Timeless Moments
        </h2>

        <p className="featured-description">
          Discover our carefully selected collection of sarees,
          crafted with beautiful fabrics, intricate details and
          timeless Indian elegance.
        </p>

        <button>EXPLORE COLLECTION</button>

      </div>

    </section>
  );
}

export default FeaturedCollection;