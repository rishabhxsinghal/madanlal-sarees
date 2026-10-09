import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="logo"
          onClick={closeMenu}
        >
          MADANLAL SAREES
        </Link>

        <div className="nav-links">

          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          <NavLink to="/shop" className={navClass}>
            Shop
          </NavLink>

          <NavLink to="/collections" className={navClass}>
            Collections
          </NavLink>

          <NavLink to="/about" className={navClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navClass}>
            Contact
          </NavLink>

        </div>

        <div className="nav-icons">

          <button
            className="nav-icon-button"
            onClick={() => navigate("/search")}
            aria-label="Search"
          >
            <Search size={19} strokeWidth={1.5} />
          </button>

          <Link
            to="/wishlist"
            className="nav-icon-button"
            aria-label="Wishlist"
          >
            <Heart size={19} strokeWidth={1.5} />

            {wishlist.length > 0 && (
              <span className="wishlist-count">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="nav-icon-button"
            aria-label="Cart"
          >
            <ShoppingBag size={19} strokeWidth={1.5} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            {menuOpen ? (
              <X size={21} strokeWidth={1.5} />
            ) : (
              <Menu size={21} strokeWidth={1.5} />
            )}
          </button>

        </div>

      </div>

      <div
        className={
          menuOpen
            ? "mobile-menu open"
            : "mobile-menu"
        }
      >
        <NavLink
          to="/"
          className={navClass}
          onClick={closeMenu}
        >
          Home
        </NavLink>

        <NavLink
          to="/shop"
          className={navClass}
          onClick={closeMenu}
        >
          Shop
        </NavLink>

        <NavLink
          to="/collections"
          className={navClass}
          onClick={closeMenu}
        >
          Collections
        </NavLink>

        <NavLink
          to="/about"
          className={navClass}
          onClick={closeMenu}
        >
          About
        </NavLink>

        <NavLink
          to="/contact"
          className={navClass}
          onClick={closeMenu}
        >
          Contact
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;