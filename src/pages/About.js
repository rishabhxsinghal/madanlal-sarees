import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <Navbar />

      <section className="about-page">

        <div className="about-content">

          <p className="about-small">
            OUR STORY
          </p>

          <h1>
            Tradition Woven
            <br />
            Into Every Saree
          </h1>

          <p>
            At Madanlal Sarees, we celebrate the timeless beauty
            of Indian sarees and the craftsmanship behind them.
            Our collection brings together traditional designs,
            elegant fabrics and contemporary styles for every
            special occasion.
          </p>

          <p>
            From festive celebrations to everyday elegance,
            every saree is carefully selected with a focus on
            quality, beauty and authenticity.
          </p>

        </div>

      </section>
    </>
  );
}

export default About;