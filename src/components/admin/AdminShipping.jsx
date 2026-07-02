import React, { useEffect, useState } from "react";
import AdminLayout from "../common/AdminLayout";
import { ApiUrl, AdminToken } from "../common/Https";
import { toast } from "react-toastify";

// Route: <Route path="/admin/shipping" element={<AdminShipping />} />

function authHeaders() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${AdminToken()}`,
  };
}

const AdminShipping = () => {
  const [rate, setRate]       = useState("");
  const [isFree, setIsFree]   = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    fetch(`${ApiUrl}/admin/shipping`, { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { setRate(d.rate ?? "0"); setIsFree(!!d.is_free); })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${ApiUrl}/admin/shipping`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ rate: parseFloat(rate) || 0, is_free: isFree }),
      }).then(r => r.json());
      if (res.status === 200) toast.success("Shipping settings saved!");
      else toast.error(res.message ?? "Failed to save");
    } catch { toast.error("Network error"); }
    finally { setSaving(false); }
  };

  return (
    <AdminLayout>
      <style>{`
        .sh-title { font-size: 1.4rem; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
        .sh-sub   { font-size: 0.85rem; color: #999; margin-bottom: 28px; }

        .sh-card {
          background: #fff; border: 1px solid #e8e8ec;
          border-radius: 14px; padding: 32px; max-width: 480px;
        }

        /* ── Toggle ── */
        .sh-toggle-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 0; border-bottom: 1px solid #f0f0f4; margin-bottom: 24px;
        }
        .sh-toggle-info {}
        .sh-toggle-label { font-size: 0.95rem; font-weight: 600; color: #1a1a1a; }
        .sh-toggle-hint  { font-size: 0.78rem; color: #aaa; margin-top: 2px; }

        .sh-switch { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
        .sh-switch input { opacity: 0; width: 0; height: 0; }
        .sh-slider {
          position: absolute; inset: 0; background: #e8e8ec;
          border-radius: 24px; cursor: pointer; transition: background 0.2s;
        }
        .sh-slider::before {
          content: ""; position: absolute;
          width: 18px; height: 18px; border-radius: 50%;
          background: #fff; left: 3px; top: 3px;
          transition: transform 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .sh-switch input:checked + .sh-slider { background: #22c55e; }
        .sh-switch input:checked + .sh-slider::before { transform: translateX(20px); }

        /* ── Rate field ── */
        .sh-rate-section {}
        .sh-rate-label {
          font-size: 0.78rem; font-weight: 600; color: #888;
          text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;
        }
        .sh-rate-input-wrap { position: relative; max-width: 200px; }
        .sh-rate-symbol {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          font-size: 0.9rem; color: #888; font-weight: 600;
        }
        .sh-rate-input {
          width: 100%; padding: 11px 14px 11px 30px;
          border: 1px solid #e8e8ec; border-radius: 10px;
          font-size: 1rem; font-weight: 600; color: #1a1a1a;
          outline: none; font-family: inherit;
          transition: border-color 0.15s; box-sizing: border-box;
        }
        .sh-rate-input:focus { border-color: #1a1a1a; }
        .sh-rate-input:disabled { background: #f4f5f7; color: #bbb; cursor: not-allowed; }
        .sh-rate-hint { font-size: 0.78rem; color: #aaa; margin-top: 8px; }

        /* ── Preview box ── */
        .sh-preview {
          background: #f4f5f7; border-radius: 12px; padding: 16px 20px;
          margin-top: 24px; display: flex; justify-content: space-between;
          align-items: center;
        }
        .sh-preview-label { font-size: 0.82rem; color: #888; }
        .sh-preview-value { font-size: 1rem; font-weight: 700; color: #1a1a1a; }
        .sh-preview-free  { font-size: 1rem; font-weight: 700; color: #22c55e; }

        .sh-footer { margin-top: 28px; }
        .sh-save-btn {
          padding: 11px 28px; border-radius: 10px; font-size: 0.88rem;
          font-weight: 600; background: #1a1a1a; color: #fff; border: none;
          cursor: pointer; transition: background 0.15s; font-family: inherit;
        }
        .sh-save-btn:hover:not(:disabled) { background: #333; }
        .sh-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .sh-spinner-wrap { display: flex; justify-content: center; padding: 60px; }
        .sh-spinner {
          width: 30px; height: 30px; border: 3px solid #e8e8ec;
          border-top-color: #1a1a1a; border-radius: 50%;
          animation: sh-spin 0.7s linear infinite;
        }
        @keyframes sh-spin { to { transform: rotate(360deg); } }
      `}</style>

      <h1 className="sh-title">Shipping</h1>
      <p className="sh-sub">Configure your store's shipping rate</p>

      {loading ? (
        <div className="sh-spinner-wrap"><div className="sh-spinner" /></div>
      ) : (
        <div className="sh-card">
          {/* Free shipping toggle */}
          <div className="sh-toggle-row">
            <div className="sh-toggle-info">
              <div className="sh-toggle-label">Free Shipping</div>
              <div className="sh-toggle-hint">Enable to offer free shipping on all orders</div>
            </div>
            <label className="sh-switch">
              <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} />
              <span className="sh-slider" />
            </label>
          </div>

          {/* Flat rate field */}
          <div className="sh-rate-section">
            <div className="sh-rate-label">Flat Rate</div>
            <div className="sh-rate-input-wrap">
              <span className="sh-rate-symbol">$</span>
              <input
                className="sh-rate-input"
                type="number"
                min="0"
                step="0.01"
                value={rate}
                onChange={e => setRate(e.target.value)}
                disabled={isFree}
                placeholder="0.00"
              />
            </div>
            <p className="sh-rate-hint">
              {isFree
                ? "Free shipping is active — rate is ignored"
                : "This amount will be added to every order at checkout"}
            </p>
          </div>

          {/* Live preview */}
          <div className="sh-preview">
            <span className="sh-preview-label">Customer sees at checkout</span>
            {isFree
              ? <span className="sh-preview-free">Free</span>
              : <span className="sh-preview-value">${parseFloat(rate || 0).toFixed(2)}</span>
            }
          </div>

          <div className="sh-footer">
            <button className="sh-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminShipping;
