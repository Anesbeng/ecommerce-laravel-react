import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import { ApiUrl, AdminToken } from "../common/Https";
import { toast } from "react-toastify";

// Route: <Route path="/admin/users" element={<AdminUsers />} />

function authHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${AdminToken()}`,
  };
}

const ROLE_STYLE = {
  admin: { bg: "#ede9fe", color: "#7c3aed" },
  user: { bg: "#f0f0f4", color: "#555" },
};

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    password: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { name: form.name, email: form.email, role: form.role };
      if (form.password) body.password = form.password;

      const res = await fetch(`${ApiUrl}/admin/users/${user.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(body),
      }).then((r) => r.json());

      if (res.status === 200) {
        toast.success("User updated");
        onSaved({ ...user, ...body });
        onClose();
      } else {
        toast.error(res.message ?? "Failed to update");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="um-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="um-modal">
        <div className="um-modal-head">
          <span className="um-modal-title">Edit User #{user.id}</span>
          <button className="um-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="um-modal-body">
          <div className="um-field">
            <label className="um-label">Full Name</label>
            <input
              className="um-input"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="um-field">
            <label className="um-label">Email</label>
            <input
              className="um-input"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="um-field">
            <label className="um-label">Role</label>
            <select
              className="um-input"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="um-field">
            <label className="um-label">
              New Password{" "}
              <span style={{ color: "#bbb", fontWeight: 400 }}>
                (leave blank to keep current)
              </span>
            </label>
            <input
              className="um-input"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          <div className="um-modal-footer">
            <button className="um-btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button className="um-btn" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${ApiUrl}/admin/users`, { headers: authHeaders() })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => setUsers(d.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    const res = await fetch(`${ApiUrl}/admin/users/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then((r) => r.json());
    if (res.status === 200) {
      setUsers((u) => u.filter((x) => x.id !== id));
      toast.success("User deleted");
    } else {
      toast.error(res.message ?? "Failed to delete");
    }
  };

  const handleSaved = (updated) => {
    setUsers((u) => u.map((x) => (x.id === updated.id ? updated : x)));
  };

  const filtered = users.filter(
    (u) =>
      search === "" ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <style>{`
        .um-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .um-title  { font-size: 1.4rem; font-weight: 700; color: #1a1a1a; }
        .um-search {
          padding: 10px 16px; border: 1px solid #e8e8ec; border-radius: 10px;
          font-size: 0.88rem; background: #fff; outline: none; width: 260px;
        }
        .um-search:focus { border-color: #1a1a1a; }

        .um-card { background: #fff; border: 1px solid #e8e8ec; border-radius: 14px; overflow: hidden; }
        .um-table-wrap { overflow-x: auto; }
        table.um-table { width: 100%; border-collapse: collapse; }
        .um-table th {
          text-align: left; font-size: 0.72rem; text-transform: uppercase;
          letter-spacing: 0.6px; color: #aaa; font-weight: 600;
          padding: 14px 20px; border-bottom: 1.5px solid #f0f0f4;
          white-space: nowrap; background: #fafafa;
        }
        .um-table td {
          padding: 14px 20px; font-size: 0.88rem; color: #444;
          border-bottom: 1px solid #f4f4f6; vertical-align: middle;
        }
        .um-table tr:last-child td { border-bottom: none; }
        .um-table tr:hover td { background: #fafbff; }

        .um-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: #1a1a1a; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.78rem; font-weight: 700; flex-shrink: 0;
        }
        .um-user-cell { display: flex; align-items: center; gap: 12px; }
        .um-user-name  { font-weight: 600; color: #1a1a1a; font-size: 0.88rem; }
        .um-user-email { font-size: 0.78rem; color: #aaa; }

        .um-badge {
          display: inline-block; padding: 3px 10px; border-radius: 20px;
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.2px;
          text-transform: capitalize;
        }

        .um-actions { display: flex; align-items: center; gap: 8px; }
        .um-action-btn {
          width: 32px; height: 32px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #e8e8ec; background: #fff; cursor: pointer;
          transition: background 0.15s; color: #666; text-decoration: none;
        }
        .um-action-btn:hover { background: #f4f5f7; color: #1a1a1a; }
        .um-action-btn.danger:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

        .um-empty { text-align: center; padding: 50px; color: #bbb; font-size: 0.9rem; }
        .um-spinner-wrap { display: flex; justify-content: center; padding: 50px; }
        .um-spinner {
          width: 30px; height: 30px; border: 3px solid #e8e8ec;
          border-top-color: #1a1a1a; border-radius: 50%;
          animation: um-spin 0.7s linear infinite;
        }
        @keyframes um-spin { to { transform: rotate(360deg); } }

        /* Modal */
        .um-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 16px;
        }
        .um-modal {
          background: #fff; border-radius: 16px;
          width: 100%; max-width: 480px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.18);
        }
        .um-modal-head {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 24px; border-bottom: 1px solid #f0f0f4;
        }
        .um-modal-title { font-size: 1rem; font-weight: 700; color: #1a1a1a; }
        .um-close {
          background: none; border: none; font-size: 1rem; cursor: pointer;
          color: #aaa; padding: 4px 8px; border-radius: 6px;
        }
        .um-close:hover { background: #f4f5f7; color: #1a1a1a; }
        .um-modal-body { padding: 20px 24px; }

        .um-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
        .um-label {
          font-size: 0.75rem; font-weight: 600; color: #888;
          text-transform: uppercase; letter-spacing: 0.5px;
        }
        .um-input {
          padding: 10px 14px; border: 1px solid #e8e8ec; border-radius: 10px;
          font-size: 0.88rem; color: #1a1a1a; outline: none;
          font-family: inherit; transition: border-color 0.15s;
        }
        .um-input:focus { border-color: #1a1a1a; }

        .um-modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
        .um-btn {
          padding: 10px 22px; border-radius: 10px; font-size: 0.88rem;
          font-weight: 600; background: #1a1a1a; color: #fff; border: none;
          cursor: pointer; transition: background 0.15s; font-family: inherit;
        }
        .um-btn:hover:not(:disabled) { background: #333; }
        .um-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .um-btn-outline {
          padding: 10px 22px; border-radius: 10px; font-size: 0.88rem;
          font-weight: 600; background: #fff; color: #1a1a1a;
          border: 1px solid #e8e8ec; cursor: pointer; font-family: inherit;
          transition: background 0.15s;
        }
        .um-btn-outline:hover { background: #f4f5f7; }
      `}</style>

      <div className="um-header">
        <h1 className="um-title">Users</h1>
        <input
          className="um-search"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="um-card">
        {loading ? (
          <div className="um-spinner-wrap">
            <div className="um-spinner" />
          </div>
        ) : error ? (
          <div className="um-empty">Failed to load users — {error}</div>
        ) : filtered.length === 0 ? (
          <div className="um-empty">No users found</div>
        ) : (
          <div className="um-table-wrap">
            <table className="um-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const initials = (u.name || "U")
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);
                  const { bg, color } = ROLE_STYLE[u.role] ?? ROLE_STYLE.user;
                  return (
                    <tr key={u.id}>
                      <td style={{ color: "#bbb", fontSize: "0.8rem" }}>
                        {u.id}
                      </td>
                      <td>
                        <div className="um-user-cell">
                          <div className="um-avatar">{initials}</div>
                          <div>
                            <div className="um-user-name">{u.name}</div>
                            <div className="um-user-email">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="um-badge"
                          style={{ background: bg, color }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ color: "#aaa", fontSize: "0.82rem" }}>
                        {fmt(u.created_at)}
                      </td>
                      <td>
                        <div className="um-actions">
                          <button
                            className="um-action-btn"
                            onClick={() => setEditUser(u)}
                            title="Edit"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className="um-action-btn danger"
                            onClick={() => handleDelete(u.id)}
                            title="Delete"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editUser && (
        <EditModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSaved={handleSaved}
        />
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
