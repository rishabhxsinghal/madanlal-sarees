import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import shop from "../config";

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price.replace(/,/g, "")) * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
        
    e.preventDefault();

    const orderId = "MS" + Date.now().toString().slice(-6);

    const orderItems = cart
      .map(
        (item) =>
          `${item.name} x ${item.quantity} = ₹${(
            Number(item.price.replace(/,/g, "")) *
            item.quantity
          ).toLocaleString("en-IN")}`
      )
      .join("\n");

    const message = `Hello Madanlal Sarees,

I would like to place an order.

Order ID: ${orderId}

Customer Details:
Name: ${form.name}
Mobile: ${form.phone}
Address: ${form.address}
City: ${form.city}
Pincode: ${form.pincode}

Order Details:
${orderItems}

Total: ₹${total.toLocaleString("en-IN")}
Delivery: To be confirmed
Payment: To be confirmed (COD / UPI)

Please confirm my order.`;

        const whatsappNumber = shop.whatsapp;

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Save so the confirmation page can reopen WhatsApp
    sessionStorage.setItem(
      "lastOrder",
      JSON.stringify({ orderId, whatsappURL })
    );

    window.open(whatsappURL, "_blank");

    clearCart();
    navigate("/order-confirmation");
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-empty">

        <p>YOUR SHOPPING BAG</p>

        <h1>Your Cart Is Empty</h1>

        <p>
          Add some beautiful sarees before proceeding to checkout.
        </p>

        <button onClick={() => navigate("/shop")}>
          CONTINUE SHOPPING
        </button>

      </div>
    );
  }

  return (
    <div className="checkout-page">

      <div className="checkout-heading">
        <p>COMPLETE YOUR ORDER</p>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-container">

        <div className="checkout-form">

          <div className="checkout-section-title">
            <span>01</span>
            <h2>Delivery Details</h2>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="checkout-field">
              <label>FULL NAME</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="checkout-field">
              <label>MOBILE NUMBER</label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                maxLength="10"
                placeholder="Enter 10 digit mobile number"
                required
              />
            </div>

            <div className="checkout-field">
              <label>DELIVERY ADDRESS</label>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="House no., street, locality"
                required
              />
            </div>

            <div className="checkout-two-column">

              <div className="checkout-field">
                <label>CITY</label>

                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />
              </div>

              <div className="checkout-field">
                <label>PINCODE</label>

                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  pattern="[0-9]{6}"
                  maxLength="6"
                  placeholder="6 digit pincode"
                  required
                />
              </div>

            </div>

            <div className="checkout-note">
              <strong>ORDER CONFIRMATION</strong>

              <p>
                After placing your order, WhatsApp will open with
                your order details. We will confirm availability
                and delivery details with you.
              </p>
            </div>

            <button
              className="place-order-btn"
              type="submit"
            >
              PLACE ORDER ON WHATSAPP
            </button>

          </form>

        </div>

        <div className="checkout-summary">

          <p className="summary-small">
            YOUR ORDER
          </p>

          <h2>Order Summary</h2>

          <div className="checkout-items">

            {cart.map((item, index) => {

              const itemTotal =
                Number(item.price.replace(/,/g, "")) *
                item.quantity;

              return (
                <div
                  className="checkout-item"
                  key={index}
                >

                  <div className="checkout-item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <span>
                      {item.quantity}
                    </span>
                  </div>

                  <div className="checkout-item-info">

                    <h3>{item.name}</h3>

                    <p>{item.fabric}</p>

                    <strong>
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </strong>

                  </div>

                </div>
              );
            })}

          </div>

          <div className="checkout-summary-line">
            <span>Items</span>
            <span>{totalItems}</span>
          </div>

          <div className="checkout-summary-line">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          <div className="checkout-summary-line">
            <span>Delivery</span>
            <span>To be confirmed</span>
          </div>

          <div className="checkout-divider"></div>

          <div className="checkout-total">
            <span>Total</span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;