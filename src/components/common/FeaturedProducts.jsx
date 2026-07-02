import { useEffect, useState } from "react";
import { ApiUrl } from "./Https";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(ApiUrl + "/featured-products")
      .then((res) => res.json())
      .then((result) => setProducts(result.data))
      .catch((err) => console.log("Error:", err));
  }, []);

  return (
    <section className="featured-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');

        .featured-section {
          padding: 80px 0 100px;
          background: #f5f2ee;
        }

        .featured-section .section-eyebrow {
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

        .featured-section .section-eyebrow::after {
          content: '';
          display: block;
          flex: 1;
          max-width: 48px;
          height: 1px;
          background: #b8a898;
        }

        .featured-section .section-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 300;
          color: #1a1a1a;
          line-height: 1.1;
          margin-bottom: 48px;
          letter-spacing: -0.5px;
        }

        .featured-section .section-heading em {
          font-style: italic;
          color: #8c7b6b;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        @media (max-width: 1024px) { .featured-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .featured-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; } }

        .fcard-v2 {
          background: #fff;
          border-radius: 6px;
          overflow: hidden;
          position: relative;
          border: 1px solid transparent;
          transition: border-color 0.25s, box-shadow 0.25s;
          text-decoration: none;
          display: block;
        }

        .fcard-v2:hover {
          border-color: #e8e2da;
          box-shadow: 0 6px 28px rgba(0,0,0,0.07);
        }

        .fcard-v2-img {
          position: relative;
          aspect-ratio: 3/4;
          background: #ede9e3;
          overflow: hidden;
        }

        .fcard-v2-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .fcard-v2:hover .fcard-v2-img img { transform: scale(1.06); }

        .fcard-v2-badge {
          position: absolute;
          top: 12px; left: 12px;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 2px;
          z-index: 2;
          background: #c9a98a;
          color: #fff;
        }

        .fcard-v2-overlay {
          position: absolute;
          bottom: -44px; left: 0; right: 0;
          padding: 13px;
          background: rgba(26,26,26,0.85);
          backdrop-filter: blur(4px);
          font-family: 'Jost', sans-serif;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #fff;
          text-align: center;
          transition: bottom 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 3;
        }

        .fcard-v2:hover .fcard-v2-overlay { bottom: 0; }

        .fcard-v2-body {
          padding: 14px 16px 18px;
          border-top: 1px solid #f0ede8;
        }

        .fcard-v2-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 400;
          color: #1a1a1a;
          margin: 0 0 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .fcard-v2-prices { display: flex; align-items: baseline; gap: 8px; }

        .fcard-v2-price {
          font-family: 'Jost', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          color: #1a1a1a;
        }

        .fcard-v2-compare {
          font-family: 'Jost', sans-serif;
          font-size: 0.76rem;
          font-weight: 300;
          color: #bbb;
          text-decoration: line-through;
        }

        .featured-view-all {
          display: flex;
          justify-content: center;
          margin-top: 48px;
        }

        .featured-view-all a {
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

        .featured-view-all a::after { content: '→'; transition: transform 0.3s ease; }
        .featured-view-all a:hover { background: #1a1a1a; color: #fff; }
        .featured-view-all a:hover::after { transform: translateX(4px); }
      `}</style>

      <div className="container">
        <p className="section-eyebrow">Hand-Picked</p>
        <h2 className="section-heading">
          Featured <em>Pieces</em>
        </h2>

        <div className="featured-grid">
          {products?.map((product) => (
            <Link
              to={`/Product/${product.id}`}
              className="fcard-v2"
              key={product.id}
            >
              <div className="fcard-v2-img">
                <img src={product.image_url} alt={product.title} />
                {product.compare_price > product.price && (
                  <span className="fcard-v2-badge">Sale</span>
                )}
                <div className="fcard-v2-overlay">View Product</div>
              </div>
              <div className="fcard-v2-body">
                <p className="fcard-v2-name">{product.title}</p>
                <div className="fcard-v2-prices">
                  <span className="fcard-v2-price">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.compare_price > product.price && (
                    <span className="fcard-v2-compare">
                      ${Number(product.compare_price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="featured-view-all">
          <a href="/shop">View All Products</a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
