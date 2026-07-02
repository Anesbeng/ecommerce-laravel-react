import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../common/AdminLayout";
import { ApiUrl, AdminToken } from "../common/Https";

const authH = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${AdminToken()}`,
});

const STAT_CONFIG = [
  {
    label: "Total Users",
    to: "/admin/users",
    key: "users",
    color: "#4f6ef7",
    bg: "#eef1fe",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Total Orders",
    to: "/admin/orders",
    key: "orders",
    color: "#16a34a",
    bg: "#dcfce7",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 17H5a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2h-4" />
        <path d="M12 3v14" />
        <path d="m8 11 4-4 4 4" />
      </svg>
    ),
  },
  {
    label: "Total Products",
    to: "/admin/product",
    key: "products",
    color: "#d97706",
    bg: "#fef3c7",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 3H8a1 1 0 0 0-1 1v3h10V4a1 1 0 0 0-1-1z" />
      </svg>
    ),
  },
  {
    label: "Categories",
    to: "/admin/category",
    key: "categories",
    color: "#7c3aed",
    bg: "#ede9fe",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
];

const Dashboard = () => {
  const [counts, setCounts] = useState({
    users: "—",
    orders: "—",
    products: "—",
    categories: "—",
  });

  useEffect(() => {
    // Fetch all 4 counts in parallel
    Promise.all([
      fetch(`${ApiUrl}/admin/users`, { headers: authH() })
        .then((r) => r.json())
        .then((d) => ({ users: (d.data ?? []).length }))
        .catch(() => ({ users: "?" })),
      fetch(`${ApiUrl}/admin/orders`, { headers: authH() })
        .then((r) => r.json())
        .then((d) => ({
          orders: (Array.isArray(d) ? d : (d.data ?? [])).length,
        }))
        .catch(() => ({ orders: "?" })),
      fetch(`${ApiUrl}/Products`, { headers: authH() })
        .then((r) => r.json())
        .then((d) => ({ products: (d.data ?? []).length }))
        .catch(() => ({ products: "?" })),
      fetch(`${ApiUrl}/categories`, { headers: authH() })
        .then((r) => r.json())
        .then((d) => ({ categories: (d.data ?? []).length }))
        .catch(() => ({ categories: "?" })),
    ]).then((results) => {
      setCounts(Object.assign({}, ...results));
    });
  }, []);

  return (
    <AdminLayout>
      <style>{`
        .dash-title { font-size: 1.4rem; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
        .dash-sub { font-size: 0.85rem; color: #999; margin-bottom: 28px; }

        .dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
        .dash-card {
          background: #fff; border: 1px solid #e8e8ec; border-radius: 14px;
          padding: 22px; display: flex; flex-direction: column; gap: 14px;
          transition: box-shadow 0.15s;
        }
        .dash-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.07); }
        .dash-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .dash-card-icon {
          width: 44px; height: 44px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .dash-card-value { font-size: 2rem; font-weight: 700; color: #1a1a1a; line-height: 1; }
        .dash-card-label { font-size: 0.82rem; color: #888; font-weight: 500; }
        .dash-card-footer { display: flex; justify-content: flex-end; padding-top: 10px; border-top: 1px solid #f0f0f4; }
        .dash-view-link { font-size: 0.78rem; font-weight: 600; text-decoration: none; }
        .dash-view-link:hover { opacity: 0.75; }

        .dash-section-title {
          font-size: 0.75rem; text-transform: uppercase;
          letter-spacing: 0.8px; color: #aaa; font-weight: 600; margin-bottom: 14px;
        }
        .dash-quick { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .dash-quick-card {
          background: #fff; border: 1px solid #e8e8ec; border-radius: 12px;
          padding: 18px 20px; text-decoration: none;
          display: flex; align-items: center; gap: 14px; color: #1a1a1a;
          transition: background 0.15s, box-shadow 0.15s;
        }
        .dash-quick-card:hover { background: #fafafa; box-shadow: 0 2px 12px rgba(0,0,0,0.06); color: #1a1a1a; }
        .dash-quick-icon { width: 38px; height: 38px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .dash-quick-label { font-size: 0.88rem; font-weight: 600; }
        .dash-quick-sub { font-size: 0.75rem; color: #aaa; }

        @media (max-width: 900px) { .dash-stats { grid-template-columns: repeat(2, 1fr); } .dash-quick { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .dash-stats { grid-template-columns: 1fr; } .dash-quick { grid-template-columns: 1fr; } }
      `}</style>

      <h1 className="dash-title">Dashboard</h1>
      <p className="dash-sub">Welcome back — here's what's happening today</p>

      <div className="dash-stats">
        {STAT_CONFIG.map((s) => (
          <div className="dash-card" key={s.key}>
            <div className="dash-card-top">
              <div>
                <div className="dash-card-value">{counts[s.key]}</div>
                <div className="dash-card-label">{s.label}</div>
              </div>
              <div
                className="dash-card-icon"
                style={{ background: s.bg, color: s.color }}
              >
                {s.icon}
              </div>
            </div>
            <div className="dash-card-footer">
              <Link
                to={s.to}
                className="dash-view-link"
                style={{ color: s.color }}
              >
                View all →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-section-title">Quick Actions</div>
      <div className="dash-quick">
        <Link to="/admin/product/create" className="dash-quick-card">
          <div
            className="dash-quick-icon"
            style={{ background: "#fef3c7", color: "#d97706" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div>
            <div className="dash-quick-label">Add Product</div>
            <div className="dash-quick-sub">Create a new listing</div>
          </div>
        </Link>
        <Link to="/admin/category/create" className="dash-quick-card">
          <div
            className="dash-quick-icon"
            style={{ background: "#ede9fe", color: "#7c3aed" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <div>
            <div className="dash-quick-label">Add Category</div>
            <div className="dash-quick-sub">Organise your catalogue</div>
          </div>
        </Link>
        <Link to="/admin/orders" className="dash-quick-card">
          <div
            className="dash-quick-icon"
            style={{ background: "#dcfce7", color: "#16a34a" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 17H5a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2h-4" />
              <path d="M12 3v14" />
              <path d="m8 11 4-4 4 4" />
            </svg>
          </div>
          <div>
            <div className="dash-quick-label">View Orders</div>
            <div className="dash-quick-sub">Manage recent orders</div>
          </div>
        </Link>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
