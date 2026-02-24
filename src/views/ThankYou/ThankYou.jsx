'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import './ThankYou.css';

const STAGES = [
  { label: "Order Placed",     icon: "", triggerAt: 0 },
  { label: "Preparing",        icon: "", triggerAt: 3 * 60 },
  { label: "Almost Ready",     icon: "", triggerAt: 10 * 60 },
  { label: "Ready for Pickup", icon: "", triggerAt: 20 * 60 },
];

const TOTAL_SECONDS = 20 * 60;

const ThankYou = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem('orderDetails');
    if (stored) {
      const parsed = JSON.parse(stored);
      setOrderDetails(parsed);
      sessionStorage.removeItem('orderDetails');

      if (parsed.orderType === "preorder" && parsed.pickupDate && parsed.pickupTime) {
        const pickupMs = new Date(`${parsed.pickupDate}T${parsed.pickupTime}`).getTime();
        const diffS = Math.max(0, Math.floor((pickupMs - Date.now()) / 1000));
        setSecondsLeft(diffS);
      }
    }
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        const next = Math.max(0, s - 1);
        const elapsed = TOTAL_SECONDS - next;
        const stage = STAGES.reduce((acc, st, i) => (elapsed >= st.triggerAt ? i : acc), 0);
        setCurrentStage(stage);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const progressPct = Math.min(100, ((TOTAL_SECONDS - secondsLeft) / TOTAL_SECONDS) * 100);

  const formatDateTime = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div className="ty-page">
      <div className="ty-card">

        {/*  Header  */}
        <div className="ty-header">
          <div className="ty-check"></div>
          <h1>Order Confirmed!</h1>
          <p className="ty-subtitle">Your food is being prepared fresh for you.</p>
        </div>

        {/*  Timer  */}
        {orderDetails && (
          <div className="ty-timer-section">
            <div className="ty-stage-label">
              {secondsLeft > 0
                ? `${STAGES[currentStage].icon}\u2002${STAGES[currentStage].label}`
                : "\u2002Ready for Pickup!"}
            </div>

            <div className="ty-progress-track">
              <div className="ty-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>

            <div className="ty-stages">
              {STAGES.map((st, i) => (
                <div key={i} className={`ty-stage-dot-wrap ${i <= currentStage ? "active" : ""}`}>
                  <div className="ty-dot" />
                  <div className="ty-dot-label">{st.label}</div>
                </div>
              ))}
            </div>

            <div className="ty-countdown">
              {secondsLeft > 0
                ? (orderDetails.orderType === "preorder"
                    ? `Pickup at ${orderDetails.pickupTime} on ${orderDetails.pickupDate}`
                    : `Estimated time: ${formatTime(secondsLeft)}`)
                : "Head over to the counter!"}
            </div>
          </div>
        )}

        {/*  Receipt  */}
        {orderDetails ? (
          <div className="ty-receipt">
            <div className="ty-receipt-header">
              <span> Order Receipt</span>
              <span className="ty-badge">Paid </span>
            </div>

            <div className="ty-meta-grid">
              <div className="ty-meta-row"><span>Order ID</span><strong>{orderDetails.orderId}</strong></div>
              <div className="ty-meta-row"><span>Payment ID</span><strong className="ty-small">{orderDetails.paymentId}</strong></div>
              <div className="ty-meta-row"><span>Placed At</span><strong>{formatDateTime(orderDetails.placedAt)}</strong></div>
              <div className="ty-meta-row"><span>Queue</span><strong>Queue {orderDetails.queueNumber}</strong></div>
              <div className="ty-meta-row"><span>Order Type</span><strong className="ty-capitalize">{orderDetails.orderType}</strong></div>
              <div className="ty-meta-row"><span>Payment</span><strong>{orderDetails.paymentMethod}</strong></div>
            </div>

            {orderDetails.items && orderDetails.items.length > 0 && (
              <table className="ty-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.name}</td>
                      <td className="center">{it.qty}</td>
                      <td className="right">{it.price}</td>
                      <td className="right">{it.price * it.qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="ty-totals">
              <div className="ty-totals-row"><span>Subtotal</span><span>{Number(orderDetails.amount).toFixed(2)}</span></div>
              <div className="ty-totals-row"><span>Delivery Fee</span><span>20.00</span></div>
              <div className="ty-totals-row"><span>GST (5%)</span><span>{Math.round(orderDetails.amount * 0.05).toFixed(2)}</span></div>
              <div className="ty-totals-row ty-grand-total">
                <span>Grand Total</span>
                <span>{orderDetails.grandTotal
                  ? Number(orderDetails.grandTotal).toFixed(2)
                  : (orderDetails.amount + 20 + Math.round(orderDetails.amount * 0.05)).toFixed(2)}
                </span>
              </div>
            </div>

            <p className="ty-queue-notice"> Collect from <strong>Queue {orderDetails.queueNumber}</strong></p>
          </div>
        ) : (
          <p className="ty-no-order">No order details found.</p>
        )}

        <div className="ty-actions">
          <button className="ty-btn-primary" onClick={() => router.push("/home")}>Back to Home</button>
          <button className="ty-btn-secondary" onClick={() => window.print()}> Print Receipt</button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
