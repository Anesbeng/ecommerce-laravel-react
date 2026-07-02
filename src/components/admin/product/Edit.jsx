import { useEffect, useState, useRef } from "react";
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
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSizeIds, setSelectedSizeIds] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const fileRef = useRef();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm();

  const authH = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${AdminToken()}`,
  };

  useEffect(() => {
    fetch(`${ApiUrl}/categories`, { headers: authH })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) setCategories(d.data);
      });
    fetch(`${ApiUrl}/brands`, { headers: authH })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) setBrands(d.data);
      });
    fetch(`${ApiUrl}/sizes`, { headers: authH })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) setSizes(d.data);
      });

    fetch(`${ApiUrl}/Products/${id}`, { headers: authH })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === 200) {
          const p = d.product;
          setValue("title", p.title);
          setValue("description", p.description);
          setValue("short_description", p.short_description);
          setValue("price", p.price);
          setValue("discount_price", p.compare_price);
          setValue("category_id", p.category_id);
          setValue("brand_id", p.brand_id);
          setValue("sku", p.sku);
          setValue("qty", p.qty);
          setValue("status", String(p.status));
          setValue("barcode", p.barcode);
          setValue("is_featured", String(p.is_featured));
          if (p.sizes) setSelectedSizeIds(p.sizes.map((s) => String(s.id)));
          if (p.images?.length) setCurrentImages(p.images.map((i) => i.image));
          else if (p.image) setCurrentImages([p.image]);
        } else {
          toast.error("Product not found");
          Navigate("/admin/product");
        }
      });

    return () => newPreviews.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const imageUrl = (f) =>
    `${ApiUrl.replace("/api", "")}/uploads/product/small/${f}`;

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setNewFiles((p) => [...p, ...files]);
    setNewPreviews((p) => [...p, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeNewImage = (i) => {
    URL.revokeObjectURL(newPreviews[i]);
    setNewFiles((p) => p.filter((_, idx) => idx !== i));
    setNewPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const removeCurrentImage = (filename) => {
    setRemovedImages((p) => [...p, filename]);
    setCurrentImages((p) => p.filter((f) => f !== filename));
  };

  const toggleSize = (sid) => {
    const s = String(sid);
    setSelectedSizeIds((p) =>
      p.includes(s) ? p.filter((x) => x !== s) : [...p, s],
    );
  };

  const onSubmit = async (data) => {
    setDisable(true);
    const fd = new FormData();
    Object.entries(data).forEach(
      ([k, v]) =>
        v !== undefined &&
        fd.append(k === "discount_price" ? "compare_price" : k, v),
    );
    selectedSizeIds.forEach((s) => fd.append("product_sizes[]", s));
    newFiles.forEach((f) => fd.append("images[]", f));
    removedImages.forEach((n) => fd.append("removed_images[]", n));
    currentImages.forEach((n) => fd.append("kept_images[]", n));
    fd.append("_method", "PUT");

    const res = await fetch(`${ApiUrl}/Products/${id}`, {
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
        <h1 className="af-title">Edit Product</h1>
        <Link to="/admin/product" className="af-back">
          ← Back
        </Link>
      </div>

      <div className="af-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="af-section-title">Basic Information</p>
          <div className="af-field">
            <label className="af-label">Product Name</label>
            <input
              className={`af-input${errors.title ? " error" : ""}`}
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

          <p className="af-section-title">Pricing</p>
          <div className="af-grid-2">
            <div className="af-field">
              <label className="af-label">Price ($)</label>
              <input
                className={`af-input${errors.price ? " error" : ""}`}
                type="number"
                step="0.01"
                {...register("price", { required: "Price is required" })}
              />
              {errors.price && (
                <span className="af-error">{errors.price.message}</span>
              )}
            </div>
            <div className="af-field">
              <label className="af-label">Compare Price ($)</label>
              <input
                className="af-input"
                type="number"
                step="0.01"
                {...register("discount_price")}
              />
            </div>
          </div>

          <p className="af-section-title">Description</p>
          <div className="af-field">
            <label className="af-label">Short Description</label>
            <textarea
              className={`af-textarea${errors.short_description ? " error" : ""}`}
              rows={2}
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
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <span className="af-error">{errors.description.message}</span>
            )}
          </div>

          <p className="af-section-title">Inventory</p>
          <div className="af-grid-2">
            <div className="af-field">
              <label className="af-label">SKU</label>
              <input
                className={`af-input${errors.sku ? " error" : ""}`}
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
                {...register("qty", { required: "Quantity is required" })}
              />
              {errors.qty && (
                <span className="af-error">{errors.qty.message}</span>
              )}
            </div>
            <div className="af-field">
              <label className="af-label">Barcode</label>
              <input className="af-input" {...register("barcode")} />
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

          <div className="af-field" style={{ maxWidth: 200 }}>
            <label className="af-label">Featured</label>
            <select
              className="af-select"
              {...register("is_featured", { required: true })}
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>

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
                    checked={selectedSizeIds.includes(String(s.id))}
                    onChange={() => toggleSize(s.id)}
                  />
                  {s.name}
                </label>
              ))
            )}
          </div>

          <p className="af-section-title">Product Images</p>

          {/* Saved images */}
          {currentImages.length > 0 && (
            <>
              <p
                style={{ fontSize: "0.78rem", color: "#aaa", marginBottom: 10 }}
              >
                Saved — click ✕ to remove
              </p>
              <div className="af-previews" style={{ marginBottom: 16 }}>
                {currentImages.map((f, i) => (
                  <div key={f} className="af-preview-wrap">
                    <img src={imageUrl(f)} alt="" className="af-preview-img" />
                    {i === 0 && <span className="af-preview-badge">Main</span>}
                    <button
                      type="button"
                      className="af-preview-remove"
                      onClick={() => removeCurrentImage(f)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* New images */}
          {newPreviews.length > 0 && (
            <>
              <p
                style={{ fontSize: "0.78rem", color: "#aaa", marginBottom: 10 }}
              >
                New — not yet uploaded
              </p>
              <div className="af-previews" style={{ marginBottom: 16 }}>
                {newPreviews.map((url, i) => (
                  <div key={i} className="af-preview-wrap">
                    <img src={url} alt="" className="af-preview-img new-img" />
                    <button
                      type="button"
                      className="af-preview-remove"
                      onClick={() => removeNewImage(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          <div
            className="af-upload-zone"
            onClick={() => fileRef.current.click()}
          >
            <div className="af-upload-icon">
              <svg
                width="28"
                height="28"
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
              <strong>Click to add more images</strong>
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

          <div className="af-footer">
            <button type="submit" className="af-submit-btn" disabled={disable}>
              {disable ? "Saving…" : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Edit;
