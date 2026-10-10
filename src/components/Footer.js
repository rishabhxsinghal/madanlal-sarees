import { useState } from "react";
import { Link } from "react-router-dom";
import shop from "../config";

function Footer() {
  // which mobile accordion is open: "links", "help" or null
  const [open, setOpen] = useState(null);

  const toggle = (key) => setOpen(open === key ? null : key);

  const whatsappLink = `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(
    `Hello ${shop.name}, I would like to know more about your sarees.`
  )}`;

  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h2>{shop.name.toUpperCase()}</h2>

          <div className="footer-gold-line"></div>

          <p>
            Timeless Indian elegance, beautifully woven
            for every occasion.
          </p>

          <a
            className="footer-whatsapp"
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
          >
            CHAT ON WHATSAPP
          </a>
        </div>

        <div
          className={
            open === "links"
              ? "footer-column footer-accordion open"
              : "footer-column footer-accordion"
          }
        >
          <button
            type="button"
            className="footer-accordion-head"
            onClick={() => toggle("links")}
            aria-expanded={open === "links"}
          >
            <span className="footer-heading">QUICK LINKS</span>
            <span className="footer-accordion-icon">
              {open === "links" ? "−" : "+"}
            </span>
          </button>

          <div
            className="footer-accordion-body"
            onClick={() => setOpen(null)}
          >
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/collections">Collections</Link>
          </div>
        </div>

        <div
          className={
            open === "help"
              ? "footer-column footer-accordion open"
              : "footer-column footer-accordion"
          }
        >
          <button
            type="button"
            className="footer-accordion-head"
            onClick={() => toggle("help")}
            aria-expanded={open === "help"}
          >
            <span className="footer-heading">HELP</span>
            <span className="footer-accordion-icon">
              {open === "help" ? "−" : "+"}
            </span>
          </button>

          <div
            className="footer-accordion-body"
            onClick={() => setOpen(null)}
          >
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">Cart</Link>
          </div>
        </div>

        <div className="footer-column footer-visit">
          <h3>VISIT US</h3>

          <p className="footer-showroom">{shop.fullName}</p>

          <p>
            {shop.addressLine1},
            <br />
            {shop.city}, {shop.state}
          </p>

          <a href={`tel:+${shop.whatsapp}`}>{shop.phoneDisplay}</a>

          {shop.timing && (
            <p className="footer-timing">
              {shop.timing}
              {shop.closedDay && ` (Closed on ${shop.closedDay})`}
            </p>
          )}
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {shop.name}. All Rights Reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;