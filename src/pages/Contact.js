import Navbar from "../components/Navbar";
import shop from "../config";

function Contact() {
  const fullAddress = `${shop.addressLine1}, ${shop.city}, ${shop.state}`;
  const mapQuery = encodeURIComponent(fullAddress);

  const mapEmbed = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

  const mapLink =
    shop.mapLink ||
    `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const whatsappLink = `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(
    `Hello ${shop.name}, I would like to know more about your sarees.`
  )}`;

  return (
    <>
      <Navbar />

      <div className="contact-premium">

        {/* HERO */}
        <section className="contact-hero">
          <div className="contact-hero-content">
            <p>GET IN TOUCH</p>
            <h1>We'd Love To Hear From You</h1>
            <span>
              Visit our showroom, call us, or message us on WhatsApp.
              We are happy to help you find the perfect saree.
            </span>
          </div>
        </section>

        {/* INFO CARDS */}
        <section className="contact-cards-section">
          <div className="contact-cards">

            <div className="contact-card">
              <span className="contact-card-number">01</span>
              <h3>Visit Our Showroom</h3>
              <p className="contact-card-strong">{shop.fullName}</p>
              <p>
                {shop.addressLine1}
                <br />
                {shop.city}, {shop.state}
              </p>
              <a href={mapLink} target="_blank" rel="noreferrer">
                GET DIRECTIONS
              </a>
            </div>

            <div className="contact-card">
              <span className="contact-card-number">02</span>
              <h3>Call Us</h3>
              <p className="contact-card-strong">{shop.phoneDisplay}</p>
              <p>Speak to us directly about sarees, prices and availability.</p>
              <a href={`tel:+${shop.whatsapp}`}>CALL NOW</a>
            </div>

            <div className="contact-card">
              <span className="contact-card-number">03</span>
              <h3>WhatsApp</h3>
              <p className="contact-card-strong">{shop.phoneDisplay}</p>
              <p>Send us a message or a photo of the saree you like.</p>
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                CHAT ON WHATSAPP
              </a>
            </div>

            {shop.timing && (
              <div className="contact-card">
                <span className="contact-card-number">04</span>
                <h3>Showroom Hours</h3>
                <p className="contact-card-strong">{shop.timing}</p>
                <p>
                  {shop.closedDay
                    ? `Closed on ${shop.closedDay}`
                    : "Open all days"}
                </p>
              </div>
            )}

          </div>
        </section>

        {/* MAP */}
        <section className="contact-map-section">
          <div className="contact-map-heading">
            <p>FIND US</p>
            <h2>Our Location</h2>
          </div>

          <div className="contact-map">
            <iframe
              title="Showroom location"
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        {/* CTA */}
        <section className="contact-cta">
          <p>NEED HELP CHOOSING?</p>
          <h2>Send Us A Message</h2>
          <span>
            Share your occasion and budget, and we will suggest the best
            sarees for you.
          </span>
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            MESSAGE US ON WHATSAPP
          </a>
        </section>

      </div>
    </>
  );
}

export default Contact;