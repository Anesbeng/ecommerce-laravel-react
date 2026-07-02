import React, { useState } from "react";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <style>{`
        .al-root {
          display: flex;
          min-height: 100vh;
          background: #0e1013;
          font-family: 'DM Sans', 'Inter', sans-serif;
        }
        .al-main {
          flex: 1;
          background: #f4f5f7;
          min-height: 100vh;
          overflow-y: auto;
          min-width: 0;
        }

        /* ── Topbar ── */
        .al-topbar {
          height: 56px;
          background: #fff;
          border-bottom: 1px solid #e8e8ec;
          display: flex;
          align-items: center;
          padding: 0 20px;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .al-topbar-left { display: flex; align-items: center; gap: 12px; }
        .al-topbar-right { display: flex; align-items: center; gap: 10px; }
        .al-topbar-dot { width: 8px; height: 8px; background: #4f6ef7; border-radius: 50%; }
        .al-topbar-admin { font-size: 0.82rem; font-weight: 600; color: #555; }

        /* hamburger — hidden on desktop */
        .al-hamburger {
          display: none;
          background: none; border: none; cursor: pointer;
          padding: 8px; border-radius: 8px; color: #555;
          align-items: center; justify-content: center;
        }
        .al-hamburger:hover { background: #f4f5f7; }

        .al-content { padding: 28px; }

        @media (max-width: 768px) {
          .al-hamburger { display: flex; }
          .al-content { padding: 16px; }
          .al-topbar { padding: 0 16px; }
        }
      `}</style>

      <div className="al-root">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="al-main">
          <div className="al-topbar">
            <div className="al-topbar-left">
              {/* Hamburger — only shows on mobile */}
              <button
                className="al-hamburger"
                onClick={() => setSidebarOpen(true)}
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
            </div>
            <div className="al-topbar-right">
              <div className="al-topbar-dot" />
              <span className="al-topbar-admin">Admin</span>
            </div>
          </div>

          <div className="al-content">{children}</div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
