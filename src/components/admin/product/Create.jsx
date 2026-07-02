import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../../common/AdminLayout";
import { useForm } from "react-hook-form";
import { AdminToken, ApiUrl } from "../../common/Https";
import { toast } from "react-toastify";
import { FORM_CSS } from "../formStyles";

const Create = () => {
  const Navigate = useNavigate();
  const [disable, setDisable] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSizeIds, setSelectedSizeIds] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileRef = useRef();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const h = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${AdminToken()}`,
    };
    fetch(`${ApiUrl}/categories`, { headers: h })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) setCategories(d.data);
      });
    fetch(`${ApiUrl}/brands`, { headers: h })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) setBrands(d.data);
      });
    fetch(`${ApiUrl}/sizes`, { headers: h })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) setSizes(d.data);
      });
    return () => previewUrls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setSelectedImages((p) => [...p, ...files]);
    setPreviewUrls((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeImage = (i) => {
    URL.revokeObjectURL(previewUrls[i]);
    setSelectedImages((p) => p.filter((_, idx) => idx !== i));
    setPreviewUrls((p) => p.filter((_, idx) => idx !== i));
  };

  const toggleSize = (id) => {
    const s = String(id);
    setSelectedSizeIds((p) =>
      p.includes(s) ? p.filter((x) => x !== s) : [...p, s],
    );
  };

  const onSubmit = async (data) => {
    if (selectedImages.length === 0) {
      setError("image", {
        type: "manual",
        message: "Please select at least one image",
      });
      return;
    }
    setDisable(true);
    const fd = new FormData();
    Object.entries(data).forEach(
      ([k, v]) =>
        v !== undefined &&
        fd.append(k === "discount_price" ? "compare_price" : k, v),
    );
    selectedSizeIds.forEach((s) => fd.append("product_sizes[]", s));
    fd.append("image", selectedImages[0]);
    selectedImages.forEach((f) => fd.append("images[]", f));

    const res = await fetch(`${ApiUrl}/Products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AdminToken()}`,
        Accept: "application/json",
      },
      body: fd,
    }).then((r) => r.json());

    setDisable(false);
    if (res.status === 200) {
      toast.success(res.message);
      Navigate("/admin/product");
    } else if (res.status === 400 && res.errors) {
      Object.entries(res.errors).forEach(([k, v]) =>
        setError(k, { type: "server", message: v[0] }),
      );
    } else toast.error("Something went wrong");
  };

  return (
    <AdminLayout>
      <style>{FORM_CSS}</style>

      <div className="af-header">
        <h1 className="af-title">Create Product</h1>
        <Link to="/admin/product" className="af-back">
          ← Back
        </Link>
      </div>

      <div className="af-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic info */}
          <p className="af-section-title">Basic Information</p>
          <div className="af-field">
            <label className="af-label">Product Name</label>
            <input
              className={`af-input${errors.title ? " error" : ""}`}
              placeholder="e.g. Classic White Tee"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="af-error">{errors.title.message}</span>
            )}
          </div>

          <div className="af-grid-2">
            <div className="af-field">
              <label className="af-label">Category</label>
              <select
                className={`af-select${errors.category_id ? " error" : ""}`}
                {...register("category_id", {
                  required: "Category is required",
                })}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <span className="af-error">{errors.category_id.message}</span>
              )}
            </div>
            <div className="af-field">
              <label className="af-label">Brand</label>
              <select className="af-select" {...register("brand_id")}>
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <p className="af-section-title">Pricing</p>
          <div className="af-grid-2">
            <div className="af-field">
              <label className="af-label">Price ($)</label>
              <input
                className={`af-input${errors.price ? " error" : ""}`}
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("price", { required: "Price is required" })}
              />
              {errors.price && (
                <span className="af-error">{errors.price.message}</span>
              )}
            </div>
            <div className="af-field">
              <label className="af-label">
                Compare Price ($){" "}
                <span style={{ color: "#ccc", fontWeight: 400 }}>
                  (optional)
                </span>
              </label>
              <input
                className="af-input"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("discount_price")}
              />
            </div>
          </div>

          {/* Description */}
          <p className="af-section-title">Description</p>
          <div className="af-field">
            <label className="af-label">Short Description</label>
            <textarea
              className={`af-textarea${errors.short_description ? " error" : ""}`}
              rows={2}
              placeholder="Brief summary shown in listings"
              {...register("short_description", {
                required: "Short description is required",
              })}
            />
            {errors.short_description && (
              <span className="af-error">
                {errors.short_description.message}
              </span>
            )}
          </div>
          <div className="af-field">
            <label className="af-label">Full Description</label>
            <textarea
              className={`af-textarea${errors.description ? " error" : ""}`}
              rows={4}
              placeholder="Full product details"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <span className="af-error">{errors.description.message}</span>
            )}
          </div>

          {/* Inventory */}
          <p className="af-section-title">Inventory</p>
          <div className="af-grid-2">
            <div className="af-field">
              <label className="af-label">SKU</label>
              <input
                className={`af-input${errors.sku ? " error" : ""}`}
                placeholder="e.g. TEE-001"
                {...register("sku", { required: "SKU is required" })}
              />
              {errors.sku && (
                <span className="af-error">{errors.sku.message}</span>
              )}
            </div>
            <div className="af-field">
              <label className="af-label">Quantity</label>
              <input
                className={`af-input${errors.qty ? " error" : ""}`}
                type="number"
                placeholder="0"
                {...register("qty", { required: "Quantity is required" })}
              />
              {errors.qty && (
                <span className="af-error">{errors.qty.message}</span>
              )}
            </div>
            <div className="af-field">
              <label className="af-label">
                Barcode{" "}
                <span style={{ color: "#ccc", fontWeight: 400 }}>
                  (optional)
                </span>
              </label>
              <input
                className="af-input"
                placeholder="e.g. 123456789"
                {...register("barcode")}
              />
            </div>
            <div className="af-field">
              <label className="af-label">Status</label>
              <select
                className="af-select"
                {...register("status", { required: true })}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
            </div>
          </div>

          <div className="af-field">
            <label className="af-label">Featured</label>
            <select
              className="af-select"
              style={{ maxWidth: 200 }}
              {...register("is_featured", { required: true })}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

          {/* Sizes */}
          <p className="af-section-title">Available Sizes</p>
          <div className="af-sizes" style={{ marginBottom: 20 }}>
            {sizes.length === 0 ? (
              <span style={{ color: "#bbb", fontSize: "0.85rem" }}>
                No sizes available
              </span>
            ) : (
              sizes.map((s) => (
                <label
                  key={s.id}
                  className={`af-size-chip${selectedSizeIds.includes(String(s.id)) ? " checked" : ""}`}
                >
                  <input
                    type="checkbox"
                    value={s.id}
                    checked={selectedSizeIds.includes(String(s.id))}
                    onChange={() => toggleSize(s.id)}
                  />
                  {s.name}
                </label>
              ))
            )}
          </div>

          {/* Images */}
          <p className="af-section-title">Product Images</p>
          <div
            className="af-upload-zone"
            onClick={() => fileRef.current.click()}
          >
            <div className="af-upload-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="af-upload-text">
              <strong>Click to upload</strong> or drag & drop
            </p>
            <p className="af-upload-text" style={{ fontSize: "0.78rem" }}>
              JPG, PNG — first image becomes the main product image
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpg,image/jpeg,image/png"
              multiple
              className="af-upload-input"
              onChange={handleImageChange}
            />
          </div>
          {errors.image && (
            <span className="af-error" style={{ marginTop: 6 }}>
              {errors.image.message}
            </span>
          )}

          {previewUrls.length > 0 && (
            <div className="af-previews">
              {previewUrls.map((url, i) => (
                <div key={i} className="af-preview-wrap">
                  <img src={url} alt="" className="af-preview-img new-img" />
                  {i === 0 && <span className="af-preview-badge">Main</span>}
                  <button
                    type="button"
                    className="af-preview-remove"
                    onClick={() => removeImage(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="af-footer">
            <button type="submit" className="af-submit-btn" disabled={disable}>
              {disable ? "Saving…" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Create;
