import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ApiUrl, UserToken } from "./common/Https";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [status, setStatus] = useState("checking"); // checking | paid | pending | error

  useEffect(() => {
    if (!orderId) {
      setStatus("error");
      return;
    }

    fetch(`${ApiUrl}/orders/${orderId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${UserToken()}`,
      },
    })
      .then((res) => res.json())
      .then((order) => {
        // Never trust the URL alone — always confirm against the real
        // payment_status stored by the webhook, since anyone could type
        // this URL manually without having actually paid.
        setStatus(order.payment_status === "paid" ? "paid" : "pending");
      })
      .catch(() => setStatus("error"));
  }, [orderId]);

  return (
    <div style={{ maxWidth: 480, margin: "80px auto", textAlign: "center" }}>
      {status === "checking" && <p>Checking your payment status…</p>}

      {status === "paid" && (
        <>
          <h2 style={{ color: "#2e7d32" }}>Payment confirmed 🎉</h2>
          <p>Your order #{orderId} has been paid successfully.</p>
          <Link to="/account/orders">View my orders</Link>
        </>
      )}

      {status === "pending" && (
        <>
          <h2>Payment still processing…</h2>
          <p>
            We haven't received confirmation yet for order #{orderId}. This can
            take a few moments — refresh this page shortly, or check your order
            history.
          </p>
          <Link to="/account/orders">View my orders</Link>
        </>
      )}

      {status === "error" && (
        <>
          <h2>Something went wrong</h2>
          <p>We couldn't verify this order. Please check your order history.</p>
          <Link to="/account/orders">View my orders</Link>
        </>
      )}
    </div>
  );
}
