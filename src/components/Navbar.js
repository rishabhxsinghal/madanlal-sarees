import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          MADANLAL SAREES
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="nav-icons">

          <span
            className="search-icon"
            onClick={() => navigate("/search")}
          >
            <Search size={20} strokeWidth={1.5} />
          </span>

          <Link to="/wishlist" className="wishlist-icon">
            <Heart size={20} strokeWidth={1.5} />

            {wishlist.length > 0 && (
              <span className="wishlist-count">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link to="/cart" className="cart-icon">
            <ShoppingBag size={20} strokeWidth={1.5} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;