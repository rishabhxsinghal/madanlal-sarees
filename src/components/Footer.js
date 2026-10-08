import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h2>MADANLAL SAREES</h2>

          <p>
            Timeless Indian elegance, beautifully woven
            for every occasion.
          </p>
        </div>

        <div className="footer-column">
          <h3>QUICK LINKS</h3>

          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/collections">Collections</Link>
        </div>

        <div className="footer-column">
          <h3>HELP</h3>

          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer-column">
          <h3>VISIT US</h3>

          <p>
            Madanlal Pradeep Kumar
            <br />
            Saree Showroom
          </p>

          <p>
            Near Chota Bazar,
            <br />
            Shikarpur, Bulandshahr
            <br />
            Uttar Pradesh
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Madanlal Sarees. All Rights Reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;