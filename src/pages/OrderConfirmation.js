import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderConfirmation() {
  const navigate = useNavigate();

  // Order saved by Checkout page
  const [order] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("lastOrder"));
    } catch {
      return null;
    }
  });

  const openWhatsApp = () => {
    if (order?.whatsappURL) {
      window.open(order.whatsappURL, "_blank");
    }
  };

  return (
    <div className="order-confirmation">
      <div className="confirmation-box">

        <div className="confirmation-icon">✓</div>

        <p className="confirmation-small">THANK YOU</p>

        <h1>Order Placed</h1>

        {order?.orderId && (
          <p className="confirmation-order-id">
            ORDER ID: <strong>{order.orderId}</strong>
          </p>
        )}

        <p className="confirmation-message">
          Your order details have been prepared on WhatsApp.
          Please send the message to complete your order.
        </p>

        <p className="confirmation-note">
          We will confirm availability, delivery charges and
          payment details with you on WhatsApp.
        </p>

        <div className="confirmation-buttons">
          {order?.whatsappURL && (
            <button
              className="confirmation-secondary-btn"
              onClick={openWhatsApp}
            >
              OPEN WHATSAPP AGAIN
            </button>
          )}

          <button onClick={() => navigate("/shop")}>
            CONTINUE SHOPPING
          </button>
        </div>

      </div>
    </div>
  );
}

export default OrderConfirmation;