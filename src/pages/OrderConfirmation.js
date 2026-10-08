import React from "react";
import { useNavigate } from "react-router-dom";

function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="order-confirmation">
      <div className="confirmation-box">
        <div className="confirmation-icon">✓</div>

        <p className="confirmation-small">
          ORDER RECEIVED
        </p>

        <h1>Thank You</h1>

        <p className="confirmation-message">
          Thank you for shopping with Madanlal Sarees.
          Your order details have been sent to us on WhatsApp.
        </p>

        <p className="confirmation-note">
          Our team will contact you shortly to confirm your
          order and delivery details.
        </p>

        <button
          onClick={() => navigate("/shop")}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;