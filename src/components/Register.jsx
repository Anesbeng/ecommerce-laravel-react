import React from "react";
import { useForm } from "react-hook-form";
import { ApiUrl } from "./common/Https";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const Navigate = useNavigate();
  const onSubmit = (data) => {
    console.log(data);
    const res = fetch(`${ApiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.status == 200) {
          toast.success(result.message || "Registration successful");
          Navigate("/");
        } else {
          toast.error(result.message || "Registration failed");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      className="container d-flex align-items-center justify-content-center mt-5"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow-lg border-0 p-5 rounded-4"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h2 className="text-center mb-4 fw-bold">Welcome👋</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">
              Name
            </label>
            <input
              {...register("name", {
                required: "The name field is required",
              })}
              type="text"
              className={`form-control form-control-lg `}
              id="name"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-danger">{errors.name?.message}</p>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
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
              className={`form-control form-control-lg `}
              id="email"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-danger">{errors.email?.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              className={`form-control form-control-lg ${errors.password && "is-invalid"}`}
              id="password"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-danger">{errors.password?.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 rounded-3"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 text-muted">
          Don't have an account?{" "}
          <span
            className="text-primary fw-semibold"
            style={{ cursor: "pointer" }}
          >
            <Link to="/Login">login</Link>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
