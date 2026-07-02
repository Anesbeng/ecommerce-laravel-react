import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // ADDED: needed to redirect after a successful order
import Layout from "./common/Layout";
import { CartContext } from "./context/cart";
import { useForm } from "react-hook-form";
import { UserToken, ApiUrl } from "./common/Https";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cartItems, finalTotal, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false); // FIX 1: prevent double submit
  const navigate = useNavigate(); // ADDED

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // This runs when the form is valid and submitted
  const submit = (data) => {
    saveOrder(data, "not_paid");
  };

  const saveOrder = async (data, payment_status) => {
    console.log("CART:", JSON.stringify(cartItems, null, 2));
    // FIX 2: guard — don't submit if cart is empty
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true); // disable the button while request is running

    // FIX 3: build the payload correctly so it matches what Laravel expects
    const orderData = {
      // shipping fields from the form
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,

      // order meta
      status: "pending", // "not_paid"
      payment_status,
      subtotal: finalTotal(),
      grand_total: finalTotal(),
      shipping: 0,
      discount: 0,

      // FIX 4: key must be "cart" (not "items"), fields must match Laravel
      // React maps it:
      cart: cartItems.map((item) => ({
        product_id: item.productId,
        name: item.title,
        size: item.size.name, // "XL" — plain string
        qty: item.qty,
        unit_price: Number(item.price),
        price: Number(item.price) * item.qty,
      })),
    };

    try {
      const res = await fetch(`${ApiUrl}/save-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${UserToken()}`,
        },
        body: JSON.stringify(orderData),
      });

      // FIX 5: read as text first so we never crash on HTML error pages
      const text = await res.text();

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        // Server returned HTML (Laravel error page) — show the raw message in console
        console.error("Server returned non-JSON response:", text);
        toast.error("Server error. Check console or laravel.log for details.");
        return;
      }

      if (result.status === "200") {
        toast.success("Order placed successfully!");
        // Send notification to Make webhook
        fetch("https://hook.eu1.make.com/nst8c97bagcibghw2aqnu8u55hfov573", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            address: data.address,
            city: data.city,
            total: finalTotal(),
          }),
        });
        fetch("https://hook.eu1.make.com/ygibcjr5y2l40hfnfeijv8ninef1pg26", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            mobile: data.mobile,
            address: data.address,
            city: data.city,
            total: finalTotal(),
          }),
        });
        // ADDED: redirect to the confirmation page, carrying the order
        // details along so it can be rendered there.
        navigate("/Confirmation", {
          state: {
            // ADDED: the backend doesn't return an order id/date yet, so
            // these are generated here just for display. Swap orderId for
            // a real one once the API returns it in the response.
            orderId: Date.now().toString().slice(-6),
            orderDate: new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            status: "Pending",
            paymentMethod:
              data.payment_method === "cod"
                ? "Cash on Delivery"
                : "Credit Card",
            name: data.name,
            email: data.email,
            address: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip,
            items: cartItems,
            total: finalTotal(),
          },
        });
        clearCart(); // clear the cart after successful order
      } else {
        toast.error(result.message || "Failed to place order.");
      }
    } catch (err) {
      // Network error (no internet, server down, etc.)
      console.error("Network error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false); // always re-enable the button
    }
  };

  return (
    <Layout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        body { font-family: 'DM Sans', sans-serif; background: #faf9f7; }

        .cart-table-header {
          display: grid;
          grid-template-columns: 80px 1fr 120px 130px 110px 80px;
          gap: 12px;
          padding: 0 20px 12px;
          border-bottom: 1.5px solid #e8e4de;
          font-size: 0.72rem;
          font-weight: 500;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 80px 1fr 120px 130px 110px 80px;
          gap: 12px;
          align-items: center;
          padding: 16px 20px;
          background: #fff;
          margin-bottom: 4px;
          border-radius: 12px;
          border: 1px solid #eeebe5;
        }

        .cart-item-img {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          object-fit: cover;
          background: #f0ede8;
        }

        .cart-item-title {
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 4px;
        }

        .cart-item-sku { font-size: 0.75rem; color: #bbb; }

        .size-badge {
          display: inline-block;
          padding: 3px 12px;
          border: 1.5px solid #d4cfc8;
          border-radius: 20px;
          font-size: 0.75rem;
          color: #555;
          background: #faf9f7;
        }

        .summary-panel {
          background: #fff;
          border-radius: 16px;
          padding: 28px;
          border: 1px solid #eeebe5;
          position: sticky;
          top: 24px;
        }

        .summary-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid #eeebe5;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 0.9rem;
          color: #666;
        }

        .summary-row.total {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1.5px solid #e8e4de;
          margin-bottom: 0;
        }

        .pay-btn {
          width: 100%;
          padding: 13px;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 20px;
          transition: background 0.2s;
        }

        .pay-btn:hover:not(:disabled) { background: #333; }
        .pay-btn:disabled { background: #999; cursor: not-allowed; }

        .empty-cart {
          text-align: center;
          padding: 60px 20px;
          color: #bbb;
        }

        .empty-cart p {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: #aaa;
          margin-top: 12px;
        }
      `}</style>

      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Checkout
            </li>
          </ol>
        </nav>

        {/* FIX 6: Only ONE <form> tag — the outer one handles submission */}
        <form onSubmit={handleSubmit(submit)}>
          <div className="row g-4">
            {/* ── LEFT: Shipping form ── */}
            <div className="col-lg-4">
              <h3 className="mb-4">
                <strong>Shipping Information</strong>
              </h3>

              <div className="row g-3">
                {/* Name */}
                <div className="col-12">
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Full Name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                      {errors.name.message}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="col-12">
                  <input
                    type="email"
                    className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Email Address"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                {/* Mobile — FIX 7: field name is "mobile" to match Laravel */}
                <div className="col-12">
                  <input
                    type="tel"
                    className={`form-control form-control-lg ${errors.mobile ? "is-invalid" : ""}`}
                    placeholder="Phone Number"
                    {...register("mobile", {
                      required: "Phone number is required",
                    })}
                  />
                  {errors.mobile && (
                    <div className="invalid-feedback">
                      {errors.mobile.message}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="col-12">
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.address ? "is-invalid" : ""}`}
                    placeholder="Address"
                    {...register("address", {
                      required: "Address is required",
                    })}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">
                      {errors.address.message}
                    </div>
                  )}
                </div>

                {/* City */}
                <div className="col-md-6">
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.city ? "is-invalid" : ""}`}
                    placeholder="City"
                    {...register("city", { required: "City is required" })}
                  />
                  {errors.city && (
                    <div className="invalid-feedback">
                      {errors.city.message}
                    </div>
                  )}
                </div>

                {/* State */}
                <div className="col-md-6">
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.state ? "is-invalid" : ""}`}
                    placeholder="State"
                    {...register("state", { required: "State is required" })}
                  />
                  {errors.state && (
                    <div className="invalid-feedback">
                      {errors.state.message}
                    </div>
                  )}
                </div>

                {/* Zip */}
                <div className="col-12">
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.zip ? "is-invalid" : ""}`}
                    placeholder="ZIP Code"
                    {...register("zip", { required: "ZIP code is required" })}
                  />
                  {errors.zip && (
                    <div className="invalid-feedback">{errors.zip.message}</div>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <h3 className="border-bottom pb-2 mb-3 mt-4">
                <strong>Payment Method</strong>
              </h3>
              <div className="d-flex gap-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="credit-card"
                    value="credit_card"
                    defaultChecked
                    {...register("payment_method")}
                  />
                  <label className="form-check-label" htmlFor="credit-card">
                    Credit Card
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    id="cod"
                    value="cod"
                    {...register("payment_method")}
                  />
                  <label className="form-check-label" htmlFor="cod">
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order summary ── */}
            <div className="col-lg-8">
              <h3 className="mb-4">
                <strong>Order Summary</strong>
              </h3>

              {cartItems && cartItems.length > 0 ? (
                <>
                  {/* Table header */}
                  <div className="cart-table-header">
                    <div></div>
                    <div>Product</div>
                    <div>Price</div>
                    <div>Size</div>
                    <div>Qty</div>
                    <div>Subtotal</div>
                  </div>

                  {/* FIX 8: No <div> inside <tbody> — just use divs outside table entirely */}
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="cart-item-img"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }} // FIX 9: broken image fallback
                      />
                      <div>
                        <p className="cart-item-title">{item.title}</p>
                        <span className="cart-item-sku">
                          ID: {item.productId}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.95rem", color: "#444" }}>
                        ${Number(item.price).toFixed(2)}
                      </div>
                      <div>
                        <span className="size-badge">
                          {item.size ? item.size.name : "N/A"}
                        </span>
                      </div>
                      <div style={{ fontWeight: 600 }}>{item.qty}</div>
                      <div style={{ fontWeight: 600, color: "#1a1a1a" }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  {/* Summary panel */}
                  <div className="summary-panel mt-4">
                    <div className="summary-title">Price Breakdown</div>
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span>${finalTotal().toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span style={{ color: "#22c55e", fontWeight: 500 }}>
                        Free
                      </span>
                    </div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>${finalTotal().toFixed(2)}</span>
                    </div>

                    {/* FIX 10: button is inside the form so it submits properly */}
                    <button
                      type="submit"
                      className="pay-btn"
                      disabled={loading}
                    >
                      {loading ? "Placing Order…" : "Place Order"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="empty-cart">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    fill="#ccc"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                  </svg>
                  <p>Your cart is empty</p>
                  <a
                    href="/shop"
                    style={{ color: "#1a1a1a", fontSize: "0.85rem" }}
                  >
                    Browse products →
                  </a>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
