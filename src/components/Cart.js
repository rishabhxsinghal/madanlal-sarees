import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "./Navbar";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity
  } = useCart();

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price.replace(/,/g, "")) * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <div className="cart-page">

        <div className="cart-heading">
          <p>YOUR COLLECTION</p>
          <h1>Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">

            <p className="cart-empty-small">
              YOUR SHOPPING BAG
            </p>

            <h2>Your Cart is Empty</h2>

            <p>
              Discover our latest sarees and find something
              beautiful for your next occasion.
            </p>

            <button
              onClick={() => navigate("/shop")}
            >
              EXPLORE SAREES
            </button>

          </div>
        ) : (
          <div className="cart-layout">

            <div className="cart-items">

              {cart.map((item, index) => {

                const itemPrice = Number(
                  item.price.replace(/,/g, "")
                );

                const itemTotal =
                  itemPrice * item.quantity;

                return (
                  <div
                    className="cart-item"
                    key={index}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="cart-item-info">

                      <h3>{item.name}</h3>

                      <p className="cart-fabric">
                        {item.fabric}
                      </p>

                      <p className="cart-price">
                        ₹{item.price}
                      </p>

                      {item.stock > 0 && (
                        <p className="cart-stock">
                          {item.stock} available
                        </p>
                      )}

                      <div className="quantity-control">

                        <button
                          onClick={() =>
                            decreaseQuantity(item.name)
                          }
                        >
                          −
                        </button>

                        <span>
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.name)
                          }
                          disabled={
                            item.stock !== undefined &&
                            item.quantity >= item.stock
                          }
                        >
                          +
                        </button>

                      </div>

                      <p className="item-subtotal">
                        Subtotal: ₹
                        {itemTotal.toLocaleString("en-IN")}
                      </p>

                      <button
                        className="remove-cart-btn"
                        onClick={() =>
                          removeFromCart(index)
                        }
                      >
                        REMOVE
                      </button>

                    </div>

                  </div>
                );
              })}

            </div>

            <div className="cart-summary">

              <p className="summary-small">
                ORDER SUMMARY
              </p>

              <h2>Cart Total</h2>

              <div className="summary-row">
                <span>
                  {cart.reduce(
                    (sum, item) =>
                      sum + item.quantity,
                    0
                  )}{" "}
                  Items
                </span>

                <span>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>

                <strong>
                  ₹{total.toLocaleString("en-IN")}
                </strong>
              </div>

              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                PROCEED TO CHECKOUT
              </button>

              <button
                className="continue-shopping-btn"
                onClick={() => navigate("/shop")}
              >
                CONTINUE SHOPPING
              </button>

            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default Cart;