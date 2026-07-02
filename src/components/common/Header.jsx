import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/images/logo.png";
import { ApiUrl } from "./Https";
import { CartContext } from "../context/cart.jsx";
import { useContext } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems } = useContext(CartContext);

  const cartCount = cartItems?.reduce((sum, item) => sum + item.qty, 0) || 0;

  const fetchCategories = async () => {
    fetch(`${ApiUrl}/categories-products`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) setCategories(result.data);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  };

  useEffect(() => {
    fetchCategories();

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');

        /* Announcement bar */
        .header-announce {
          background: #1a1a1a;
          text-align: center;
          padding: 10px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #c9a98a;
          position: relative;
          overflow: hidden;
        }

        .header-announce::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            90deg,
            transparent,
            transparent 80px,
            rgba(201,169,138,0.05) 80px,
            rgba(201,169,138,0.05) 81px
          );
          pointer-events: none;
        }

        /* Main nav */
        .site-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #fff;
          transition: box-shadow 0.3s ease, background 0.3s ease;
        }

        .site-header.scrolled {
          box-shadow: 0 2px 32px rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(8px);
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          padding: 0 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Logo */
        .header-logo img {
          height: 38px;
          display: block;
          transition: opacity 0.2s;
        }

        .header-logo:hover img { opacity: 0.75; }

        /* Nav links */
        .header-nav {
          display: flex;
          align-items: center;
          gap: 0;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .header-nav li a {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
          text-decoration: none;
          padding: 8px 18px;
          position: relative;
          transition: color 0.25s ease;
          white-space: nowrap;
        }

        .header-nav li a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 18px;
          right: 18px;
          height: 1.5px;
          background: #c9a98a;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .header-nav li a:hover {
          color: #1a1a1a;
        }

        .header-nav li a:hover::after {
          transform: scaleX(1);
        }

        /* Divider between nav and actions */
        .header-divider {
          width: 1px;
          height: 20px;
          background: #e8e4de;
          margin: 0 8px;
        }

        /* Action icons */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .header-action-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: #555;
          text-decoration: none;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .header-action-btn:hover {
          color: #1a1a1a;
          background: #f5f2ee;
        }

        .cart-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #c9a98a;
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }

        /* Search bar (hidden by default) */
        .header-search-wrap {
          position: absolute;
          top: 100%;
          left: 0; right: 0;
          background: #fff;
          border-top: 1px solid #eee;
          padding: 20px 40px;
          display: none;
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }

        /* Mobile toggle */
        .mobile-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 8px;
          border: none;
          background: transparent;
        }

        .mobile-toggle span {
          display: block;
          width: 22px;
          height: 1.5px;
          background: #1a1a1a;
          transition: all 0.3s ease;
          transform-origin: center;
        }

        .mobile-toggle.open span:nth-child(1) {
          transform: translateY(6.5px) rotate(45deg);
        }

        .mobile-toggle.open span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .mobile-toggle.open span:nth-child(3) {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* Mobile drawer */
        .mobile-menu {
          position: fixed;
          top: 0; right: 0;
          width: min(320px, 85vw);
          height: 100vh;
          background: #fff;
          z-index: 2000;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          flex-direction: column;
          padding: 0;
          box-shadow: -8px 0 40px rgba(0,0,0,0.12);
        }

        .mobile-menu.open {
          transform: translateX(0);
        }

        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 1999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }

        .mobile-menu-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 28px;
          border-bottom: 1px solid #f0ede8;
        }

        .mobile-menu-header img { height: 30px; }

        .mobile-close {
          width: 36px;
          height: 36px;
          border: none;
          background: #f5f2ee;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #555;
          font-size: 1.1rem;
          transition: background 0.2s;
        }

        .mobile-close:hover { background: #ece8e2; }

        .mobile-nav {
          flex: 1;
          padding: 32px 28px;
          overflow-y: auto;
        }

        .mobile-nav-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #bbb;
          margin-bottom: 16px;
        }

        .mobile-nav a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 400;
          color: #1a1a1a;
          text-decoration: none;
          padding: 12px 0;
          border-bottom: 1px solid #f0ede8;
          transition: color 0.2s;
        }

        .mobile-nav a:hover { color: #c9a98a; }

        .mobile-nav a::after {
          content: '→';
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          color: #ccc;
          transition: all 0.2s;
        }

        .mobile-nav a:hover::after {
          color: #c9a98a;
          transform: translateX(4px);
        }

        .mobile-footer {
          padding: 24px 28px;
          border-top: 1px solid #f0ede8;
          display: flex;
          gap: 16px;
        }

        .mobile-footer a {
          flex: 1;
          text-align: center;
          padding: 12px;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .mobile-footer a.login {
          border: 1.5px solid #1a1a1a;
          color: #1a1a1a;
        }

        .mobile-footer a.login:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .mobile-footer a.register {
          background: #c9a98a;
          color: #fff;
          border: 1.5px solid #c9a98a;
        }

        .mobile-footer a.register:hover { background: #b8957a; }

        @media (max-width: 991px) {
          .header-nav { display: none; }
          .header-divider { display: none; }
          .mobile-toggle { display: flex; }
          .header-inner { padding: 0 20px; }
        }
      `}</style>

      {/* Announcement */}
      <div className="header-announce">
        ✦ &nbsp; Free shipping on orders over $80 &nbsp; ✦ &nbsp; New arrivals
        every week &nbsp; ✦
      </div>

      {/* Main header */}
      <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-inner">
          {/* Logo */}
          <a href="/user/dashboard" className="header-logo">
            <img src={logo} alt="logo" />
          </a>

          {/* Desktop Nav */}
          <nav>
            <ul className="header-nav">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/Shop">Shop</a>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a href={`/Shop?Category=${cat.id}`}>{cat.name}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Actions */}
          <div className="d-none d-lg-flex align-items-center">
            <div className="header-divider" />
            <div className="header-actions">
              <a
                href="/user/dashboard"
                className="header-action-btn"
                title="Account"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                </svg>
              </a>
              <Link
                to="/Cardproduct"
                className="header-action-btn"
                title="Cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                </svg>
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile: cart + toggle */}
          <div className="d-flex d-lg-none align-items-center gap-2">
            <Link
              to="/Cardproduct"
              className="header-action-btn"
              style={{ position: "relative" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <button
              className={`mobile-toggle ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile drawer */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <img src={logo} alt="logo" />
          <button className="mobile-close" onClick={() => setMenuOpen(false)}>
            ×
          </button>
        </div>

        <nav className="mobile-nav">
          <p className="mobile-nav-label">Navigation</p>
          <a href="/" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href="/Shop" onClick={() => setMenuOpen(false)}>
            Shop
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/Shop?Category=${cat.id}`}
              onClick={() => setMenuOpen(false)}
            >
              {cat.name}
            </a>
          ))}
        </nav>

        <div className="mobile-footer">
          <a href="/Login" className="login">
            Sign In
          </a>
          <a href="/Register" className="register">
            Register
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
