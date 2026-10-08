import { MessageCircle } from "lucide-react";

function WhatsAppButton() {
  const whatsappNumber = "918273735072";

  const message = encodeURIComponent(
    "Hello Madanlal Sarees, I would like to know more about your sarees."
  );

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
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