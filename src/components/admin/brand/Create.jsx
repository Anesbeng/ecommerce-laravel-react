import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../common/AdminLayout";
import { useForm } from "react-hook-form";
import { AdminToken, ApiUrl } from "../../common/Https";
import { toast } from "react-toastify";
import { FORM_CSS } from "../formStyles";

const Create = () => {
  const Navigate = useNavigate();
  const [disable, setDisable] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setDisable(true);
    const res = await fetch(`${ApiUrl}/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${AdminToken()}`,
      },
      body: JSON.stringify(data),
    }).then((r) => r.json());
    setDisable(false);
    if (res.status === 200) {
      toast.success(res.message);
      Navigate("/admin/brand");
    } else toast.error(res.message ?? "Something went wrong");
  };

  return (
    <AdminLayout>
      <style>{FORM_CSS}</style>

      <div className="af-header">
        <h1 className="af-title">Create Brand</h1>
        <Link to="/admin/brand" className="af-back">
          ← Back
        </Link>
      </div>

      <div className="af-card" style={{ maxWidth: 520 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="af-field">
            <label className="af-label">Brand Name</label>
            <input
              className={`af-input${errors.name ? " error" : ""}`}
              placeholder="e.g. Nike"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <span className="af-error">{errors.name.message}</span>
            )}
          </div>

          <div className="af-field">
            <label className="af-label">Status</label>
            <select
              className={`af-select${errors.status ? " error" : ""}`}
              {...register("status", { required: "Status is required" })}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
            {errors.status && (
              <span className="af-error">{errors.status.message}</span>
            )}
          </div>

          <div className="af-footer">
            <button type="submit" className="af-submit-btn" disabled={disable}>
              {disable ? "Saving…" : "Create Brand"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Create;
