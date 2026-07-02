import React, { useState } from "react";
import AdminLayout from "../common/AdminLayout";
import { ApiUrl, AdminToken } from "../common/Https";
import { toast } from "react-toastify";

// Route: <Route path="/admin/change-password" element={<AdminChangePassword />} />

const EyeIcon = ({ open }) =>
  open ? (
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
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
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const PasswordField = ({ label, name, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="acp-field">
      <label className="acp-label">{label}</label>
      <div className="acp-input-wrap">
        <input
          className="acp-input"
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          className="acp-eye"
          onClick={() => setShow((s) => !s)}
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
};

const AdminChangePassword = () => {
  const [form, setForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      toast.error("New passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${ApiUrl}/admin/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${AdminToken()}`,
        },
        body: JSON.stringify(form),
      }).then((r) => r.json());

      if (res.status === 200) {
        toast.success("Password changed successfully!");
        setForm({
          current_password: "",
          password: "",
          password_confirmation: "",
        });
      } else {
        toast.error(res.message ?? "Failed to change password");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const strength = (() => {
    const l = form.password.length;
    if (l === 0) return null;
    if (l < 6) return { w: "25%", color: "#ef4444", label: "Too short" };
    if (l < 10) return { w: "50%", color: "#f97316", label: "Weak" };
    if (l < 14) return { w: "75%", color: "#eab308", label: "Good" };
    return { w: "100%", color: "#22c55e", label: "Strong" };
  })();

  return (
    <AdminLayout>
      <style>{`
        .acp-title { font-size: 1.4rem; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
        .acp-sub   { font-size: 0.85rem; color: #999; margin-bottom: 28px; }

        .acp-card {
          background: #fff; border: 1px solid #e8e8ec;
          border-radius: 14px; padding: 32px; max-width: 460px;
        }

        .acp-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
        .acp-label {
          font-size: 0.75rem; font-weight: 600; color: #888;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .acp-input-wrap { position: relative; }
        .acp-input {
          width: 100%; padding: 11px 42px 11px 14px;
          border: 1px solid #e8e8ec; border-radius: 10px;
          font-size: 0.9rem; color: #1a1a1a; background: #fff;
          outline: none; transition: border-color 0.15s;
          font-family: inherit; box-sizing: border-box;
        }
        .acp-input:focus { border-color: #1a1a1a; }
        .acp-eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #bbb; padding: 0; display: flex; align-items: center;
        }
        .acp-eye:hover { color: #888; }

        .acp-divider { height: 1px; background: #f0f0f4; margin: 4px 0 24px; }

        .acp-strength-bar {
          height: 4px; border-radius: 2px; background: #f0f0f4; margin: 6px 0 4px;
        }
        .acp-strength-fill { height: 100%; border-radius: 2px; transition: width 0.3s, background 0.3s; }
        .acp-strength-label { font-size: 0.75rem; }
        .acp-match { font-size: 0.78rem; margin-top: -12px; margin-bottom: 16px; }

        .acp-save-btn {
          width: 100%; padding: 12px; border-radius: 10px;
          font-size: 0.9rem; font-weight: 600;
          background: #1a1a1a; color: #fff; border: none;
          cursor: pointer; transition: background 0.15s;
          font-family: inherit; margin-top: 8px;
        }
        .acp-save-btn:hover:not(:disabled) { background: #333; }
        .acp-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <h1 className="acp-title">Change Password</h1>
      <p className="acp-sub">Update your admin account password</p>

      <div className="acp-card">
        <form onSubmit={handleSubmit}>
          <PasswordField
            label="Current Password"
            name="current_password"
            value={form.current_password}
            onChange={handleChange}
            placeholder="Enter current password"
          />

          <div className="acp-divider" />

          <PasswordField
            label="New Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
          />

          {strength && (
            <div style={{ marginTop: -12, marginBottom: 20 }}>
              <div className="acp-strength-bar">
                <div
                  className="acp-strength-fill"
                  style={{ width: strength.w, background: strength.color }}
                />
              </div>
              <span
                className="acp-strength-label"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            </div>
          )}

          <PasswordField
            label="Confirm New Password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            placeholder="Repeat new password"
          />

          {form.password_confirmation.length > 0 && (
            <p
              className="acp-match"
              style={{
                color:
                  form.password === form.password_confirmation
                    ? "#22c55e"
                    : "#ef4444",
              }}
            >
              {form.password === form.password_confirmation
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </p>
          )}

          <button className="acp-save-btn" type="submit" disabled={saving}>
            {saving ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminChangePassword;
