import React, { useEffect, useState } from "react";
import { ApiUrl } from "../common/Https";
import { AdminToken } from "../common/Https";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AdminLayout from "../common/AdminLayout";

// Route: <Route path="/admin/orders" element={<AdminOrders />} />
//
// Reads admin token from localStorage key "adminToken"
// Adjust the key to match your admin login storage.

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS = {
  pending: { bg: "#fdf0d8", color: "#a86a14" },
  processing: { bg: "#dff0ff", color: "#1565a8" },
  shipped: { bg: "#e8f5e9", color: "#2e7d32" },
  delivered: { bg: "#ede7f6", color: "#512da8" },
  cancelled: { bg: "#fdecea", color: "#c62828" },
};

function statusStyle(status = "") {
  return (
    STATUS_COLORS[status?.toLowerCase()] ?? { bg: "#f0f0f0", color: "#555" }
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

function authHeaders() {
  const token = AdminToken();
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Status badge ─────────────────────────────────────────────────────────────
const Badge = ({ status }) => {
  const { bg, color } = statusStyle(status);
  return (
    <span
      style={{
        background: bg,
        color,
        padding: "3px 12px",
        borderRadius: 20,
        fontSize: "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.3px",
        display: "inline-block",
        textTransform: "capitalize",
      }}
    >
      {status ?? "—"}
    </span>
  );
};

// ─── Order detail modal ───────────────────────────────────────────────────────
const OrderModal = ({ orderId, onClose, onStatusChange }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetch(`${ApiUrl}/admin/orders/${orderId}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        setOrder(d);
        setNewStatus(d.status);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  const handleStatusSave = () => {
    setSaving(true);
    fetch(`${ApiUrl}/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status: newStatus }),
    })
      .then((r) => r.json())
      .then(() => {
        onStatusChange(orderId, newStatus);
        onClose();
      })
      .finally(() => setSaving(false));
  };

  return (
    <div
      className="ao-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ao-modal">
        <div className="ao-modal-head">
          <span className="ao-modal-title">
            {loading ? "Loading…" : `Order #${order?.id}`}
          </span>
          <button className="ao-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {loading ? (
          <div className="ao-spinner-wrap">
            <div className="ao-spinner" />
          </div>
        ) : (
          <div className="ao-modal-body">
            {/* Customer info */}
            <div className="ao-section-title">Customer</div>
            <div className="ao-info-grid">
              <div className="ao-info-row">
                <span>Name</span>
                <strong>{order.name}</strong>
              </div>
              <div className="ao-info-row">
                <span>Email</span>
                <strong>{order.email}</strong>
              </div>
              <div className="ao-info-row">
                <span>Phone</span>
                <strong>{order.mobile ?? "—"}</strong>
              </div>
              <div className="ao-info-row">
                <span>Address</span>
                <strong>
                  {order.address}, {order.city}, {order.state} {order.zip}
                </strong>
              </div>
              <div className="ao-info-row">
                <span>Date</span>
                <strong>{fmt(order.created_at)}</strong>
              </div>
              <div className="ao-info-row">
                <span>Payment</span>
                <Badge status={order.payment_status} />
              </div>
            </div>

            {/* Items */}
            <div className="ao-section-title" style={{ marginTop: 24 }}>
              Items
            </div>
            <table className="ao-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Qty</th>
                  <th>Unit</th>
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
                          gap: 10,
                        }}
                      >
                        {item.product?.image_url && (
                          <img
                            src={item.product.image_url}
                            alt={item.name}
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "1px solid #eeebe5",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td>{item.size ?? "—"}</td>
                    <td>{item.qty}</td>
                    <td>${Number(item.unit_price).toFixed(2)}</td>
                    <td>${Number(item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="ao-totals">
              <div className="ao-totals-row">
                <span>Subtotal</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="ao-totals-row">
                <span>Shipping</span>
                <span>
                  {!order.shipping || Number(order.shipping) === 0
                    ? "Free"
                    : `$${Number(order.shipping).toFixed(2)}`}
                </span>
              </div>
              <div className="ao-totals-row ao-grand">
                <span>Grand Total</span>
                <span>${Number(order.grand_total).toFixed(2)}</span>
              </div>
            </div>

            {/* Status update */}
            <div className="ao-status-update">
              <div className="ao-section-title">Update Status</div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <select
                  className="ao-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  className="ao-btn"
                  onClick={handleStatusSave}
                  disabled={saving || newStatus === order.status}
                >
                  {saving ? "Saving…" : "Save Status"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${ApiUrl}/admin/orders`, { headers: authHeaders() })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => setOrders(Array.isArray(d) ? d : (d.data ?? [])))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const filtered = orders.filter((o) => {
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    const matchSearch =
      search === "" ||
      o.name?.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search);
    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout>
      {" "}
      <div className="ao-wrap">
        <style>{`
        .ao-wrap { font-family: 'DM Sans', sans-serif; padding: 32px; background: #f8f8f6; min-height: 100vh; }

        .ao-page-title { font-size: 1.5rem; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
        .ao-page-sub { font-size: 0.85rem; color: #999; margin-bottom: 28px; }

        /* ── Toolbar ── */
        .ao-toolbar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .ao-search {
          flex: 1; min-width: 200px;
          padding: 10px 16px; border: 1px solid #e0ddd8;
          border-radius: 10px; font-size: 0.88rem; background: #fff;
          outline: none;
        }
        .ao-search:focus { border-color: #1a1a1a; }
        .ao-filter-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
        .ao-tab {
          padding: 8px 14px; border-radius: 20px; font-size: 0.78rem;
          font-weight: 600; border: 1px solid #e0ddd8; background: #fff;
          cursor: pointer; color: #666; transition: all 0.15s;
        }
        .ao-tab:hover { background: #f0ede8; }
        .ao-tab.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

        /* ── Table card ── */
        .ao-card { background: #fff; border: 1px solid #eeebe5; border-radius: 16px; overflow: hidden; }
        .ao-table-wrap { overflow-x: auto; }
        table.ao-main-table { width: 100%; border-collapse: collapse; }
        .ao-main-table th {
          text-align: left; font-size: 0.72rem; text-transform: uppercase;
          letter-spacing: 0.6px; color: #999; font-weight: 500;
          padding: 14px 20px; border-bottom: 1.5px solid #e8e4de;
          white-space: nowrap;
        }
        .ao-main-table td {
          padding: 14px 20px; font-size: 0.88rem; color: #333;
          border-bottom: 1px solid #f1efe9; vertical-align: middle;
        }
        .ao-main-table tr:last-child td { border-bottom: none; }
        .ao-main-table tr:hover td { background: #faf9f7; }
        .ao-order-num { font-weight: 700; color: #1a1a1a; }
        .ao-customer { font-weight: 500; color: #1a1a1a; }
        .ao-customer-email { font-size: 0.78rem; color: #aaa; }

        /* ── Detail button ── */
        .ao-detail-btn {
          padding: 7px 16px; border-radius: 8px; font-size: 0.8rem;
          font-weight: 500; background: #fff; border: 1px solid #d4cfc8;
          cursor: pointer; color: #1a1a1a; transition: background 0.15s;
        }
        .ao-detail-btn:hover { background: #f0ede8; }

        /* ── Empty / error ── */
        .ao-empty { text-align: center; padding: 60px 20px; color: #aaa; font-size: 0.9rem; }

        /* ── Spinner ── */
        .ao-spinner-wrap { display: flex; justify-content: center; padding: 60px 0; }
        .ao-spinner {
          width: 32px; height: 32px;
          border: 3px solid #e8e4de; border-top-color: #1a1a1a;
          border-radius: 50%; animation: ao-spin 0.7s linear infinite;
        }
        @keyframes ao-spin { to { transform: rotate(360deg); } }

        /* ── Modal overlay ── */
        .ao-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 16px;
        }
        .ao-modal {
          background: #fff; border-radius: 18px;
          width: 100%; max-width: 680px; max-height: 90vh;
          overflow-y: auto; box-shadow: 0 24px 60px rgba(0,0,0,0.18);
        }
        .ao-modal-head {
          display: flex; justify-content: space-between; align-items: center;
          padding: 22px 28px; border-bottom: 1.5px solid #e8e4de; position: sticky; top: 0;
          background: #fff; z-index: 1;
        }
        .ao-modal-title { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }
        .ao-close {
          background: none; border: none; font-size: 1rem; cursor: pointer;
          color: #aaa; padding: 4px 8px; border-radius: 6px;
        }
        .ao-close:hover { background: #f0ede8; color: #1a1a1a; }
        .ao-modal-body { padding: 24px 28px; }

        .ao-section-title {
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.6px;
          color: #999; font-weight: 600; margin-bottom: 12px;
        }
        .ao-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px; }
        .ao-info-row {
          display: flex; justify-content: space-between; gap: 12px;
          padding: 9px 0; font-size: 0.88rem; border-bottom: 1px dashed #eee;
        }
        .ao-info-row span:first-child { color: #999; }
        .ao-info-row strong { color: #1a1a1a; font-weight: 600; text-align: right; }

        .ao-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        .ao-table th {
          text-align: left; font-size: 0.72rem; text-transform: uppercase;
          letter-spacing: 0.6px; color: #999; font-weight: 500;
          padding: 0 0 10px; border-bottom: 1.5px solid #e8e4de;
        }
        .ao-table th:not(:first-child), .ao-table td:not(:first-child) { text-align: right; }
        .ao-table td {
          padding: 11px 0; font-size: 0.85rem; color: #333;
          border-bottom: 1px solid #f1efe9;
        }
        .ao-table td:first-child { font-weight: 600; color: #1a1a1a; }

        .ao-totals { margin-bottom: 24px; }
        .ao-totals-row {
          display: flex; justify-content: space-between;
          font-size: 0.88rem; color: #666; padding: 6px 0;
        }
        .ao-totals-row.ao-grand {
          font-size: 1rem; font-weight: 700; color: #1a1a1a;
          margin-top: 6px; padding-top: 12px; border-top: 1.5px solid #e8e4de;
        }

        .ao-status-update { background: #faf9f7; border-radius: 12px; padding: 18px; }
        .ao-select {
          padding: 10px 14px; border: 1px solid #e0ddd8; border-radius: 10px;
          font-size: 0.88rem; background: #fff; outline: none; cursor: pointer;
        }
        .ao-select:focus { border-color: #1a1a1a; }
        .ao-btn {
          padding: 10px 22px; border-radius: 10px; font-size: 0.88rem;
          font-weight: 500; background: #1a1a1a; color: #fff; border: none;
          cursor: pointer; transition: background 0.15s;
        }
        .ao-btn:hover:not(:disabled) { background: #333; }
        .ao-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 600px) {
          .ao-wrap { padding: 16px; }
          .ao-info-grid { grid-template-columns: 1fr; }
          .ao-modal-body, .ao-modal-head { padding-left: 18px; padding-right: 18px; }
        }
      `}</style>

        <h1 className="ao-page-title">Orders</h1>
        <p className="ao-page-sub">Manage and update all customer orders</p>

        {/* Toolbar */}
        <div className="ao-toolbar">
          <input
            className="ao-search"
            placeholder="Search by name or order ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="ao-filter-tabs">
            {["all", ...STATUSES].map((s) => (
              <button
                key={s}
                className={`ao-tab${filterStatus === s ? " active" : ""}`}
                onClick={() => setFilterStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="ao-card">
          {loading ? (
            <div className="ao-spinner-wrap">
              <div className="ao-spinner" />
            </div>
          ) : error ? (
            <div className="ao-empty">Failed to load orders — {error}</div>
          ) : filtered.length === 0 ? (
            <div className="ao-empty">No orders found</div>
          ) : (
            <div className="ao-table-wrap">
              <table className="ao-main-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <span className="ao-order-num">#{order.id}</span>
                      </td>
                      <td>
                        <div className="ao-customer">{order.name}</div>
                        <div className="ao-customer-email">{order.email}</div>
                      </td>
                      <td>{fmt(order.created_at)}</td>
                      <td>
                        <Badge status={order.status} />
                      </td>
                      <td>
                        <Badge status={order.payment_status} />
                      </td>
                      <td>${Number(order.grand_total).toFixed(2)}</td>
                      <td>
                        <button
                          className="ao-detail-btn"
                          onClick={() => setSelectedId(order.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedId && (
          <OrderModal
            orderId={selectedId}
            onClose={() => setSelectedId(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
