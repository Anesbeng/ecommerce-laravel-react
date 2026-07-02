import { useContext } from "react";
import { UserAuthContext } from "../context/UserAuth.jsx";
import { Link, useLocation } from "react-router-dom";

const NAV = [
  {
    to: "/user/dashboard",
    label: "Profile",
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    to: "/account/orders",
    label: "My Orders",
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    to: "/account/change-password",
    label: "Change Password",
    icon: (
      <svg
        width="17"
        height="17"
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

const UserSidebar = () => {
  const { logout } = useContext(UserAuthContext);
  const location = useLocation();

  return (
    <>
      <style>{`
        .us-wrap {
          width: 220px;
          flex-shrink: 0;
        }
        .us-card {
          background: #fff;
          border: 1px solid #eeebe5;
          border-radius: 16px;
          overflow: hidden;
          position: sticky;
          top: 24px;
        }
        .us-nav {
          list-style: none;
          margin: 0;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .us-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #666;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
        }
        .us-link:hover { background: #faf9f7; color: #1a1a1a; }
        .us-link.active { background: #f4f0eb; color: #1a1a1a; font-weight: 600; }
        .us-link.active .us-icon { color: #b07d3a; }
        .us-icon { color: #ccc; transition: color 0.15s; flex-shrink: 0; }
        .us-link:hover .us-icon { color: #888; }

        .us-divider { height: 1px; background: #f0ede8; margin: 6px 10px; }

        .us-logout { color: #999; }
        .us-logout:hover { background: #fff5f5; color: #dc2626; }
        .us-logout:hover .us-icon { color: #dc2626; }

        @media (max-width: 640px) {
          .us-wrap { width: 100%; }
          .us-card { position: static; }
          .us-nav { flex-direction: row; flex-wrap: wrap; padding: 8px; }
          .us-link { flex: 1; min-width: 120px; justify-content: center; }
        }
      `}</style>

      <div className="us-wrap">
        <div className="us-card">
          <ul className="us-nav">
            {NAV.map((item) => {
              const active = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`us-link${active ? " active" : ""}`}
                  >
                    <span className="us-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <div className="us-divider" />
            </li>
            <li>
              <button className="us-link us-logout" onClick={logout}>
                <span className="us-icon">
                  <svg
                    width="17"
                    height="17"
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
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default UserSidebar;
