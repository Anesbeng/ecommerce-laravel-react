import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../common/AdminLayout";
import { useForm } from "react-hook-form";
import { AdminToken, ApiUrl } from "../../common/Https";
import { toast } from "react-toastify";
import { FORM_CSS } from "../formStyles";

const Edit = () => {
  const Navigate = useNavigate();
  const { id } = useParams();
  const [disable, setDisable] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      const res = await fetch(`${ApiUrl}/categories/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${AdminToken()}`,
        },
      }).then((r) => r.json());
      if (res.status === 200)
        return { name: res.data.name, status: String(res.data.status) };
    },
  });

  const onSubmit = async (data) => {
    setDisable(true);
    const res = await fetch(`${ApiUrl}/categories/${id}`, {
      method: "PUT",
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
      Navigate("/admin/category");
    } else toast.error(res.message ?? "Something went wrong");
  };

  return (
    <AdminLayout>
      <style>{FORM_CSS}</style>

      <div className="af-header">
        <h1 className="af-title">Edit Category</h1>
        <Link to="/admin/category" className="af-back">
          ← Back
        </Link>
      </div>

      <div className="af-card" style={{ maxWidth: 520 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="af-field">
            <label className="af-label">Category Name</label>
            <input
              className={`af-input${errors.name ? " error" : ""}`}
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
              {disable ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Edit;
