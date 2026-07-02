import { useEffect, useState } from "react";
import { ApiUrl } from "./Https";
import { Link } from "react-router-dom";

const LatestProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(ApiUrl + "/latest-products", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => setProducts(result.data))
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <section className="products-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');

        .products-section {
          padding: 100px 0 80px;
          background: #faf9f7;
        }

        .section-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #b8a898;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .section-eyebrow::after {
          content: '';
          display: block;
          flex: 1;
          max-width: 48px;
          height: 1px;
          background: #b8a898;
        }

        .section-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 300;
          color: #1a1a1a;
          line-height: 1.1;
          margin-bottom: 56px;
          letter-spacing: -0.5px;
        }

        .section-heading em {
          font-style: italic;
          font-weight: 300;
          color: #8c7b6b;
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
        }

        @media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .product-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } }

        .pcard {
          position: relative;
          background: #fff;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
        }

        .pcard-image-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3/4;
          background: #f0ede8;
        }

        .pcard-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: block;
        }

        .pcard:hover .pcard-image-wrap img {
          transform: scale(1.07);
        }

        .pcard-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 2px;
          z-index: 2;
        }

        .pcard-badge.new {
          background: #1a1a1a;
          color: #fff;
        }

        .pcard-badge.sale {
          background: #c9a98a;
          color: #fff;
        }

        .pcard-quick {
          position: absolute;
          bottom: -48px;
          left: 0; right: 0;
          padding: 14px;
          background: rgba(26, 26, 26, 0.88);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #fff;
          text-decoration: none;
          transition: bottom 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 3;
        }

        .pcard:hover .pcard-quick {
          bottom: 0;
        }

        .pcard-body {
          padding: 16px 4px 20px;
        }

        .pcard-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          font-weight: 400;
          color: #1a1a1a;
          margin: 0 0 8px;
          line-height: 1.3;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pcard-prices {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .pcard-price {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          color: #1a1a1a;
        }

        .pcard-compare {
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 300;
          color: #bbb;
          text-decoration: line-through;
        }

        .view-all-wrap {
          display: flex;
          justify-content: center;
          margin-top: 56px;
        }

        .view-all-btn {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #1a1a1a;
          text-decoration: none;
          padding: 14px 48px;
          border: 1.5px solid #1a1a1a;
          border-radius: 2px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }

        .view-all-btn:hover {
          background: #1a1a1a;
          color: #fff;
        }

        .view-all-btn::after {
          content: '→';
          transition: transform 0.3s ease;
        }

        .view-all-btn:hover::after { transform: translateX(4px); }
      `}</style>

      <div className="container">
        <p className="section-eyebrow">Just Arrived</p>
        <h2 className="section-heading">
          Latest <em>Arrivals</em>
        </h2>

        <div className="product-grid">
          {products?.map((product, i) => (
            <div
              className="pcard"
              key={product.id}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <Link
                to={`/Product/${product.id}`}
                style={{ textDecoration: "none" }}
              >
                <div className="pcard-image-wrap">
                  <img src={product.image_url} alt={product.title} />
                  <span className="pcard-badge new">New</span>
                  <span className="pcard-quick">View Product</span>
                </div>
                <div className="pcard-body">
                  <h5 className="pcard-name">{product.title}</h5>
                  <div className="pcard-prices">
                    <span className="pcard-price">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.compare_price > product.price && (
                      <span className="pcard-compare">
                        ${Number(product.compare_price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="view-all-wrap">
          <a href="/shop" className="view-all-btn">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;
