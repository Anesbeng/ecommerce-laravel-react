import { useEffect, useState, useMemo } from "react";
import Layout from "./common/Layout";
import { Link, useLocation } from "react-router-dom";
import { ApiUrl } from "./common/Https";

const Shop = () => {
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const urlCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("Category") ? [params.get("Category")] : null;
  }, []);

  const [selectedCategories, setSelectedCategories] = useState(
    () =>
      urlCategory ??
      JSON.parse(localStorage.getItem("selectedCategories")) ??
      [],
  );
  const [selectedBrands, setSelectedBrands] = useState(
    () => JSON.parse(localStorage.getItem("selectedBrands")) || [],
  );

  const fetchCategories = () =>
    fetch(`${ApiUrl}/categories-products`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.status === 200) setCategories(res.data);
      });

  const fetchBrands = () =>
    fetch(`${ApiUrl}/brands-products`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.status === 200) setBrands(res.data);
      });

  const fetchProducts = (cats, brnds) => {
    const params = new URLSearchParams();
    if (cats.length > 0) params.append("category", cats.join(","));
    if (brnds.length > 0) params.append("brands", brnds.join(","));
    fetch(`${ApiUrl}/get-products?${params}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.status === 200) setProducts(res.data);
      });
  };

  const handleCategory = (e) => {
    const { checked, value } = e.target;
    setSelectedCategories((prev) => {
      const updated = checked
        ? [...prev, value]
        : prev.filter((id) => id !== value);
      localStorage.setItem("selectedCategories", JSON.stringify(updated));
      return updated;
    });
  };

  const handleBrand = (e) => {
    const { checked, value } = e.target;
    setSelectedBrands((prev) => {
      const updated = checked
        ? [...prev, value]
        : prev.filter((id) => id !== value);
      localStorage.setItem("selectedBrands", JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    localStorage.removeItem("selectedCategories");
    localStorage.removeItem("selectedBrands");
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);
  useEffect(() => {
    fetchProducts(selectedCategories, selectedBrands);
  }, [selectedCategories, selectedBrands]);

  const activeFiltersCount = selectedCategories.length + selectedBrands.length;

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');

        .shop-page {
          background: #faf9f7;
          min-height: 100vh;
          padding: 48px 0 96px;
          font-family: 'Jost', sans-serif;
        }

        .shop-breadcrumb {
          font-size: 0.75rem;
          color: #aaa;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .shop-breadcrumb a { color: #aaa; text-decoration: none; transition: color 0.2s; }
        .shop-breadcrumb a:hover { color: #1a1a1a; }
        .shop-breadcrumb span { color: #ddd; }

        .shop-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 300;
          color: #1a1a1a;
          letter-spacing: -0.3px;
          margin-bottom: 4px;
        }

        .shop-heading em { font-style: italic; color: #8c7b6b; }

        .shop-meta {
          font-size: 0.75rem;
          color: #aaa;
          letter-spacing: 1px;
          margin-bottom: 40px;
        }

        /* Sidebar */
        .shop-sidebar {
          position: sticky;
          top: 88px;
        }

        .filter-block {
          background: #fff;
          border-radius: 6px;
          border: 1px solid #eeebe5;
          margin-bottom: 16px;
          overflow: hidden;
        }

        .filter-block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid #f0ede8;
        }

        .filter-block-title {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #1a1a1a;
          margin: 0;
        }

        .filter-count {
          font-size: 0.65rem;
          color: #fff;
          background: #c9a98a;
          border-radius: 10px;
          padding: 2px 8px;
          font-weight: 500;
        }

        .filter-block-body { padding: 16px 20px; }

        .filter-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 7px 0;
          cursor: pointer;
        }

        .filter-item input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border: 1.5px solid #d4cfc8;
          border-radius: 3px;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .filter-item input[type="checkbox"]:checked {
          background: #1a1a1a;
          border-color: #1a1a1a;
        }

        .filter-item input[type="checkbox"]:checked::after {
          content: '';
          position: absolute;
          top: 2px; left: 5px;
          width: 4px; height: 7px;
          border: 1.5px solid #fff;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }

        .filter-item label {
          font-size: 0.82rem;
          font-weight: 300;
          color: #555;
          cursor: pointer;
          transition: color 0.2s;
          flex: 1;
          margin: 0;
        }

        .filter-item:hover label { color: #1a1a1a; }

        .clear-btn {
          width: 100%;
          padding: 11px;
          background: transparent;
          border: 1.5px solid #e8e4de;
          border-radius: 5px;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #888;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 4px;
        }

        .clear-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }

        /* Product grid */
        .shop-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #eeebe5;
        }

        .shop-results {
          font-size: 0.78rem;
          color: #aaa;
          letter-spacing: 0.5px;
        }

        .mobile-filter-btn {
          display: none;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          background: #fff;
          border: 1.5px solid #e8e4de;
          border-radius: 5px;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #555;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mobile-filter-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }

        /* Product card */
        .scard {
          background: #fff;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid transparent;
          transition: border-color 0.25s, box-shadow 0.25s;
          position: relative;
        }

        .scard:hover {
          border-color: #eeebe5;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }

        .scard-img-wrap {
          position: relative;
          aspect-ratio: 3/4;
          background: #f0ede8;
          overflow: hidden;
        }

        .scard-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: block;
        }

        .scard:hover .scard-img-wrap img { transform: scale(1.06); }

        .scard-badge {
          position: absolute;
          top: 12px; left: 12px;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 2px;
          background: #1a1a1a;
          color: #fff;
          z-index: 2;
        }

        .scard-overlay {
          position: absolute;
          bottom: -44px;
          left: 0; right: 0;
          padding: 13px;
          background: rgba(26,26,26,0.88);
          backdrop-filter: blur(4px);
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #fff;
          text-align: center;
          text-decoration: none;
          transition: bottom 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 3;
          display: block;
        }

        .scard:hover .scard-overlay { bottom: 0; }

        .scard-body { padding: 14px 4px 18px; }

        .scard-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.98rem;
          font-weight: 400;
          color: #1a1a1a;
          margin: 0 0 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .scard-prices { display: flex; align-items: baseline; gap: 8px; }

        .scard-price {
          font-family: 'Jost', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          color: #1a1a1a;
        }

        .scard-compare {
          font-size: 0.75rem;
          font-weight: 300;
          color: #bbb;
          text-decoration: line-through;
        }

        /* Empty */
        .shop-empty {
          grid-column: 1/-1;
          text-align: center;
          padding: 80px 20px;
          color: #bbb;
        }

        .shop-empty p {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          color: #ccc;
          margin-bottom: 16px;
        }

        /* Mobile sidebar overlay */
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 998;
        }

        @media (max-width: 991px) {
          .shop-sidebar-col {
            position: fixed !important;
            top: 0; left: 0;
            width: 300px;
            height: 100vh;
            background: #faf9f7;
            z-index: 999;
            overflow-y: auto;
            padding: 24px 20px;
            transform: translateX(-100%);
            transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            box-shadow: 4px 0 32px rgba(0,0,0,0.12);
          }

          .shop-sidebar-col.open { transform: translateX(0); }

          .sidebar-overlay { display: block; }
          .mobile-filter-btn { display: flex; }

          .shop-sidebar { position: static; }
        }
      `}</style>

      <div className="shop-page">
        <div className="container">
          {/* Breadcrumb + heading */}
          <div className="shop-breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span style={{ color: "#555" }}>Shop</span>
          </div>

          <h1 className="shop-heading">
            The <em>Collection</em>
          </h1>
          <p className="shop-meta">{products.length} products</p>

          <div className="row g-4">
            {/* Sidebar */}
            <div
              className={`col-lg-3 shop-sidebar-col ${sidebarOpen ? "open" : ""}`}
            >
              {/* Mobile close */}
              <div className="d-flex d-lg-none align-items-center justify-content-between mb-4">
                <span
                  style={{
                    fontFamily: "'Jost'",
                    fontSize: "0.68rem",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#aaa",
                  }}
                >
                  Filters
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    border: "none",
                    background: "#f0ede8",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    fontSize: "1rem",
                  }}
                >
                  ×
                </button>
              </div>

              <div className="shop-sidebar">
                {/* Categories */}
                <div className="filter-block">
                  <div className="filter-block-header">
                    <p className="filter-block-title">Categories</p>
                    {selectedCategories.length > 0 && (
                      <span className="filter-count">
                        {selectedCategories.length}
                      </span>
                    )}
                  </div>
                  <div className="filter-block-body">
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <label className="filter-item" key={cat.id}>
                          <input
                            type="checkbox"
                            value={cat.id}
                            onChange={handleCategory}
                            checked={selectedCategories.includes(
                              String(cat.id),
                            )}
                          />
                          <span
                            style={{
                              fontSize: "0.82rem",
                              fontWeight: 300,
                              color: "#555",
                              cursor: "pointer",
                            }}
                          >
                            {cat.name}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p style={{ fontSize: "0.8rem", color: "#bbb" }}>
                        No categories
                      </p>
                    )}
                  </div>
                </div>

                {/* Brands */}
                <div className="filter-block">
                  <div className="filter-block-header">
                    <p className="filter-block-title">Brands</p>
                    {selectedBrands.length > 0 && (
                      <span className="filter-count">
                        {selectedBrands.length}
                      </span>
                    )}
                  </div>
                  <div className="filter-block-body">
                    {brands.length > 0 ? (
                      brands.map((brand) => (
                        <label className="filter-item" key={brand.id}>
                          <input
                            type="checkbox"
                            value={brand.id}
                            onChange={handleBrand}
                            checked={selectedBrands.includes(String(brand.id))}
                          />
                          <span
                            style={{
                              fontSize: "0.82rem",
                              fontWeight: 300,
                              color: "#555",
                              cursor: "pointer",
                            }}
                          >
                            {brand.name}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p style={{ fontSize: "0.8rem", color: "#bbb" }}>
                        No brands
                      </p>
                    )}
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button className="clear-btn" onClick={clearAll}>
                    Clear all filters ({activeFiltersCount})
                  </button>
                )}
              </div>
            </div>

            {/* Mobile overlay */}
            {sidebarOpen && (
              <div
                className="sidebar-overlay"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Products */}
            <div className="col-lg-9">
              <div className="shop-toolbar">
                <span className="shop-results">{products.length} results</span>
                <button
                  className="mobile-filter-btn"
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                  </svg>
                  Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </button>
              </div>

              {products.length > 0 ? (
                <div className="row g-3">
                  {products.map((product) => (
                    <div key={product.id} className="col-6 col-md-4">
                      <div className="scard">
                        <Link
                          to={`/Product/${product.id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <div className="scard-img-wrap">
                            <img src={product.image_url} alt={product.title} />
                            <span className="scard-badge">New</span>
                            <span className="scard-overlay">View Product</span>
                          </div>
                          <div className="scard-body">
                            <p className="scard-name">{product.title}</p>
                            <div className="scard-prices">
                              <span className="scard-price">
                                ${Number(product.price).toFixed(2)}
                              </span>
                              {product.compare_price > product.price && (
                                <span className="scard-compare">
                                  ${Number(product.compare_price).toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="shop-empty">
                  <p>No products found</p>
                  <button
                    onClick={clearAll}
                    style={{
                      fontFamily: "'Jost'",
                      fontSize: "0.72rem",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      background: "none",
                      border: "1.5px solid #1a1a1a",
                      padding: "10px 28px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      color: "#1a1a1a",
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
