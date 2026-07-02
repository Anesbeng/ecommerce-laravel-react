import React, { useState, useContext } from "react";
import { UserAuthContext } from "./context/UserAuth.jsx";
import { ApiUrl, UserToken } from "./common/Https";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, login } = useContext(UserAuthContext);

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${ApiUrl}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${UserToken()}`,
        },
        body: JSON.stringify({ name: form.name }),
      }).then((r) => r.json());

      if (res.status === 200) {
        const updated = { ...user, name: res.name };
        localStorage.setItem("userinfo", JSON.stringify(updated));
        login(updated);
        toast.success("Profile updated!");
      } else {
        toast.error(res.message ?? "Failed to update");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const initials = (form.name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <style>{`
        .pf-title { font-size: 1.3rem; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
        .pf-sub   { font-size: 0.85rem; color: #999; margin-bottom: 28px; }

        .pf-card {
          background: #fff; border: 1px solid #eeebe5;
          border-radius: 16px; padding: 32px;
        }

        .pf-avatar-row {
          display: flex; align-items: center; gap: 20px;
          margin-bottom: 32px; padding-bottom: 28px;
          border-bottom: 1px solid #f0ede8;
        }
        .pf-avatar-placeholder {
          width: 72px; height: 72px; border-radius: 50%;
          background: #1a1a1a; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; font-weight: 700; flex-shrink: 0;
        }
        .pf-avatar-name  { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 3px; }
        .pf-avatar-email { font-size: 0.82rem; color: #aaa; }

        .pf-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
        .pf-label {
          font-size: 0.78rem; font-weight: 600; color: #888;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .pf-input {
          padding: 11px 14px; border: 1px solid #e8e4de;
          border-radius: 10px; font-size: 0.9rem; color: #1a1a1a;
          background: #fff; outline: none; transition: border-color 0.15s;
          font-family: inherit;
        }
        .pf-input:focus  { border-color: #1a1a1a; }
        .pf-input:disabled { background: #faf9f7; color: #bbb; cursor: not-allowed; }

        .pf-hint { font-size: 0.75rem; color: #ccc; margin-top: 4px; }

        .pf-footer { display: flex; justify-content: flex-end; margin-top: 8px; }
        .pf-save-btn {
          padding: 11px 28px; border-radius: 10px; font-size: 0.88rem;
          font-weight: 600; background: #1a1a1a; color: #fff; border: none;
          cursor: pointer; transition: background 0.15s; font-family: inherit;
        }
        .pf-save-btn:hover:not(:disabled) { background: #333; }
        .pf-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 560px) {
          .pf-card { padding: 20px; }
        }
      `}</style>

      <h1 className="pf-title">My Profile</h1>
      <p className="pf-sub">Manage your personal information</p>

      <div className="pf-card">
        {/* Avatar */}
        <div className="pf-avatar-row">
          <div className="pf-avatar-placeholder">{initials}</div>
          <div>
            <div className="pf-avatar-name">{form.name || "Your Name"}</div>
            <div className="pf-avatar-email">{form.email}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="pf-field">
            <label className="pf-label">Full Name</label>
            <input
              className="pf-input"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="pf-field">
            <label className="pf-label">Email Address</label>
            <input
              className="pf-input"
              name="email"
              type="email"
              value={form.email}
              disabled
            />
            <span className="pf-hint">Email cannot be changed</span>
          </div>

          <div className="pf-footer">
            <button className="pf-save-btn" type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
