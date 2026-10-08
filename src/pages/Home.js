import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import heroSaree from "../assets/images/hero-saree.jpg";
import CategorySection from "../components/CategorySection";
import NewArrivals from "../components/NewArrivals";
import TrustSection from "../components/TrustSection";
import RecentlyViewed from "../components/RecentlyViewed";

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />

      <section className="hero">

        <div className="hero-content">

          <p className="hero-small">
            THE ART OF INDIAN ELEGANCE
          </p>

          <h1>
            Timeless Sarees
            <br />
            For Every Occasion
          </h1>

          <p className="hero-description">
            Discover beautifully crafted sarees that celebrate
            tradition, elegance and timeless Indian craftsmanship.
          </p>

          <div className="hero-buttons">
  <button
    className="hero-button"
    onClick={() => navigate("/shop")}
  >
    SHOP COLLECTION
  </button>

  <button
    className="hero-button-outline"
    onClick={() => navigate("/collections")}
  >
    EXPLORE COLLECTIONS
  </button>
</div>

        </div>

        <div className="hero-image">
          <img src={heroSaree} alt="Premium Saree" />
        </div>

      </section>
      <CategorySection />
      <NewArrivals />
      <TrustSection/>
      <RecentlyViewed />
    
    </>
  );
}

export default Home;