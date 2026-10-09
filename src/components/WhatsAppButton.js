import { MessageCircle } from "lucide-react";
import shop from "../config";

function WhatsAppButton() {
  const message = encodeURIComponent(
    `Hello ${shop.name}, I would like to know more about your sarees.`
  );

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${shop.whatsapp}?text=${message}`,
      "_blank"
    );
  };

  return (
    <button
      className="whatsapp-button"
      onClick={handleWhatsApp}
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={22} />
      <span>Chat With Us</span>
    </button>
  );
}

export default WhatsAppButton;