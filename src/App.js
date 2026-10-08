import { Routes, Route} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import { CartProvider } from "./context/CartContext";
import Wishlist from "./components/Wishlist";
import { WishlistProvider } from "./context/WishlistContext";
import Shop from "./pages/Shop";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Search from "./components/Search";
import Checkout from "./components/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <ScrollToTop />
      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
<Route path="/search" element={<Search />} />
<Route path="/checkout" element={<Checkout />} />
<Route
  path="/order-confirmation"
  element={<OrderConfirmation />}
/>
<Route path="/checkout" element={<Checkout />} />

<Route
  path="/order-confirmation"
  element={<OrderConfirmation />}
/>

<Route path="*" element={<NotFound />} />

        </Routes>
        <WhatsAppButton />
        <Footer/>
        </WishlistProvider>
      
    </CartProvider>
  );
}

export default App;