import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiUrl } from "./common/Https";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import authImage from "../assets/images/three.jpg";
import logo from "../assets/images/logo.png";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);
    fetch(`${ApiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status == 200) {
          toast.success(result.message || "Registration successful");
          navigate("/login");
        } else {
          toast.error(result.message || "Registration failed");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="auth-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');

        .auth-page {
          min-height: 100vh;
          display: flex;
          font-family: 'Jost', sans-serif;
          background: #faf9f7;
        }

        .auth-visual {
          flex: 1;
          position: relative;
          background: #1a1a1a;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          min-width: 0;
        }

        .auth-visual img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.88;
        }

        .auth-visual::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(26,26,26,0.05) 0%, rgba(26,26,26,0.75) 100%);
        }

        .auth-visual-content {
          position: relative;
          z-index: 2;
          padding: 56px;
          color: #fff;
        }

        .auth-visual-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 400;
          line-height: 1.3;
          max-width: 420px;
          margin-bottom: 12px;
        }

        .auth-visual-sub {
          font-size: 0.78rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #c9a98a;
          font-weight: 500;
        }

        .auth-form-side {
          width: 480px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 64px;
          overflow-y: auto;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
        }

        .auth-logo img { height: 30px; }

        .auth-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }

        .auth-subtitle {
          font-size: 0.88rem;
          color: #999;
          margin-bottom: 32px;
          font-weight: 300;
        }

        .auth-subtitle a { color: #c9a98a; text-decoration: none; font-weight: 500; }
        .auth-subtitle a:hover { text-decoration: underline; }

        .auth-field { margin-bottom: 18px; }

        .auth-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #999;
          margin-bottom: 8px;
        }

        .auth-input-wrap { position: relative; }

        .auth-input {
          width: 100%;
          padding: 13px 16px;
          border: 1.5px solid #e8e4de;
          border-radius: 8px;
          font-size: 0.92rem;
          font-family: 'Jost', sans-serif;
          color: #1a1a1a;
          background: #fff;
          transition: border-color 0.2s ease;
          outline: none;
        }

        .auth-input:focus { border-color: #c9a98a; }
        .auth-input.error { border-color: #d9534f; }

        .auth-toggle-pw {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 0.72rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          font-weight: 500;
        }

        .auth-toggle-pw:hover { color: #1a1a1a; }

        .auth-error {
          font-size: 0.78rem;
          color: #d9534f;
          margin-top: 6px;
        }

        .auth-hint {
          font-size: 0.75rem;
          color: #bbb;
          margin-top: 6px;
        }

        .auth-submit {
          width: 100%;
          padding: 14px;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s ease;
        }

        .auth-submit:hover:not(:disabled) { background: #333; }
        .auth-submit:disabled { background: #ccc; cursor: not-allowed; }

        .auth-back-home {
          font-size: 0.78rem;
          color: #999;
          text-decoration: none;
          text-align: center;
          margin-top: 20px;
          display: block;
        }

        .auth-back-home:hover { color: #1a1a1a; }

        @media (max-width: 900px) {
          .auth-visual { display: none; }
          .auth-form-side {
            width: 100%;
            padding: 40px 24px;
          }
        }
      `}</style>

      {/* Left visual panel */}
      <div className="auth-visual">
        <img src={authImage} alt="" />
        <div className="auth-visual-content">
          <p className="auth-visual-sub">Pure Wear</p>
          <p className="auth-visual-quote">
            Join a community that values quality over everything.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-side">
        <Link to="/" className="auth-logo">
          <img src={logo} alt="logo" />
        </Link>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">
          Already have an account? <Link to="/Login">Sign in</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="auth-field">
            <label htmlFor="name" className="auth-label">
              Full Name
            </label>
            <input
              {...register("name", {
                required: "The name field is required",
              })}
              type="text"
              className={`auth-input ${errors.name ? "error" : ""}`}
              id="name"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="auth-error">{errors.name?.message}</p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "The email field is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              className={`auth-input ${errors.email ? "error" : ""}`}
              id="email"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="auth-error">{errors.email?.message}</p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <div className="auth-input-wrap">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                className={`auth-input ${errors.password ? "error" : ""}`}
                id="password"
                placeholder="Create a password"
                style={{ paddingRight: "56px" }}
              />
              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password ? (
              <p className="auth-error">{errors.password?.message}</p>
            ) : (
              <p className="auth-hint">At least 8 characters</p>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="password_confirmation" className="auth-label">
              Confirm Password
            </label>
            <input
              {...register("password_confirmation", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              type={showPassword ? "text" : "password"}
              className={`auth-input ${errors.password_confirmation ? "error" : ""}`}
              id="password_confirmation"
              placeholder="Re-enter your password"
            />
            {errors.password_confirmation && (
              <p className="auth-error">
                {errors.password_confirmation?.message}
              </p>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <Link to="/" className="auth-back-home">
          ← Back to shopping
        </Link>
      </div>
    </div>
  );
};

export default Register;
