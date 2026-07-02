import React from "react";
import logodark from "../../assets/images/logo-white.png";

const Footer = () => {
  return (
    <footer className="site-footer">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Jost:wght@300;400;500&display=swap');

        .site-footer {
          background: #111;
          color: #f5f0ea;
          font-family: 'Jost', sans-serif;
        }

        /* Trust bar */
        .footer-trust {
          border-bottom: 1px solid #222;
          padding: 32px 0;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 24px;
        }

        .trust-item + .trust-item {
          border-left: 1px solid #222;
        }

        .trust-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(201, 169, 138, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a98a;
          flex-shrink: 0;
        }

        .trust-label {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 2px;
        }

        .trust-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 400;
          color: #f0ebe3;
          margin: 0;
        }

        /* Main footer */
        .footer-main {
          padding: 72px 0 56px;
        }

        .footer-brand img {
          height: 36px;
          margin-bottom: 20px;
          filter: brightness(0.85);
        }

        .footer-brand p {
          font-size: 0.85rem;
          font-weight: 300;
          color: #666;
          line-height: 1.7;
          max-width: 220px;
          margin-bottom: 28px;
        }

        .footer-social {
          display: flex;
          gap: 12px;
        }

        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #2e2e2e;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          border-color: #c9a98a;
          color: #c9a98a;
          background: rgba(201, 169, 138, 0.08);
        }

        .footer-col-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 400;
          color: #f0ebe3;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 10px;
        }

        .footer-links a {
          font-size: 0.82rem;
          font-weight: 300;
          color: #666;
          text-decoration: none;
          transition: color 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .footer-links a::before {
          content: '—';
          font-size: 0.6rem;
          color: #3e3e3e;
          transition: color 0.25s ease;
        }

        .footer-links a:hover {
          color: #c9a98a;
        }

        .footer-links a:hover::before {
          color: #c9a98a;
        }

        /* Newsletter */
        .footer-newsletter p {
          font-size: 0.82rem;
          font-weight: 300;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .newsletter-form {
          display: flex;
          gap: 0;
          border: 1px solid #2e2e2e;
          border-radius: 3px;
          overflow: hidden;
          transition: border-color 0.3s ease;
        }

        .newsletter-form:focus-within {
          border-color: #c9a98a;
        }

        .newsletter-input {
          flex: 1;
          padding: 12px 16px;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          color: #f0ebe3;
        }

        .newsletter-input::placeholder { color: #444; }

        .newsletter-btn {
          padding: 12px 20px;
          background: #c9a98a;
          border: none;
          cursor: pointer;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #fff;
          transition: background 0.3s ease;
          white-space: nowrap;
        }

        .newsletter-btn:hover { background: #b8957a; }

        /* Divider */
        .footer-divider {
          border: none;
          border-top: 1px solid #1e1e1e;
          margin: 0;
        }

        /* Bottom */
        .footer-bottom {
          padding: 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .footer-copy {
          font-size: 0.75rem;
          font-weight: 300;
          color: #444;
        }

        .footer-legal {
          display: flex;
          gap: 24px;
        }

        .footer-legal a {
          font-size: 0.72rem;
          font-weight: 300;
          color: #444;
          text-decoration: none;
          transition: color 0.2s;
        }

        .footer-legal a:hover { color: #c9a98a; }
      `}</style>

      {/* Trust bar */}
      <div className="footer-trust">
        <div className="container">
          <div className="row g-0">
            {[
              {
                label: "Shipping",
                title: "Free Delivery",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                  </svg>
                ),
              },
              {
                label: "Returns",
                title: "Money-Back Guarantee",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                    <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z" />
                  </svg>
                ),
              },
              {
                label: "Payments",
                title: "Secure Checkout",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5z" />
                    <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1m-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div key={i} className="col-md-4">
                <div className="trust-item">
                  <div className="trust-icon">{item.icon}</div>
                  <div>
                    <p className="trust-label">{item.label}</p>
                    <p className="trust-title">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="footer-main">
        <div className="container">
          <div className="row g-5">
            {/* Brand */}
            <div className="col-md-4">
              <div className="footer-brand">
                <img src={logodark} alt="logo" />
                <p>
                  Thoughtfully curated fashion for those who believe style is a
                  quiet act of self-expression.
                </p>
                <div className="footer-social">
                  {["instagram", "twitter", "facebook"].map((s) => (
                    <a key={s} href="#" className="social-btn" aria-label={s}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 0C3.582 0 0 3.582 0 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="col-md-2">
              <p className="footer-col-title">Categories</p>
              <ul className="footer-links">
                <li>
                  <a href="#">Women</a>
                </li>
                <li>
                  <a href="#">Men</a>
                </li>
                <li>
                  <a href="#">Kids</a>
                </li>
                <li>
                  <a href="#">New Arrivals</a>
                </li>
                <li>
                  <a href="#">Sale</a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="col-md-2">
              <p className="footer-col-title">Account</p>
              <ul className="footer-links">
                <li>
                  <a href="#">Sign In</a>
                </li>
                <li>
                  <a href="#">Register</a>
                </li>
                <li>
                  <a href="#">My Orders</a>
                </li>
                <li>
                  <a href="#">Wishlist</a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-md-4">
              <p className="footer-col-title">Stay in the Loop</p>
              <div className="footer-newsletter">
                <p>
                  New arrivals, exclusive offers, and style inspiration —
                  delivered to your inbox.
                </p>
                <div className="newsletter-form">
                  <input
                    type="email"
                    className="newsletter-input"
                    placeholder="your@email.com"
                  />
                  <button className="newsletter-btn">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="footer-divider" />

      {/* Bottom */}
      <div className="container">
        <div className="footer-bottom">
          <p className="footer-copy">© 2024 E-commerce. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
