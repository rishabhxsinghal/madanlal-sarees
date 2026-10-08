import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <section className="not-found-page">
        <div className="not-found-content">

          <p>PAGE NOT FOUND</p>

          <h1>404</h1>

          <h2>
            The page you're looking for
            <br />
            doesn't exist.
          </h2>

          <button onClick={() => navigate("/")}>
            BACK TO HOME
          </button>

        </div>
      </section>
    </>
  );
}

export default NotFound;