function TrustSection() {
  const features = [
    {
      title: "AUTHENTIC SAREES",
      text: "Carefully selected sarees with traditional craftsmanship."
    },
    {
      title: "QUALITY FABRICS",
      text: "Beautiful fabrics chosen for comfort, elegance and quality."
    },
    {
      title: "TRUSTED SINCE 1976",
      text: "A family business built on trust and generations of experience."
    },
    {
      title: "PERSONAL ASSISTANCE",
      text: "Get in touch with us for help choosing your perfect saree."
    }
  ];

  return (
    <section className="trust-section">
      <div className="section-heading">
        <p>WHY CHOOSE US</p>
        <h2>The Madanlal Promise</h2>
      </div>

      <div className="trust-grid">
        {features.map((feature, index) => (
          <div className="trust-card" key={index}>
            <div className="trust-number">
              0{index + 1}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustSection;