import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../common/AdminLayout";
import { AdminToken, ApiUrl } from "../common/Https";
import { toast } from "react-toastify";

/* ─────────────────────────────────────────────
   Shared styles injected once
───────────────────────────────────────────── */
const TABLE_CSS = `
  .at-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
  .at-title { font-size: 1.4rem; font-weight: 700; color: #1a1a1a; }
  .at-create-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 20px; border-radius: 10px;
    background: #1a1a1a; color: #fff;
    font-size: 0.85rem; font-weight: 600;
    text-decoration: none; border: none; cursor: pointer;
    transition: background 0.15s;
  }
  .at-create-btn:hover { background: #333; color: #fff; }

  .at-card { background: #fff; border: 1px solid #e8e8ec; border-radius: 14px; overflow: hidden; }
  .at-table-wrap { overflow-x: auto; }

  table.at-table { width: 100%; border-collapse: collapse; }
  .at-table th {
    text-align: left; font-size: 0.72rem; text-transform: uppercase;
    letter-spacing: 0.6px; color: #aaa; font-weight: 600;
    padding: 14px 20px; border-bottom: 1.5px solid #f0f0f4;
    white-space: nowrap; background: #fafafa;
  }
  .at-table td {
    padding: 13px 20px; font-size: 0.88rem; color: #444;
    border-bottom: 1px solid #f4f4f6; vertical-align: middle;
  }
  .at-table tr:last-child td { border-bottom: none; }
  .at-table tr:hover td { background: #fafbff; }
  .at-table td:first-child { color: #bbb; font-size: 0.8rem; }

  .at-name { font-weight: 600; color: #1a1a1a; }

  .at-badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.2px;
  }
  .at-badge-on  { background: #dcfce7; color: #16a34a; }
  .at-badge-off { background: #fee2e2; color: #dc2626; }

  .at-actions { display: flex; align-items: center; gap: 8px; }
  .at-action-btn {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid #e8e8ec; background: #fff; cursor: pointer;
    transition: background 0.15s, border-color 0.15s; color: #666;
    text-decoration: none;
  }
  .at-action-btn:hover { background: #f4f5f7; color: #1a1a1a; }
  .at-action-btn.danger:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

  .at-thumb { width: 42px; height: 42px; object-fit: cover; border-radius: 8px; border: 1px solid #e8e8ec; }

  .at-spinner-wrap { display: flex; justify-content: center; padding: 50px; }
  .at-spinner {
    width: 30px; height: 30px;
    border: 3px solid #e8e8ec; border-top-color: #1a1a1a;
    border-radius: 50%; animation: at-spin 0.7s linear infinite;
  }
  @keyframes at-spin { to { transform: rotate(360deg); } }
  .at-empty { text-align: center; padding: 50px; color: #bbb; font-size: 0.9rem; }
`;

/* ─────────────────────────────────────────────
   Edit / Delete icons
───────────────────────────────────────────── */
const EditIcon = () => (
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
);
const TrashIcon = () => (
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
);
const PlusIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

