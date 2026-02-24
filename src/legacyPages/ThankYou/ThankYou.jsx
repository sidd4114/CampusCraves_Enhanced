'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ThankYou = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('orderDetails');
    if (stored) {
      setOrderDetails(JSON.parse(stored));
      sessionStorage.removeItem('orderDetails');
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Thank You for Your Order</h1>
        <p style={styles.subtitle}>We appreciate your trust in us.</p>

        {orderDetails ? (
          <div style={styles.receipt}>
            <h2 style={styles.receiptTitle}>Order Receipt</h2>
            <div style={styles.details}>
              <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
              <p><strong>Payment ID:</strong> {orderDetails.paymentId}</p>
              <p><strong>Amount Paid:</strong> ₹{(orderDetails.amount).toFixed(2)}</p>
              <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>
              <p><strong>Status:</strong> <span style={styles.successText}>Successful</span></p>
              <h3 style={styles.queueText}>Collect your order from <strong>Queue {orderDetails?.queueNumber}</strong></h3>
            </div>
          </div>
        ) : (
          <p style={styles.errorText}>No order details found.</p>
        )}

        <button 
          style={styles.button} 
          onClick={() => router.push("/home")}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8f9fa",  // Soft neutral background for a professional look
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    textAlign: "center",
    maxWidth: "450px",
    width: "90%",
    borderTop: "4px solid #28a745",  // Professional highlight for success
  },
  title: {
    fontSize: "28px",
    color: "#212529",
    fontWeight: "700",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6c757d",
    marginBottom: "25px",
  },
  receipt: {
    backgroundColor: "#f3f4f6",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "left",
    border: "2px solid #28a745",
    marginBottom: "20px",
  },
  receiptTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "15px",
    borderBottom: "2px solid #28a745",
    paddingBottom: "5px",
  },
  details: {
    lineHeight: "1.8",
    fontSize: "15px",
    color: "#495057",
  },
  queueText: {
    color: "#28a745",
    fontWeight: "600",
    marginTop: "10px",
    fontSize: "16px",
  },
  successText: {
    color: "#28a745",
    fontWeight: "bold",
  },
  errorText: {
    color: "#dc3545",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    border: "none",
    padding: "12px 28px",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
    boxShadow: "0 4px 10px rgba(0, 123, 255, 0.2)",
  },
};

export default ThankYou;
