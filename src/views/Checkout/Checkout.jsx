'use client';
import { useState, useContext, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import { placeOrder } from "../../functions/placeorder";
import './Checkout.css';
import { useRouter } from "next/navigation";
import { getQueueCounts } from "../../functions/getQueueCounts";
import { doc,updateDoc } from "firebase/firestore";
import { db } from "../../Components/firebase";

const Checkout = () => {
  const { user, foodList, cartItems, getTotalCartAmount, setCartItems } = useContext(StoreContext);
  const [orderType, setOrderType] = useState("instant");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  
  useEffect(() => {
    const loadRazorpay = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("✅ Razorpay script loaded!");
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 2);

  const handleSubmit = async () => {
    if (isProcessing) return;
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }
    if (orderType === "preorder" && (!pickupDate || !pickupTime)) {
      alert("Please select both a pickup date and time for preorder!");
      return;
    }
    if (Object.keys(cartItems).length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsProcessing(true);
    try {
      const totalAmount = getTotalCartAmount();
      const queueCounts = await getQueueCounts();
      const suggestedQueue = Object.keys(queueCounts).reduce((a, b) =>
          queueCounts[a] < queueCounts[b] ? a : b
      );

      // Step 1: Create Razorpay order on backend
      const response = await fetch(`${BACKEND_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalAmount }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert(err.message || "Failed to create order. Please try again.");
        setIsProcessing(false);
        return;
      }

      const orderData = await response.json();
      if (!orderData?.orderId) {
        alert("Failed to initialise payment. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Step 2: Open Razorpay modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Campus Craves",
        description: "Food Order Payment",
        order_id: orderData.orderId,
        handler: async function (paymentResponse) {
          try {
            // Step 3: Verify payment server-side
            const verifyRes = await fetch(`${BACKEND_URL}/api/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpayOrderId:   paymentResponse.razorpay_order_id,
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              alert("Payment verification failed. Your money is safe — please contact support.");
              setIsProcessing(false);
              return;
            }

            // Step 4: Increment queue ONLY after verified payment
            const queueRef = doc(db, "queues", `queue${suggestedQueue}`);
            await updateDoc(queueRef, { count: queueCounts[suggestedQueue] + 1 });

            // Step 5: Save order to Firestore
            const result = await placeOrder(
              user.uid,
              orderType,
              "Razorpay",
              cartItems,
              pickupDate,
              pickupTime,
              suggestedQueue,
            );

            if (result?.id) {
              setCartItems({});
              sessionStorage.setItem('orderDetails', JSON.stringify({
                orderId: result.id,
                paymentId: paymentResponse.razorpay_payment_id,
                amount: totalAmount,
                paymentMethod: "Razorpay",
                queueNumber: suggestedQueue,
              }));
              router.push("/thank-you");
            } else {
              alert("Payment was taken but order creation failed. Please contact support with payment ID: " + paymentResponse.razorpay_payment_id);
              setIsProcessing(false);
            }
          } catch (err) {
            console.error("❌ Post-payment error:", err);
            alert("Something went wrong after payment. Please contact support.");
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            // User closed the modal — allow them to retry
            setIsProcessing(false);
          },
        },
        theme: { color: "#c9a96e" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (failureResponse) => {
        console.error("❌ Payment failed:", failureResponse.error);
        alert(`Payment failed: ${failureResponse.error.description}. Please try again.`);
        setIsProcessing(false);
      });
      rzp.open();

    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
      alert("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="cart-summary">
        <h3>Order Summary</h3>
        {Object.keys(cartItems).length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {Object.keys(cartItems).map((itemId) => {
                const item = foodList.find((product) => product._id === itemId);
                if (!item) return null;
                return (
                  <li key={itemId}>
                    <span className="summary-item-name">{item.name} <span className="summary-qty">×{cartItems[itemId]}</span></span>
                    <span className="summary-item-price">₹{item.price * cartItems[itemId]}</span>
                  </li>
                );
              })}
            </ul>
            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{getTotalCartAmount()}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹20</span>
              </div>
              <div className="summary-row">
                <span>GST (5%)</span>
                <span>₹{Math.round(getTotalCartAmount() * 0.05)}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Grand Total</span>
                <span>₹{getTotalCartAmount() + 20 + Math.round(getTotalCartAmount() * 0.05)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="option-group">
        <label>Order Type:</label>
        <div className="button-group">
          <button
            className={orderType === "instant" ? "selected" : ""}
            onClick={() => setOrderType("instant")}
          >
            Instant Order
          </button>
          <button
            className={orderType === "preorder" ? "selected" : ""}
            onClick={() => setOrderType("preorder")}
          >
            Preorder
          </button>
        </div>
      </div>
      {orderType === "preorder" && (
        <>
          <div className="option-group">
            <label>Pickup Date:</label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={today.toISOString().split("T")[0]}
              max={maxDate.toISOString().split("T")[0]}
            />
          </div>
          <div className="option-group">
            <label>Pickup Time:</label>
            <input
              type="time"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="option-group payment-info">
        <label>Payment</label>
        <p className="payment-note">Secure payment via Razorpay — UPI, cards, netbanking &amp; wallets supported.</p>
      </div>

      <button
        className="place-order-btn"
        onClick={handleSubmit}
        disabled={isProcessing || Object.keys(cartItems).length === 0}
      >
        {isProcessing ? "Processing…" : `Pay ₹${getTotalCartAmount() + 20 + Math.round(getTotalCartAmount() * 0.05)}`}
      </button>
    </div>
  );
};

export default Checkout;
