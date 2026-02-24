'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import '../admin.css';

export default function AdminOrdersPage() {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPendingOrders(all.filter(o => o.status?.toLowerCase() !== 'completed'));
      setCompletedOrders(all.filter(o => o.status?.toLowerCase() === 'completed'));
    } catch (err) {
      toast.error('Failed to fetch orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'Completed' });
      toast.success('Order marked as completed!');
      fetchOrders();
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) return <p style={{ color: '#888', fontFamily: 'sans-serif' }}>Loading orders…</p>;

  return (
    <div>
      <h1 className="admin-page-title">Orders</h1>
      <p className="admin-page-sub">Manage all incoming and completed canteen orders</p>

      {/* Pending */}
      <div className="admin-orders-section">
        <h2 className="admin-section-title">
          Pending Orders <span>{pendingOrders.length}</span>
        </h2>
        {pendingOrders.length === 0 ? (
          <div className="admin-no-data">No pending orders 🎉</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>#{order.id.slice(-8).toUpperCase()}</td>
                    <td>{order.userName || order.userId?.slice(0, 8) || '—'}</td>
                    <td>{order.items?.map(i => `${i.name || '—'} ×${i.quantity || 1}`).join(', ') || '—'}</td>
                    <td>₹{order.totalPrice ?? '—'}</td>
                    <td><span className="admin-badge-pending">{order.status || 'Placed'}</span></td>
                    <td>
                      <button className="admin-done-btn" onClick={() => markAsCompleted(order.id)}>
                        Mark Complete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Completed */}
      <div className="admin-orders-section">
        <h2 className="admin-section-title">
          Completed Orders <span>{completedOrders.length}</span>
        </h2>
        {completedOrders.length === 0 ? (
          <div className="admin-no-data">No completed orders yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {completedOrders.map(order => (
                  <tr key={order.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>#{order.id.slice(-8).toUpperCase()}</td>
                    <td>{order.userName || order.userId?.slice(0, 8) || '—'}</td>
                    <td>{order.items?.map(i => `${i.name || '—'} ×${i.quantity || 1}`).join(', ') || '—'}</td>
                    <td>₹{order.totalPrice ?? '—'}</td>
                    <td><span className="admin-badge-completed">Completed</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
