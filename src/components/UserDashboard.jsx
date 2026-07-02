import React from "react";
import Layout from "./common/Layout";
import UserSidebar from "./common/UserSidebar";
import Profile from "./Profile.jsx";

// This is the /user/dashboard route — shows the Profile page by default
const UserDashboard = () => {
  return (
    <Layout>
      <style>{`
        .ud-wrap {
          max-width: 980px;
          margin: 0 auto;
          padding: 48px 20px;
          display: flex;
          gap: 28px;
          align-items: flex-start;
          font-family: 'DM Sans', sans-serif;
        }
        .ud-content { flex: 1; min-width: 0; }

        @media (max-width: 640px) {
          .ud-wrap { flex-direction: column; padding: 24px 16px; }
        }
      `}</style>

      <div className="ud-wrap">
        <UserSidebar />
        <div className="ud-content">
          <Profile />
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
