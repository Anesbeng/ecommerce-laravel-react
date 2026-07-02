import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

// Free high-quality Unsplash fashion images
const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=85&fit=crop",
    label: "New Season",
    title: "Refined\nElegance",
    sub: "Curated pieces for the discerning wardrobe",
    cta: "Explore Collection",
    ctaLink: "/shop",
    align: "left",
    accent: "#d4b896",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=85&fit=crop",
    label: "Exclusive Drop",
    title: "Beyond\nOrdinary",
    sub: "Where craft meets contemporary vision",
    cta: "Shop Now",
    ctaLink: "/shop",
    align: "right",
    accent: "#a8c4b8",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=85&fit=crop",
    label: "Limited Edition",
    title: "Timeless\nStyle",
    sub: "Pieces that transcend every season",
    cta: "View Lookbook",
    ctaLink: "/shop",
    align: "left",
    accent: "#d4b896",
  },
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperRef, setSwiperRef] = useState(null);

  return (
    <section className="hero-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;0,400;1,200;1,300&family=Jost:wght@200;300;400;500&display=swap');

        .hero-section {
          position: relative;
          height: 95vh;
          min-height: 640px;
          max-height: 1000px;
          overflow: hidden;
          background: #0e0c0b;
        }

        .hero-section .swiper,
        .hero-section .swiper-wrapper,
        .hero-section .swiper-slide {
          height: 100%;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 30%;
          transform: scale(1.1);
          transition: transform 7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: brightness(0.55);
        }

        .swiper-slide-active .hero-bg { transform: scale(1); }

        .hero-overlay-base {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(8,6,5,0.75) 0%, rgba(8,6,5,0.1) 50%, transparent 100%);
          z-index: 1;
        }

        .hero-overlay-side {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .hero-overlay-side.left {
          background: linear-gradient(100deg, rgba(8,6,5,0.65) 0%, rgba(8,6,5,0.2) 45%, transparent 70%);
        }

        .hero-overlay-side.right {
          background: linear-gradient(260deg, rgba(8,6,5,0.65) 0%, rgba(8,6,5,0.2) 45%, transparent 70%);
        }

        .hero-content {
          position: absolute;
          top: 50%;
          transform: translateY(-52%);
          z-index: 5;
          max-width: 580px;
          padding: 0 72px;
        }

        .hero-content.align-left  { left: 0; }
        .hero-content.align-right { right: 0; text-align: right; }

        .hero-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--accent, #d4b896);
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 14px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s;
        }

        .hero-label::before {
          content: '';
          width: 36px;
          height: 1px;
          background: var(--accent, #d4b896);
          flex-shrink: 0;
        }

        .hero-content.align-right .hero-label { justify-content: flex-end; }
        .hero-content.align-right .hero-label::before { order: 2; }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.8rem, 7.5vw, 7rem);
          font-weight: 200;
          line-height: 0.95;
          color: #fff;
          margin-bottom: 28px;
          white-space: pre-line;
          letter-spacing: -1px;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s;
        }

        .hero-sub {
          font-family: 'Jost', sans-serif;
          font-size: 0.88rem;
          font-weight: 300;
          color: rgba(255,255,255,0.6);
          margin-bottom: 44px;
          line-height: 1.7;
          max-width: 360px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease 0.55s, transform 0.8s ease 0.55s;
        }

        .hero-content.align-right .hero-sub { margin-left: auto; }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 20px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s ease 0.75s, transform 0.8s ease 0.75s;
        }

        .hero-content.align-right .hero-cta-group { justify-content: flex-end; }

        .hero-cta-primary {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #0e0c0b;
          text-decoration: none;
          padding: 15px 40px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }

        .hero-cta-primary::after { content: '→'; font-size: 0.9rem; transition: transform 0.3s ease; }
        .hero-cta-primary:hover { background: var(--accent, #d4b896); color: #fff; }
        .hero-cta-primary:hover::after { transform: translateX(4px); }

        .hero-cta-secondary {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .hero-cta-secondary:hover { color: #fff; }

        .swiper-slide-active .hero-label,
        .swiper-slide-active .hero-title,
        .swiper-slide-active .hero-sub,
        .swiper-slide-active .hero-cta-group {
          opacity: 1;
          transform: translateY(0);
        }

        /* Progress bar */
        .hero-progress {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,0.08);
          z-index: 20;
          overflow: hidden;
        }

        .hero-progress-fill {
          height: 100%;
          background: var(--accent, #d4b896);
          transform-origin: left;
          animation: progressFill 5.5s linear infinite;
        }

        @keyframes progressFill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* Bottom bar */
        .hero-bottom {
          position: absolute;
          bottom: 36px;
          left: 0; right: 0;
          z-index: 20;
          padding: 0 72px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          pointer-events: none;
        }

        /* Scroll */
        .hero-scroll {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .hero-scroll-line {
          width: 1px;
          height: 52px;
          background: rgba(255,255,255,0.2);
          position: relative;
          overflow: hidden;
        }

        .hero-scroll-line::after {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.7);
          animation: scrollAnim 2.2s ease infinite;
        }

        @keyframes scrollAnim {
          0%   { top: -100%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .hero-scroll-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.58rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          writing-mode: vertical-lr;
        }

        /* Nav arrows */
        .hero-nav {
          display: flex;
          gap: 8px;
          pointer-events: all;
        }

        .hero-nav-btn {
          width: 46px;
          height: 46px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(6px);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          font-family: 'Jost', sans-serif;
          font-size: 1rem;
          font-weight: 300;
        }

        .hero-nav-btn:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.5);
          color: #fff;
        }

        /* Counter */
        .hero-counter {
          font-family: 'Cormorant Garamond', serif;
          color: rgba(255,255,255,0.35);
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .hero-counter-current {
          font-size: 2.2rem;
          font-weight: 200;
          color: #fff;
          line-height: 1;
        }

        /* Vertical dots */
        .hero-pagination {
          position: absolute;
          right: 28px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .hero-dot {
          width: 2px;
          height: 22px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.35s ease;
        }

        .hero-dot.active {
          background: #fff;
          height: 44px;
        }

        @media (max-width: 768px) {
          .hero-content { padding: 0 28px; max-width: 100%; }
          .hero-title { font-size: clamp(2.8rem, 11vw, 4rem); }
          .hero-bottom { padding: 0 28px; }
          .hero-scroll { display: none; }
          .hero-pagination { right: 12px; }
        }
      `}</style>

      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        speed={1400}
        loop
        onSwiper={setSwiperRef}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        style={{ height: "100%" }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="hero-bg"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="hero-overlay-base" />
            <div className={`hero-overlay-side ${slide.align}`} />

            <div
              className={`hero-content align-${slide.align}`}
              style={{ "--accent": slide.accent }}
            >
              <p className="hero-label">{slide.label}</p>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-sub">{slide.sub}</p>
              <div className="hero-cta-group">
                <a
                  href={slide.ctaLink}
                  className="hero-cta-primary"
                  style={{ "--accent": slide.accent }}
                >
                  {slide.cta}
                </a>
                <a href="/shop" className="hero-cta-secondary">
                  View All
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Vertical dot pagination */}
      <div className="hero-pagination">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`hero-dot ${activeIndex === i ? "active" : ""}`}
            onClick={() => swiperRef?.slideTo(i + 1)}
          />
        ))}
      </div>

      {/* Bottom bar */}
      <div className="hero-bottom">
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span className="hero-scroll-text">Scroll</span>
        </div>

        <div className="hero-nav" style={{ pointerEvents: "all" }}>
          <button
            className="hero-nav-btn"
            onClick={() => swiperRef?.slidePrev()}
          >
            ←
          </button>
          <button
            className="hero-nav-btn"
            onClick={() => swiperRef?.slideNext()}
          >
            →
          </button>
        </div>

        <div className="hero-counter">
          <span className="hero-counter-current">0{activeIndex + 1}</span>
          <span style={{ fontSize: "0.65rem" }}>/</span>
          <span>0{slides.length}</span>
        </div>
      </div>

      {/* Animated progress bar */}
      <div className="hero-progress">
        <div
          className="hero-progress-fill"
          key={activeIndex}
          style={{ "--accent": slides[activeIndex]?.accent }}
        />
      </div>
    </section>
  );
};

export default Hero;
