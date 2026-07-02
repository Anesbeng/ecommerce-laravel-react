import React, { useContext, useState } from "react";
import { AdminAuthContext } from "../context/AdminAuth.jsx";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  {
    to: "/admin/Dashboard",
    label: "Dashboard",
    icon: (
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
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: "/admin/category",
    label: "Categories",
    icon: (
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
        <path d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    to: "/admin/brand",
    label: "Brands",
    icon: (
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
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    to: "/admin/product",
    label: "Products",
    icon: (
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
        <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        <path d="M16 3H8a1 1 0 0 0-1 1v3h10V4a1 1 0 0 0-1-1z" />
      </svg>
    ),
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: (
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
    ),
  },
  {
    to: "/admin/users",
    label: "Users",
    icon: (
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
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    to: "/admin/shipping",
    label: "Shipping",
    icon: (
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
        <rect x="1" y="3" width="15" height="13" />
        <path d="M16 8h4l3 3v5h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    to: "/admin/change-password",
    label: "Change Password",
    icon: (
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
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

// Export so AdminLayout can use it
export const HamburgerButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "8px",
      color: "#555",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    aria-label="Open menu"
  >
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
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </button>
);

const Sidebar = ({ open, onClose }) => {
  const { logout } = useContext(AdminAuthContext);
  const location = useLocation();

  return (
    <>
      <style>{`
        /* ── Desktop sidebar ── */
        .sb-wrap {
          width: 240px;
          min-height: 100vh;
          background: #111318;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
        }

        /* ── Mobile overlay ── */
        .sb-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 200;
        }
        .sb-overlay.open { display: block; }

        /* ── Mobile drawer ── */
        .sb-drawer {
          position: fixed; top: 0; left: -260px; bottom: 0;
          width: 240px; background: #111318;
          z-index: 201; transition: left 0.25s ease;
          display: flex; flex-direction: column;
          overflow-y: auto;
        }
        .sb-drawer.open { left: 0; }

        /* ── Brand ── */
        .sb-brand {
          padding: 24px 20px 20px;
          border-bottom: 1px solid #1e2028;
          display: flex; align-items: center; gap: 10px;
        }
        .sb-brand-icon {
          width: 32px; height: 32px; background: #4f6ef7;
          border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sb-brand-name { font-size: 0.95rem; font-weight: 700; color: #fff; }
        .sb-brand-role { font-size: 0.7rem; color: #555; text-transform: uppercase; letter-spacing: 0.8px; }

        .sb-close-btn {
          margin-left: auto; background: none; border: none; color: #555;
          cursor: pointer; padding: 4px; border-radius: 6px; font-size: 1.1rem;
          line-height: 1;
        }
        .sb-close-btn:hover { color: #fff; }

        /* ── Nav ── */
        .sb-nav {
          flex: 1; padding: 12px 10px;
          list-style: none; margin: 0;
          display: flex; flex-direction: column; gap: 2px;
        }
        .sb-section-label {
          font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px;
          color: #3a3d47; padding: 12px 10px 6px; font-weight: 600;
        }
        .sb-link {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px; font-size: 0.875rem;
          font-weight: 500; color: #8a8f9e; text-decoration: none;
          transition: background 0.15s, color 0.15s;
          cursor: pointer; border: none; background: none;
          width: 100%; text-align: left; font-family: inherit;
        }
        .sb-link:hover { background: #1a1d24; color: #d4d6de; }
        .sb-link.active { background: #1c2340; color: #7c9ef8; }
        .sb-link.active .sb-icon { color: #4f6ef7; }
        .sb-icon { flex-shrink: 0; color: #3a3d47; transition: color 0.15s; }
        .sb-link:hover .sb-icon { color: #8a8f9e; }

        /* ── Footer ── */
        .sb-footer { padding: 10px 10px 20px; border-top: 1px solid #1e2028; }
        .sb-logout {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 8px; font-size: 0.875rem;
          font-weight: 500; color: #8a8f9e; cursor: pointer; border: none;
          background: none; width: 100%; text-align: left;
          transition: background 0.15s, color 0.15s; font-family: inherit;
        }
        .sb-logout:hover { background: #2a1a1a; color: #e57373; }
        .sb-logout:hover .sb-icon { color: #e57373; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .sb-wrap { display: none; }
        }
        @media (min-width: 769px) {
          .sb-overlay, .sb-drawer { display: none !important; }
        }
      `}</style>

      {/* ── Desktop sidebar ── */}
      <div className="sb-wrap">
        <SidebarContent logout={logout} location={location} />
      </div>

      {/* ── Mobile: overlay + drawer ── */}
      <div className={`sb-overlay${open ? " open" : ""}`} onClick={onClose} />
      <div className={`sb-drawer${open ? " open" : ""}`}>
        <SidebarContent
          logout={logout}
          location={location}
          onClose={onClose}
          mobile
        />
      </div>
    </>
  );
};

const SidebarContent = ({ logout, location, onClose, mobile }) => (
  <>
    <div className="sb-brand">
      <div className="sb-brand-icon">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
      <div>
        <div className="sb-brand-name">Pure Wear</div>
        <div className="sb-brand-role">Admin Panel</div>
      </div>
      {mobile && (
        <button className="sb-close-btn" onClick={onClose}>
          ✕
        </button>
      )}
    </div>

    <ul className="sb-nav">
      <li className="sb-section-label">Main</li>
      {NAV_ITEMS.map((item) => {
        const active =
          location.pathname === item.to ||
          location.pathname.startsWith(item.to + "/");
        return (
          <li key={item.to}>
            <Link
              to={item.to}
              className={`sb-link${active ? " active" : ""}`}
              onClick={mobile ? onClose : undefined}
            >
              <span className="sb-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>

    <div className="sb-footer">
      <button className="sb-logout" onClick={logout}>
        <span className="sb-icon">
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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </span>
        Logout
      </button>
    </div>
  </>
);

export default Sidebar;
