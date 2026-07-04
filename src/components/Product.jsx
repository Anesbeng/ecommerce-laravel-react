import { useState, useEffect, useContext } from "react";
import Layout from "./common/Layout";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import Img1 from "../assets/images/Mens/eleven.jpg";
import { Rating } from "react-simple-star-rating";
import { ApiUrl } from "./common/Https";
import { CartContext } from "./context/cart.jsx";
import { toast } from "react-toastify";

const Product = () => {
  const [products, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [sizes, setSize] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [rating] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const params = useParams();
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart.");
    } else {
      addToCart(products, selectedSize, qty);
      toast.success("Added to cart!");
    }
  };

  const fetchProduct = () => {
    fetch(`${ApiUrl}/get-product/${params.id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((result) => {
        if (result.status === 200) {
          setProduct(result.data);
          setSize(result.data.sizes);
          const imageUrl = (f) =>
            `${ApiUrl.replace("/api", "")}/uploads/product/small/${f}`;
          if (result.data.images?.length > 0) {
            setImages(result.data.images.map((img) => imageUrl(img.image)));
          } else if (result.data.image) {
            setImages([imageUrl(result.data.image)]);
          }
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const discount = products
    ? Math.round(
        ((products.compare_price - products.price) / products.compare_price) *
          100,
      )
    : 0;

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');

        .product-page-wrap {
          background: #faf9f7;
          min-height: 100vh;
          padding: 48px 0 96px;
          font-family: 'Jost', sans-serif;
        }

        .product-breadcrumb {
          font-size: 0.75rem;
          color: #aaa;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .product-breadcrumb a { color: #aaa; text-decoration: none; transition: color 0.2s; }
        .product-breadcrumb a:hover { color: #1a1a1a; }
        .product-breadcrumb span { color: #ddd; }

        /* Gallery */
        .gallery-wrap { display: flex; gap: 12px; }

        .gallery-thumbs {
          width: 72px;
          height: 580px;
          flex-shrink: 0;
        }

        .gallery-thumbs .swiper,
        .gallery-main .swiper {
          width: 100%;
          height: 100%;
        }

        .gallery-thumbs .swiper-slide {
          border-radius: 4px;
          overflow: hidden;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: border-color 0.2s;
          aspect-ratio: 1;
          background: #f0ede8;
        }

        .gallery-thumbs .swiper-slide-thumb-active {
          border-color: #1a1a1a;
        }

        .gallery-thumbs img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-main {
          flex: 1;
          height: 580px;
          border-radius: 8px;
          overflow: hidden;
          background: #f0ede8;
          position: relative;
        }

        .gallery-main img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .gallery-discount-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #c9a98a;
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 1px;
          padding: 6px 12px;
          border-radius: 2px;
          z-index: 10;
        }

        /* Info panel */
        .product-info {
          padding-left: 40px;
        }

        .product-category-label {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c9a98a;
          margin-bottom: 12px;
        }

        .product-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          font-weight: 400;
          color: #1a1a1a;
          line-height: 1.15;
          margin-bottom: 16px;
          letter-spacing: -0.3px;
        }

        .product-rating-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .product-rating-count {
          font-size: 0.75rem;
          color: #aaa;
          font-weight: 300;
        }

        .product-price-row {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 8px;
        }

        .product-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 400;
          color: #1a1a1a;
        }

        .product-compare {
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 300;
          color: #bbb;
          text-decoration: line-through;
        }

        .product-divider {
          border: none;
          border-top: 1px solid #eeebe5;
          margin: 24px 0;
        }

        .product-short-desc {
          font-size: 0.85rem;
          font-weight: 300;
          color: #777;
          line-height: 1.75;
          margin-bottom: 28px;
        }

        /* Size selector */
        .size-label {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .size-guide {
          font-size: 0.68rem;
          color: #c9a98a;
          cursor: pointer;
          text-decoration: underline;
          font-weight: 400;
        }

        .sizes-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 28px; }

        .size-btn {
          min-width: 44px;
          height: 44px;
          padding: 0 14px;
          border: 1.5px solid #ddd;
          border-radius: 4px;
          background: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: #555;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .size-btn:hover { border-color: #1a1a1a; color: #1a1a1a; }

        .size-btn.sold-out {
          color: #ccc;
          border-color: #eee;
          text-decoration: line-through;
          cursor: not-allowed;
          background: #fafafa;
        }
        .size-btn.sold-out:hover { border-color: #eee; color: #ccc; }

        .size-btn.selected {
          background: #1a1a1a;
          border-color: #1a1a1a;
          color: #fff;
        }

        /* Qty */
        .qty-label {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 12px;
        }

        .qty-row {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 28px;
        }

        .qty-wrap {
          display: flex;
          align-items: center;
          border: 1.5px solid #ddd;
          border-radius: 5px;
          overflow: hidden;
          background: #fff;
        }

        .qty-step {
          width: 36px;
          height: 44px;
          border: none;
          background: #f5f2ee;
          cursor: pointer;
          font-size: 1.1rem;
          color: #555;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          font-weight: 300;
        }

        .qty-step:hover { background: #ece8e2; }

        .qty-num {
          width: 48px;
          height: 44px;
          border: none;
          border-left: 1px solid #e8e4de;
          border-right: 1px solid #e8e4de;
          text-align: center;
          font-family: 'Jost', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: #1a1a1a;
          background: #fff;
          outline: none;
          -moz-appearance: textfield;
        }

        .qty-num::-webkit-inner-spin-button,
        .qty-num::-webkit-outer-spin-button { -webkit-appearance: none; }

        /* CTA */
        .add-to-cart-btn {
          flex: 1;
          height: 52px;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 5px;
          font-family: 'Jost', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .add-to-cart-btn:hover {
          background: #333;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }

        .wishlist-btn {
          width: 52px;
          height: 52px;
          border: 1.5px solid #ddd;
          border-radius: 5px;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #aaa;
          transition: all 0.2s;
        }

        .wishlist-btn:hover { border-color: #e88; color: #e88; }

        /* SKU */
        .product-meta {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #eeebe5;
          display: flex;
          gap: 24px;
        }

        .product-meta-item {
          font-size: 0.75rem;
          color: #bbb;
          font-weight: 300;
        }

        .product-meta-item strong {
          font-weight: 500;
          color: #888;
          margin-right: 6px;
        }

        /* Tabs */
        .product-tabs {
          margin-top: 72px;
          border-top: 1px solid #eeebe5;
          padding-top: 48px;
        }

        .tab-nav {
          display: flex;
          gap: 0;
          margin-bottom: 40px;
          border-bottom: 1px solid #eeebe5;
        }

        .tab-btn {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #aaa;
          background: none;
          border: none;
          padding: 14px 28px;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }

        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0; right: 0;
          height: 2px;
          background: #1a1a1a;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .tab-btn.active { color: #1a1a1a; }
        .tab-btn.active::after { transform: scaleX(1); }
        .tab-btn:hover { color: #555; }

        .tab-content {
          font-size: 0.88rem;
          font-weight: 300;
          color: #666;
          line-height: 1.85;
          max-width: 720px;
        }

        .tab-content h1, .tab-content h2, .tab-content h3 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 400;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        /* Loading */
        .product-skeleton {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 40px;
        }

        .skeleton-line {
          background: linear-gradient(90deg, #f0ede8 25%, #e8e4de 50%, #f0ede8 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @media (max-width: 768px) {
          .product-info { padding-left: 0; margin-top: 32px; }
          .gallery-wrap { flex-direction: column-reverse; }
          .gallery-thumbs { width: 100%; height: 64px; }
          .gallery-main { height: 360px; }
        }
      `}</style>

      <div className="product-page-wrap">
        <div className="container">
          {/* Breadcrumb */}
          <div className="product-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/Shop">Shop</Link>
            <span>/</span>
            <span style={{ color: "#555" }}>
              {products?.title || "Product"}
            </span>
          </div>

          <div className="row">
            {/* Gallery */}
            <div className="col-md-6">
              <div className="gallery-wrap">
                {/* Thumbnails */}
                <div className="gallery-thumbs">
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={false}
                    direction="horizontal"
                    spaceBetween={8}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    breakpoints={{
                      769: { direction: "vertical", slidesPerView: 5 },
                    }}
                  >
                    {(images.length > 0 ? images : [Img1]).map((img, i) => (
                      <SwiperSlide key={i}>
                        <img src={img} alt="" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {/* Main image */}
                <div className="gallery-main">
                  {discount > 0 && (
                    <div className="gallery-discount-badge">−{discount}%</div>
                  )}
                  <Swiper
                    loop={images.length > 1}
                    spaceBetween={0}
                    navigation={true}
                    thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
                    modules={[FreeMode, Navigation, Thumbs]}
                    style={{
                      "--swiper-navigation-color": "#fff",
                      "--swiper-navigation-size": "18px",
                    }}
                  >
                    {(images.length > 0 ? images : [Img1]).map((img, i) => (
                      <SwiperSlide key={i}>
                        <img src={img} alt="" />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>

            {/* Info */}
            {products ? (
              <div className="col-md-6">
                <div className="product-info">
                  <p className="product-category-label">New Arrival</p>

                  <h1 className="product-title">{products.title}</h1>

                  <div className="product-rating-row">
                    <Rating initialValue={rating} size={16} />
                    <span className="product-rating-count">
                      ({rating} reviews)
                    </span>
                  </div>

                  <div className="product-price-row">
                    <span className="product-price">
                      ${Number(products.price).toFixed(2)}
                    </span>
                    {products.compare_price > products.price && (
                      <span className="product-compare">
                        ${Number(products.compare_price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <hr className="product-divider" />

                  <p className="product-short-desc">
                    {products.short_description}
                  </p>

                  {/* Sizes */}
                  <div className="mb-0">
                    <div className="size-label">
                      <span>Select Size</span>
                      <span className="size-guide">Size guide</span>
                    </div>
                    <div className="sizes-row">
                      {sizes?.length > 0 ? (
                        sizes.map((size, i) => {
                          const stock = size.pivot?.qty ?? 0;
                          const soldOut = stock <= 0;
                          return (
                            <button
                              key={i}
                              disabled={soldOut}
                              className={`size-btn ${selectedSize?.id === size.id ? "selected" : ""} ${soldOut ? "sold-out" : ""}`}
                              onClick={() => {
                                if (soldOut) return;
                                setSelectedSize(size);
                                setQty(1);
                              }}
                              title={soldOut ? "Out of stock" : `${stock} left`}
                            >
                              {size.name}
                            </button>
                          );
                        })
                      ) : (
                        <p style={{ fontSize: "0.8rem", color: "#bbb" }}>
                          No sizes available
                        </p>
                      )}
                    </div>
                    {selectedSize && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#999",
                          marginTop: 8,
                        }}
                      >
                        {selectedSize.pivot?.qty > 0
                          ? `${selectedSize.pivot.qty} in stock`
                          : "Out of stock"}
                      </p>
                    )}
                  </div>

                  {/* Qty + CTA */}
                  <p className="qty-label">Quantity</p>
                  <div className="qty-row">
                    <div className="qty-wrap">
                      <button
                        className="qty-step"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                      >
                        −
                      </button>
                      <input
                        className="qty-num"
                        type="number"
                        value={qty}
                        min={1}
                        max={selectedSize?.pivot?.qty || undefined}
                        onChange={(e) => {
                          const max = selectedSize?.pivot?.qty ?? Infinity;
                          setQty(
                            Math.min(max, Math.max(1, Number(e.target.value))),
                          );
                        }}
                      />
                      <button
                        className="qty-step"
                        onClick={() => {
                          const max = selectedSize?.pivot?.qty ?? Infinity;
                          setQty(Math.min(max, qty + 1));
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="add-to-cart-btn"
                      onClick={handleAddToCart}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
                      </svg>
                      Add to Cart
                    </button>

                    <button className="wishlist-btn" title="Add to wishlist">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                      </svg>
                    </button>
                  </div>

                  {/* Meta */}
                  <div className="product-meta">
                    {products.sku && (
                      <span className="product-meta-item">
                        <strong>SKU</strong>
                        {products.sku}
                      </span>
                    )}
                    <span className="product-meta-item">
                      <strong>Category</strong>Fashion
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-md-6">
                <div className="product-skeleton">
                  <div
                    className="skeleton-line"
                    style={{ height: 14, width: "30%" }}
                  />
                  <div
                    className="skeleton-line"
                    style={{ height: 36, width: "80%" }}
                  />
                  <div
                    className="skeleton-line"
                    style={{ height: 36, width: "60%" }}
                  />
                  <div
                    className="skeleton-line"
                    style={{ height: 14, width: "40%", marginTop: 8 }}
                  />
                  <div
                    className="skeleton-line"
                    style={{ height: 80, width: "100%", marginTop: 8 }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="product-tabs">
            <div className="tab-nav">
              <button
                className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "description" && products && (
                <div
                  dangerouslySetInnerHTML={{ __html: products.description }}
                />
              )}
              {activeTab === "description" && !products && (
                <p style={{ color: "#bbb" }}>Loading...</p>
              )}
              {activeTab === "reviews" && (
                <p style={{ color: "#bbb", fontStyle: "italic" }}>
                  No reviews yet. Be the first to review this product.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
