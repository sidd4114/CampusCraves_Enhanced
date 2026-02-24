import React, { useEffect, useState } from "react";
import { db } from "../../../src/Components/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./Order.css";

const Orders = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);

  // Fetch orders from Firestore
  const fetchOrders = async () => {
    try {
      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const pending = ordersList.filter(order => order.status !== "Completed");
      const completed = ordersList.filter(order => order.status === "Completed");

      setPendingOrders(pending);
      setCompletedOrders(completed);
    } catch (error) {
      toast.error("Error fetching orders: " + error.message);
    }
  };

  // Mark an order as completed
  const markAsCompleted = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: "Completed" });
      toast.success("Order marked as completed!");
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast.error("Error updating order: " + error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="orders">
      <h2>Orders List</h2>

      {/* Pending Orders Section */}
      <div className="section">
        <h3>Pending Orders</h3>
        {pendingOrders.length === 0 ? (
          <p className="no-orders">No pending orders.</p>
        ) : (
          <div className="orders-table">
            <div className="orders-header">
              <b>Order ID</b>
              <b>Items</b>
              <b>Total Price</b>
              <b>Action</b>
            </div>
            {pendingOrders.map((order) => (
              <div key={order.id} className="orders-row">
                <p>{order.id}</p>
                <p>{order.items?.map((item) => item.name).join(", ") || 'No items'}</p>
                <p>₹{order.totalPrice || '0'}</p>
                <button
                  onClick={() => markAsCompleted(order.id)}
                  className="done-btn"
                >
                  Mark as Completed
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Orders Section */}
      <div className="section">
        <h3>Completed Orders</h3>
        {completedOrders.length === 0 ? (
          <p className="no-orders">No completed orders yet.</p>
        ) : (
          <div className="orders-table">
            <div className="orders-header">
              <b>Order ID</b>
              <b>Items</b>
              <b>Total Price</b>
              <b>Status</b>
            </div>
            {completedOrders.map((order) => (
              <div key={order.id} className="orders-row">
                <p>{order.id}</p>
                <p>{order.items?.map((item) => item.name).join(", ") || 'No items'}</p>
                <p>₹{order.totalPrice || '0'}</p>
                <p className="completed">Completed</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
