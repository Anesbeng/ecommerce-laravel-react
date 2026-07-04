import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "./common/Layout";
import UserSidebar from "./common/UserSidebar";
import { ApiUrl, UserToken } from "./common/Https";

const STATUS_COLORS = {
  pending: { bg: "#fdf0d8", color: "#a86a14" },
  processing: { bg: "#dff0ff", color: "#1565a8" },
  shipped: { bg: "#e8f5e9", color: "#2e7d32" },
  delivered: { bg: "#ede7f6", color: "#512da8" },
  cancelled: { bg: "#fdecea", color: "#c62828" },
};

function statusStyle(status = "") {
  return (
    STATUS_COLORS[status.toLowerCase()] ?? { bg: "#f0f0f0", color: "#555" }
  );
}

function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const OrderCard = ({ order }) => {
  const [open, setOpen] = useState(false);
  const { bg, color } = statusStyle(order.status);

  return (
    <div className="oh-card">
      <button
        className="oh-card-header"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
      >
        <div className="oh-card-meta">
          <span className="oh-order-id">#{order.id}</span>
          <span className="oh-order-date">{fmt(order.created_at)}</span>
        </div>
        <div className="oh-card-right">
          <span className="oh-badge" style={{ background: bg, color }}>
            {order.status}
          </span>
          <span className="oh-total">
            ${Number(order.grand_total).toFixed(2)}
          </span>
          <svg
            className={`oh-chevron${open ? " oh-chevron--open" : ""}`}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="oh-card-body">
          <div className="oh-details-grid">
            <div>
              <div className="oh-detail">
                <span>Customer</span>
                <strong>{order.name}</strong>
              </div>
              <div className="oh-detail">
                <span>Email</span>
                <strong>{order.email}</strong>
              </div>
            </div>
            <div>
              <div className="oh-detail">
                <span>Address</span>
                <strong>
                  {order.address}, {order.city}, {order.state}
                </strong>
              </div>
              <div className="oh-detail">
                <span>Payment</span>
                <span
                  className="oh-badge"
                  style={statusStyle(order.payment_status)}
                >
                  {order.payment_status ?? "—"}
                </span>
              </div>
            </div>
          </div>

          <p className="oh-items-title">Items</p>
          <table className="oh-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {(order.order_items ?? []).map((item) => (
                <tr key={item.id}>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {item.product?.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.name}
                          style={{
                            width: "44px",
                            height: "44px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #eeebe5",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span>
                        {item.name}
                        {item.size ? ` (${item.size})` : ""}
                      </span>
                    </div>
                  </td>
                  <td>{item.qty}</td>
                  <td>${Number(item.unit_price).toFixed(2)}</td>
                  <td>${Number(item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="oh-totals">
            <div className="oh-totals-row">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="oh-totals-row">
              <span>Shipping</span>
              <span>
                {!order.shipping || Number(order.shipping) === 0
                  ? "Free"
                  : `$${Number(order.shipping).toFixed(2)}`}
              </span>
            </div>
            <div className="oh-totals-row oh-grand">
              <span>Grand Total</span>
              <span>${Number(order.grand_total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = UserToken();
    fetch(`${ApiUrl}/orders`, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setOrders(Array.isArray(data) ? data : (data.data ?? [])))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .oh-page-wrap {
          max-width: 980px; margin: 0 auto;
          padding: 48px 20px;
          display: flex; gap: 28px; align-items: flex-start;
          font-family: 'DM Sans', sans-serif;
        }
        .oh-content { flex: 1; min-width: 0; }

        .oh-heading {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 1.6rem; color: #1a1a1a; margin-bottom: 4px;
        }
        .oh-subheading { color: #888; font-size: 0.88rem; margin: 0 0 24px; }

        .oh-card {
          background: #fff; border: 1px solid #eeebe5;
          border-radius: 16px; margin-bottom: 14px; overflow: hidden;
        }
        .oh-card-header {
          width: 100%; background: none; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; padding: 20px 28px; text-align: left;
        }
        .oh-card-header:hover { background: #faf9f7; }

        .oh-card-meta { display: flex; flex-direction: column; gap: 4px; }
        .oh-order-id {
          font-family: 'Playfair Display', serif;
          font-weight: 700; font-size: 1rem; color: #1a1a1a;
        }
        .oh-order-date { font-size: 0.8rem; color: #aaa; }

        .oh-card-right { display: flex; align-items: center; gap: 16px; }
        .oh-total { font-weight: 600; font-size: 0.95rem; color: #1a1a1a; }

        .oh-badge {
          display: inline-block; padding: 3px 12px; border-radius: 20px;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.3px;
        }
        .oh-chevron { color: #bbb; transition: transform 0.25s ease; flex-shrink: 0; }
        .oh-chevron--open { transform: rotate(180deg); }

        .oh-card-body { padding: 0 28px 24px; border-top: 1.5px solid #e8e4de; }
        .oh-details-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0 32px; margin: 20px 0 16px;
        }
        .oh-detail {
          display: flex; justify-content: space-between; gap: 12px;
          padding: 9px 0; font-size: 0.88rem; border-bottom: 1px dashed #eee;
        }
        .oh-detail span:first-child { color: #999; }
        .oh-detail strong { color: #1a1a1a; font-weight: 600; text-align: right; }

        .oh-items-title {
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem; font-weight: 700; color: #1a1a1a; margin: 18px 0 10px;
        }
        .oh-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .oh-table th {
          text-align: left; font-size: 0.72rem; text-transform: uppercase;
          letter-spacing: 0.6px; color: #999; font-weight: 500;
          padding: 0 0 10px; border-bottom: 1.5px solid #e8e4de;
        }
        .oh-table th:not(:first-child), .oh-table td:not(:first-child) { text-align: right; }
        .oh-table td {
          padding: 11px 0; font-size: 0.88rem; color: #333;
          border-bottom: 1px solid #f1efe9;
        }
        .oh-table td:first-child { font-weight: 600; color: #1a1a1a; }

        .oh-totals { margin-bottom: 4px; }
        .oh-totals-row {
          display: flex; justify-content: space-between;
          font-size: 0.88rem; color: #666; padding: 6px 0;
        }
        .oh-totals-row.oh-grand {
          font-size: 1rem; font-weight: 700; color: #1a1a1a;
          margin-top: 6px; padding-top: 12px; border-top: 1.5px solid #e8e4de;
        }

        .oh-spinner-wrap { display: flex; justify-content: center; padding: 60px 0; }
        .oh-spinner {
          width: 36px; height: 36px;
          border: 3px solid #e8e4de; border-top-color: #1a1a1a;
          border-radius: 50%; animation: oh-spin 0.7s linear infinite;
        }
        @keyframes oh-spin { to { transform: rotate(360deg); } }

        .oh-empty, .oh-error { text-align: center; padding: 60px 20px; color: #888; }
        .oh-empty p, .oh-error p {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem; color: #555; margin: 0 0 16px;
        }
        .oh-btn {
          display: inline-block; padding: 12px 24px; border-radius: 10px;
          font-size: 0.88rem; font-weight: 500; text-decoration: none;
          background: #1a1a1a; color: #fff; border: 1px solid #1a1a1a;
          transition: background 0.2s;
        }
        .oh-btn:hover { background: #333; color: #fff; }

        @media (max-width: 640px) {
          .oh-page-wrap { flex-direction: column; padding: 24px 16px; }
          .oh-details-grid { grid-template-columns: 1fr; }
          .oh-card-header, .oh-card-body { padding-left: 18px; padding-right: 18px; }
          .oh-card-right { gap: 10px; }
          .oh-total { display: none; }
        }
      `}</style>

      <div className="oh-page-wrap">
        <UserSidebar />

        <div className="oh-content">
          <h1 className="oh-heading">My Orders</h1>
          <p className="oh-subheading">A history of all your purchases</p>

          {loading && (
            <div className="oh-spinner-wrap">
              <div className="oh-spinner" />
            </div>
          )}

          {!loading && error && (
            <div className="oh-error">
              <p>Couldn't load your orders</p>
              <span style={{ fontSize: "0.85rem", color: "#bbb" }}>
                {error}
              </span>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="oh-empty">
              <p>No orders yet</p>
              <Link to="/Shop" className="oh-btn">
                Browse products
              </Link>
            </div>
          )}

          {!loading &&
            !error &&
            orders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      </div>
    </Layout>
  );
};

export default OrderHistory;
