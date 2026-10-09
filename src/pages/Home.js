import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import shop from "../config";

import heroSaree from "../assets/images/hero-saree.jpg";

import CategorySection from "../components/CategorySection";
import NewArrivals from "../components/NewArrivals";
import TrustSection from "../components/TrustSection";
import RecentlyViewed from "../components/RecentlyViewed";

function Home() {
  const navigate = useNavigate();

  const whatsappLink = `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(
    `Hello ${shop.name}, I would like to know more about your sarees.`
  )}`;

  return (
    <>
      {/* ANNOUNCEMENT BAR */}

      <div className="announcement-bar">
        <span>ORDER EASILY ON WHATSAPP</span>
        <span className="announcement-dot">◆</span>
        <span>VISIT OUR SHOWROOM IN {shop.city.toUpperCase()}</span>
      </div>

      <Navbar />

      <main>

        {/* HERO */}

        <section className="hero">

          <img
            src={heroSaree}
            alt={shop.name}
            className="hero-bg"
          />

          <div className="hero-overlay"></div>

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

          <div className="hero-bottom-text">
            DISCOVER THE COLLECTION
          </div>

        </section>

        {/* CATEGORIES */}

        <CategorySection />

        {/* NEW ARRIVALS */}

        <NewArrivals />

        {/* RECENTLY VIEWED */}

        <RecentlyViewed />

        {/* TRUST */}

        <TrustSection />

        {/* VISIT SHOWROOM */}

        <section className="home-visit">

          <div className="home-visit-content">

            <p>VISIT US</p>

            <h2>Visit Our Showroom</h2>

            <div className="home-visit-line"></div>

            <span className="home-visit-name">
              {shop.fullName}
            </span>

            <span className="home-visit-address">
              {shop.addressLine1}, {shop.city}, {shop.state}
            </span>

            <div className="home-visit-buttons">

              <button
                className="home-visit-primary"
                onClick={() => navigate("/contact")}
              >
                GET DIRECTIONS
              </button>

              <a
                className="home-visit-secondary"
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
              >
                CHAT ON WHATSAPP
              </a>

            </div>

          </div>

        </section>

      </main>
    </>
  );
}

export default Home;