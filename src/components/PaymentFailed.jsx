import { useSearchParams, Link } from "react-router-dom";

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div style={{ maxWidth: 480, margin: "80px auto", textAlign: "center" }}>
      <h2 style={{ color: "#c62828" }}>Payment not completed</h2>
      <p>
        Your payment for order #{orderId} was not completed. The items have been
        released back into stock — feel free to try again.
      </p>
      <Link to="/Shop">Back to shop</Link>
    </div>
  );
}
