import React from "react";
import Layout from "./common/Layout";
import { CartContext } from "./context/cart.jsx";
import { useContext } from "react";
import { Link } from "react-router-dom";

const Cardproduct = () => {
  const { cartItems, removeFromCart, finalTotal, updateQty } =
    useContext(CartContext);

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .cart-page {
          font-family: 'DM Sans', sans-serif;
          background: #faf9f7;
          min-height: 100vh;
          padding: 48px 0 80px;
        }

        .cart-heading {
          font-family: 'Playfair Display', serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }

        .cart-count {
          font-size: 0.85rem;
          color: #888;
          font-weight: 400;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .cart-breadcrumb {
          font-size: 0.8rem;
          color: #aaa;
          margin-bottom: 40px;
        }

        .cart-breadcrumb a {
          color: #aaa;
          text-decoration: none;
        }

        .cart-breadcrumb a:hover { color: #1a1a1a; }

        .cart-table-header {
          display: grid;
          grid-template-columns: 80px 1fr 120px 130px 110px 80px 48px;
          gap: 12px;
          padding: 0 20px 12px;
          border-bottom: 1.5px solid #e8e4de;
          font-size: 0.72rem;
          font-weight: 500;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 80px 1fr 120px 130px 110px 80px 48px;
          gap: 12px;
          align-items: center;
          padding: 22px 20px;
          border-bottom: 1px solid #eeebe5;
          background: #fff;
          margin-bottom: 4px;
          border-radius: 12px;
          transition: box-shadow 0.2s ease;
        }

        .cart-item:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }

        .cart-item-img {
          width: 72px;
          height: 72px;
          border-radius: 10px;
          object-fit: cover;
          background: #f0ede8;
        }

        .cart-item-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 4px;
          line-height: 1.3;
        }

        .cart-item-sku {
          font-size: 0.75rem;
          color: #bbb;
          font-weight: 300;
        }

        .cart-item-price {
          font-size: 0.95rem;
          font-weight: 500;
          color: #444;
        }

        .size-badge {
          display: inline-block;
          padding: 4px 14px;
          border: 1.5px solid #d4cfc8;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          color: #555;
          background: #faf9f7;
          letter-spacing: 0.5px;
        }

        .qty-control {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1.5px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          width: fit-content;
          background: #fff;
        }

        .qty-btn {
          width: 30px;
          height: 34px;
          background: #f5f3f0;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          color: #555;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          font-weight: 300;
        }

        .qty-btn:hover { background: #eae7e2; }

        .qty-input {
          width: 40px;
          height: 34px;
          border: none;
          border-left: 1px solid #e8e4de;
          border-right: 1px solid #e8e4de;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a1a1a;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          background: #fff;
          -moz-appearance: textfield;
        }

        .qty-input::-webkit-inner-spin-button,
        .qty-input::-webkit-outer-spin-button { -webkit-appearance: none; }

        .item-subtotal {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .remove-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ccc;
          transition: all 0.2s;
        }

        .remove-btn:hover {
          background: #fef2f2;
          color: #ef4444;
        }

        /* Summary Panel */
        .summary-panel {
          background: #fff;
          border-radius: 16px;
          padding: 32px;
          border: 1px solid #eeebe5;
          position: sticky;
          top: 24px;
        }

        .summary-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eeebe5;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 0.9rem;
          color: #666;
        }

        .summary-row.total {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1.5px solid #e8e4de;
          margin-bottom: 24px;
        }

        .checkout-btn {
          width: 100%;
          padding: 14px;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .checkout-btn:hover {
          background: #333;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .continue-link {
          display: block;
          text-align: center;
          margin-top: 14px;
          font-size: 0.8rem;
          color: #aaa;
          text-decoration: none;
          transition: color 0.2s;
        }

        .continue-link:hover { color: #1a1a1a; }

        .empty-cart {
          text-align: center;
          padding: 80px 20px;
          color: #bbb;
        }

        .empty-cart svg {
          opacity: 0.3;
          margin-bottom: 16px;
        }

        .empty-cart p {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          color: #aaa;
        }

        @media (max-width: 768px) {
          .cart-table-header { display: none; }
          .cart-item {
            grid-template-columns: 72px 1fr;
            grid-template-rows: auto;
            gap: 8px;
          }
        }
      `}</style>

      <div className="cart-page">
        <div className="container">
          {/* Header */}
          <div className="cart-breadcrumb">
            <a href="/">Home</a> &nbsp;/&nbsp; Cart
          </div>

          <div className="d-flex align-items-baseline gap-3 mb-4">
            <h1 className="cart-heading">Your Cart</h1>
            <span className="cart-count">
              {cartItems?.length || 0}{" "}
              {cartItems?.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="row g-4">
            {/* Cart Items */}
            <div className="col-lg-8">
              {cartItems && cartItems.length > 0 ? (
                <>
                  <div className="cart-table-header">
                    <div></div>
                    <div>Product</div>
                    <div>Price</div>
                    <div>Size</div>
                    <div>Qty</div>
                    <div>Subtotal</div>
                    <div></div>
                  </div>

                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                      {/* Image */}
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="cart-item-img"
                      />

                      {/* Title */}
                      <div>
                        <p className="cart-item-title">{item.title}</p>
                        <span className="cart-item-sku">
                          ID: {item.productId}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="cart-item-price">
                        ${Number(item.price).toFixed(2)}
                      </div>

                      {/* Size */}
                      <div>
                        <span className="size-badge">
                          {item.size ? item.size.name : "N/A"}
                        </span>
                      </div>

                      {/* Qty */}
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.id, item.qty - 1)}
                        >
                          −
                        </button>
                        <input
                          className="qty-input"
                          type="number"
                          value={item.qty}
                          min={1}
                          onChange={(e) =>
                            updateQty(item.id, Number(e.target.value))
                          }
                        />
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item.id, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="item-subtotal">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>

                      {/* Remove */}
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <div className="empty-cart">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    fill="#ccc"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                  </svg>
                  <p>Your cart is empty</p>
                  <a
                    href="/shop"
                    style={{ color: "#1a1a1a", fontSize: "0.85rem" }}
                  >
                    Browse products →
                  </a>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="col-lg-4">
              <div className="summary-panel">
                <div className="summary-title">Order Summary</div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>${finalTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span style={{ color: "#22c55e", fontWeight: 500 }}>
                    Free
                  </span>
                </div>

                <div className="summary-row total">
                  <span>Total</span>
                  <span>${finalTotal().toFixed(2)}</span>
                </div>

                <Link to="/checkout" className="checkout-btn">
                  Proceed to Checkout
                </Link>
                <a href="/shop" className="continue-link">
                  ← Continue Shopping
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cardproduct;