/* ─────────────────────────────────────────────
   BRANDS
───────────────────────────────────────────── */
export const BrandsShow = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${ApiUrl}/brands`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken()}`,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.status === 200) setBrands(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this brand?")) return;
    const r = await fetch(`${ApiUrl}/brands/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken()}`,
      },
    }).then((r) => r.json());
    if (r.status === 200) {
      setBrands((b) => b.filter((x) => x.id !== id));
      toast.success(r.message);
    }
  };

  return (
    <AdminLayout>
      <style>{TABLE_CSS}</style>
      <div className="at-header">
        <h1 className="at-title">Brands</h1>
        <Link to="/admin/brand/create" className="at-create-btn">
          <PlusIcon /> Add Brand
        </Link>
      </div>
      <div className="at-card">
        {loading ? (
          <div className="at-spinner-wrap">
            <div className="at-spinner" />
          </div>
        ) : (
          <div className="at-table-wrap">
            <table className="at-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <div className="at-empty">No brands yet</div>
                    </td>
                  </tr>
                )}
                {brands.map((b) => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>
                      <span className="at-name">{b.name}</span>
                    </td>
                    <td>
                      <span
                        className={`at-badge ${b.status == 1 ? "at-badge-on" : "at-badge-off"}`}
                      >
                        {b.status == 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="at-actions">
                        <Link
                          to={`/admin/brand/edit/${b.id}`}
                          className="at-action-btn"
                        >
                          <EditIcon />
                        </Link>
                        <button
                          className="at-action-btn danger"
                          onClick={() => handleDelete(b.id)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

/* ─────────────────────────────────────────────
   CATEGORIES
───────────────────────────────────────────── */
export const CategoriesShow = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${ApiUrl}/categories`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken()}`,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.status === 200) setCategories(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    const r = await fetch(`${ApiUrl}/categories/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken()}`,
      },
    }).then((r) => r.json());
    if (r.status === 200) {
      setCategories((c) => c.filter((x) => x.id !== id));
      toast.success(r.message);
    }
  };

  return (
    <AdminLayout>
      <style>{TABLE_CSS}</style>
      <div className="at-header">
        <h1 className="at-title">Categories</h1>
        <Link to="/admin/category/create" className="at-create-btn">
          <PlusIcon /> Add Category
        </Link>
      </div>
      <div className="at-card">
        {loading ? (
          <div className="at-spinner-wrap">
            <div className="at-spinner" />
          </div>
        ) : (
          <div className="at-table-wrap">
            <table className="at-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <div className="at-empty">No categories yet</div>
                    </td>
                  </tr>
                )}
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>
                      <span className="at-name">{c.name}</span>
                    </td>
                    <td>
                      <span
                        className={`at-badge ${c.status == 1 ? "at-badge-on" : "at-badge-off"}`}
                      >
                        {c.status == 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="at-actions">
                        <Link
                          to={`/admin/category/edit/${c.id}`}
                          className="at-action-btn"
                        >
                          <EditIcon />
                        </Link>
                        <button
                          className="at-action-btn danger"
                          onClick={() => handleDelete(c.id)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

/* ─────────────────────────────────────────────
   PRODUCTS
───────────────────────────────────────────── */
export const ProductsShow = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${ApiUrl}/Products`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken()}`,
      },
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.status === 200) setProducts(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    const r = await fetch(`${ApiUrl}/Products/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken()}`,
      },
    }).then((r) => r.json());
    if (r.status === 200) {
      setProducts((p) => p.filter((x) => x.id !== id));
      toast.success(r.message);
    }
  };

  return (
    <AdminLayout>
      <style>{TABLE_CSS}</style>
      <div className="at-header">
        <h1 className="at-title">Products</h1>
        <Link to="/admin/product/create" className="at-create-btn">
          <PlusIcon /> Add Product
        </Link>
      </div>
      <div className="at-card">
        {loading ? (
          <div className="at-spinner-wrap">
            <div className="at-spinner" />
          </div>
        ) : (
          <div className="at-table-wrap">
            <table className="at-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>SKU</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      <div className="at-empty">No products yet</div>
                    </td>
                  </tr>
                )}
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="at-thumb"
                      />
                    </td>
                    <td>
                      <span className="at-name">{p.title}</span>
                    </td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>{p.total_qty}</td>
                    <td style={{ color: "#aaa", fontSize: "0.8rem" }}>
                      {p.sku}
                    </td>
                    <td>
                      <span
                        className={`at-badge ${p.status == 1 ? "at-badge-on" : "at-badge-off"}`}
                      >
                        {p.status == 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="at-actions">
                        <Link
                          to={`/admin/product/edit/${p.id}`}
                          className="at-action-btn"
                        >
                          <EditIcon />
                        </Link>
                        <button
                          className="at-action-btn danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
