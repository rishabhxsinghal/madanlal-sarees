import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import shop from "../config";

const offerings = [
  {
    title: "Silk Sarees",
    text: "Rich silk sarees for festivals, weddings and special occasions."
  },
  {
    title: "Banarasi Sarees",
    text: "Traditional Banarasi weaves inspired by Indian craftsmanship."
  },
  {
    title: "Cotton Sarees",
    text: "Lightweight, comfortable sarees for everyday elegance."
  },
  {
    title: "Festive & Party Wear",
    text: "Designer sarees for celebrations and memorable evenings."
  }
];

const steps = [
  {
    number: "01",
    title: "Choose Your Saree",
    text: "Browse our collection and add your favourite sarees to the cart."
  },
  {
    number: "02",
    title: "Order On WhatsApp",
    text: "Fill in your delivery details and your order reaches us on WhatsApp."
  },
  {
    number: "03",
    title: "We Confirm With You",
    text: "We confirm availability, delivery and payment details with you."
  }
];

function About() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="about-pro">

        {/* HERO */}
        <section className="about-pro-hero">
          <div className="about-pro-hero-content">
            <p>OUR STORY</p>
            <h1>
              Tradition Woven
              <br />
              Into Every Saree
            </h1>
          </div>
        </section>

        {/* STORY */}
        <section className="about-pro-story">
          <div className="about-pro-line"></div>

          <p className="about-pro-lead">
            At {shop.name}, we celebrate the timeless beauty of Indian
            sarees and the craftsmanship behind them. Our collection
            brings together traditional designs, elegant fabrics and
            contemporary styles for every special occasion.
          </p>

          <p className="about-pro-text">
            From festive celebrations to everyday elegance, every saree
            is carefully selected with a focus on quality, beauty and
            authenticity.
          </p>

          {shop.since && (
            <div className="about-pro-since">
              <strong>{shop.since}</strong>
              <span>SERVING OUR CUSTOMERS SINCE</span>
            </div>
          )}
        </section>

        {/* WHAT WE OFFER */}
        <section className="about-pro-section">
          <div className="about-pro-heading">
            <p>OUR COLLECTION</p>
            <h2>What We Offer</h2>
          </div>

          <div className="about-pro-offers">
            {offerings.map((item) => (
              <div className="about-offer" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW TO ORDER */}
        <section className="about-pro-section about-pro-soft">
          <div className="about-pro-heading">
            <p>SIMPLE &amp; EASY</p>
            <h2>How To Order</h2>
          </div>

          <div className="about-pro-steps">
            {steps.map((step) => (
              <div className="about-step" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VISIT */}
        <section className="about-pro-cta">
          <p>VISIT US</p>
          <h2>Experience It In Person</h2>
          <span>
            {shop.fullName}
            <br />
            {shop.addressLine1}, {shop.city}, {shop.state}
          </span>

          <div className="about-pro-buttons">
            <button onClick={() => navigate("/shop")}>
              SHOP COLLECTION
            </button>
            <button
              className="about-pro-outline"
              onClick={() => navigate("/contact")}
            >
              CONTACT US
            </button>
          </div>
        </section>

      </div>
    </>
  );
}

export default About;