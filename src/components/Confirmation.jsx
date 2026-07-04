import React from "react";
import { useLocation, Link } from "react-router-dom";
import Layout from "./common/Layout";

// NOTE: requires react-router-dom. Register alongside Checkout, e.g.:
//   <Route path="/order-success" element={<OrderSuccess />} />
// Checkout.jsx navigates here with the order details in router state,
// so this page only ever renders right after a real, successful order.

const Confirmation = () => {
  const location = useLocation();
  const order = location.state;

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .os-wrap { font-family: 'DM Sans', sans-serif; background: #faf9f7; max-width: 760px; }

        /* ── Stamp / signature element ── */
        .os-stamp-row { display: flex; justify-content: center; margin: 8px 0 18px; }

        .os-stamp {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          border: 2px solid #3f9142;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: os-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .os-stamp-check {
          stroke: #3f9142;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
          fill: none;
          stroke-dasharray: 28;
          stroke-dashoffset: 28;
          animation: os-draw 0.45s 0.35s ease-out forwards;
        }

        @keyframes os-pop { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes os-draw { to { stroke-dashoffset: 0; } }

        @media (prefers-reduced-motion: reduce) {
          .os-stamp, .os-stamp-check { animation: none; stroke-dashoffset: 0; }
        }

        .os-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 2rem;
          color: #2f7a39;
          text-align: center;
          margin-bottom: 6px;
        }

        .os-subtitle {
          text-align: center;
          color: #777;
          font-size: 0.92rem;
          margin: 0 0 32px;
        }

        /* ── Order summary card ── */
        .os-card {
          background: #fff;
          border: 1px solid #eeebe5;
          border-radius: 16px;
          padding: 32px;
        }

        .os-card-header {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #1a1a1a;
          padding-bottom: 16px;
          margin-bottom: 22px;
          border-bottom: 1.5px solid #e8e4de;
        }

        .os-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 32px;
          margin-bottom: 18px;
        }

        .os-detail {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 9px 0;
          font-size: 0.88rem;
          border-bottom: 1px dashed #eee;
        }

        .os-detail span:first-child { color: #999; }
        .os-detail span:last-child,
        .os-detail strong { color: #1a1a1a; font-weight: 600; text-align: right; }

        .os-badge {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.3px;
          background: #fdf0d8;
          color: #a86a14;
        }

        .os-payment { margin-bottom: 26px; }

        .os-items-title {
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .os-table { width: 100%; border-collapse: collapse; margin-bottom: 22px; }

        .os-table th {
          text-align: left;
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          color: #999;
          font-weight: 500;
          padding: 0 0 10px;
          border-bottom: 1.5px solid #e8e4de;
        }

        .os-table th:not(:first-child),
        .os-table td:not(:first-child) { text-align: right; }

        .os-table td {
          padding: 12px 0;
          font-size: 0.88rem;
          color: #333;
          border-bottom: 1px solid #f1efe9;
        }

        .os-table td:first-child { font-weight: 600; color: #1a1a1a; }

        .os-totals { margin-bottom: 28px; }

        .os-totals-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: #666;
          padding: 6px 0;
        }

        .os-totals-row.os-grand {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 6px;
          padding-top: 12px;
          border-top: 1.5px solid #e8e4de;
        }

        .os-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        .os-btn, .os-btn-outline {
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }

        .os-btn { background: #1a1a1a; color: #fff; border: 1px solid #1a1a1a; }
        .os-btn:hover { background: #333; color: #fff; }

        .os-btn-outline { background: #fff; color: #1a1a1a; border: 1px solid #d4cfc8; }
        .os-btn-outline:hover { background: #faf9f7; color: #1a1a1a; }

        .os-empty { text-align: center; padding: 70px 20px; color: #888; }
        .os-empty p { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #555; margin: 14px 0 18px; }

        @media (max-width: 560px) {
          .os-details-grid { grid-template-columns: 1fr; }
          .os-card { padding: 22px; }
        }
      `}</style>

      <div className="os-wrap container py-5">
        {order ? (
          <>
            <div className="os-stamp-row">
              <div className="os-stamp">
                <svg width="36" height="36" viewBox="0 0 40 40">
                  <polyline
                    className="os-stamp-check"
                    points="11,21 17,27 29,13"
                  />
                </svg>
              </div>
            </div>

            <h1 className="os-title">Thank You!</h1>
            <p className="os-subtitle">
              You have successfully placed your order.
            </p>

            <div className="os-card">
              <div className="os-card-header">Order Summary</div>

              <div className="os-details-grid">
                <div>
                  <div className="os-detail">
                    <span>Order ID</span>
                    <strong>#{order.orderId}</strong>
                  </div>
                  <div className="os-detail">
                    <span>Order Date</span>
                    <strong>{order.orderDate}</strong>
                  </div>
                  <div className="os-detail">
                    <span>Status</span>
                    <span className="os-badge">{order.status}</span>
                  </div>
                </div>
                <div>
                  <div className="os-detail">
                    <span>Customer</span>
                    <strong>{order.name}</strong>
                  </div>
                  <div className="os-detail">
                    <span>Address</span>
                    <strong>
                      {order.address}, {order.city}, {order.state}
                    </strong>
                  </div>
                  <div className="os-detail">
                    <span>Contact</span>
                    <strong>{order.email}</strong>
                  </div>
                </div>
              </div>

              <div className="os-detail os-payment">
                <span>Payment</span>
                <strong>{order.paymentMethod}</strong>
              </div>

              <div className="os-items-title">Items</div>
              <table className="os-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.title}
                        {item.size ? ` (${item.size.name})` : ""}
                      </td>
                      <td>{item.qty}</td>
                      <td>${(Number(item.price) * item.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="os-totals">
                <div className="os-totals-row">
                  <span>Subtotal</span>
                  <span>${(order.subtotal ?? order.total).toFixed(2)}</span>
                </div>
                <div className="os-totals-row">
                  <span>Shipping</span>
                  <span>
                    {!order.shipping || order.shipping === 0
                      ? "Free"
                      : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="os-totals-row os-grand">
                  <span>Grand Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="os-actions">
                <Link to="/account/orders" className="os-btn-outline">
                  View Order Details
                </Link>
                <Link to="/shop" className="os-btn">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="os-empty">
            <p>We couldn't find an order to show here</p>
            <span style={{ color: "#aaa", fontSize: "0.88rem" }}>
              If you just completed a purchase, check your email for the
              confirmation.
            </span>
            <div className="mt-4">
              <Link to="/shop" className="os-btn">
                Browse products
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Confirmation;
