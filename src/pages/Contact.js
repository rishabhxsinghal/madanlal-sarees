import Navbar from "../components/Navbar";

function Contact() {
  return (
    <>
      <Navbar />

      <section className="contact-page">

        <div className="contact-content">

          <p className="contact-small">
            GET IN TOUCH
          </p>

          <h1>
            We'd Love To
            <br />
            Hear From You
          </h1>

          <div className="contact-details">

            <div>
              <h3>Visit Our Store</h3>
              <p>
                Madanlal Pradeep Kumar Saree Showroom
                <br />
                Near Chota Bazar, Shikarpur
                <br />
                Bulandshahr, Uttar Pradesh
              </p>
            </div>

            <div>
              <h3>Contact Us</h3>
              <p>
                Phone: +91 8273735072
                <br />
                WhatsApp: +91 8273735072
              </p>
            </div>

          </div>

        </div>

      </section>
    </>
  );
}

export default Contact;