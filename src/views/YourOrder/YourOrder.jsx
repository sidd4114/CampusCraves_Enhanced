'use client';
import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { StoreContext } from '../../context/StoreContext';
import './YourOrder.css';

/* ── Status helpers ──────────────────────────── */
const STATUS_CONFIG = {
  placed:    { label: 'Order Placed',    color: '#c9a96e', bg: 'rgba(201,169,110,0.12)', step: 0 },
  pending:   { label: 'Pending',         color: '#c9a96e', bg: 'rgba(201,169,110,0.12)', step: 0 },
  preordered:{ label: 'Preordered',      color: '#6aa0ff', bg: 'rgba(100,160,255,0.12)', step: 0 },
  accepted:  { label: 'Accepted',        color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', step: 1 },
  cooking:   { label: 'Cooking',         color: '#fb923c', bg: 'rgba(251,146,60,0.12)',  step: 2 },
  ready:     { label: 'Ready for Pickup',color: '#34d399', bg: 'rgba(52,211,153,0.12)',  step: 3 },
  completed: { label: 'Completed',       color: '#60d078', bg: 'rgba(100,210,120,0.12)', step: 4 },
  rejected:  { label: 'Rejected',        color: '#f87171', bg: 'rgba(248,113,113,0.12)', step: -1 },
};

const ORDER_STEPS = ['Order Placed', 'Accepted', 'Cooking', 'Ready for Pickup', 'Completed'];

const getConfig = (status) => STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.placed;

const StatusBadge = ({ status }) => {
  const cfg = getConfig(status);
  return (
    <span className="order-status-badge" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}33` }}>
      {cfg.label}
    </span>
  );
};

const timeAgo = (date) => {
  if (!date) return null;
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const items = order.items || [];
  const total = order.totalPrice ?? items.reduce((sum, i) => sum + (i.totalPrice ?? (i.price ?? 0) * (i.quantity ?? 1)), 0);
  const placedAt = order.orderDate?.toDate?.() ?? null;
  const cfg = getConfig(order.status);
  const step = cfg.step;
  const isRejected = order.status?.toLowerCase() === 'rejected';

  return (
    <div className={`order-card-new ${isRejected ? 'rejected' : step >= 4 ? 'completed' : 'current'}`}>
      <div className="order-card-header" onClick={() => setExpanded(p => !p)}>
        <div className="order-meta">
          <span className="order-id-label">#{order.id.slice(-8).toUpperCase()}</span>
          {placedAt && (
            <span className="order-date">
              {placedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {' · '}
              {placedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              {' · '}
              <span className="order-timeago">{timeAgo(placedAt)}</span>
            </span>
          )}
          <div className="order-items-preview">
            {items.slice(0, 3).map((it, i) => (
              <span key={i} className="order-item-chip">{it.name || '—'} ×{it.quantity ?? 1}</span>
            ))}
            {items.length > 3 && <span className="order-item-chip muted">+{items.length - 3} more</span>}
          </div>
        </div>
        <div className="order-card-right">
          <StatusBadge status={order.status} />
          <span className="order-total-label">₹{total}</span>
          <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Progress tracker — shown only for active (non-rejected) orders */}
      {!isRejected && step < 4 && (
        <div className="order-progress-bar">
          {ORDER_STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className={`op-step ${i <= step ? 'done' : ''}`}>
                <div className="op-dot" />
                <div className="op-label">{s}</div>
              </div>
              {i < ORDER_STEPS.length - 1 && (
                <div className={`op-line ${i < step ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {isRejected && (
        <div className="order-rejected-notice">
          ✕ Your order was rejected by the canteen. Please place a new order.
        </div>
      )}

      {expanded && (
        <div className="order-card-body">
          <table className="order-items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name || '—'}</td>
                  <td>{item.quantity ?? 1}</td>
                  <td>₹{item.price ?? '—'}</td>
                  <td>₹{item.totalPrice ?? (item.price ?? 0) * (item.quantity ?? 1)}</td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="no-items">No item details found</td></tr>
              )}
            </tbody>
            <tfoot>
              <tr className="order-total-row">
                <td colSpan="3">Total</td>
                <td>₹{total}</td>
              </tr>
            </tfoot>
          </table>
          <div className="order-extra-info">
            {order.canteen && <span>Canteen: <strong>{order.canteen}</strong></span>}
            {order.pickupTime && <span>Pickup Time: <strong>{order.pickupTime}</strong></span>}
            {order.queueNumber && <span>Queue: <strong>Queue {order.queueNumber}</strong></span>}
            {order.paymentMethod && <span>Payment: <strong>{order.paymentMethod}</strong></span>}
            {placedAt && <span>Placed: <strong>{placedAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</strong></span>}
          </div>
        </div>
      )}
    </div>
  );
};

const YourOrder = () => {
  const { user, authLoading } = useContext(StoreContext);
  const userId = user?.uid;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    // Wait for Firebase auth to resolve before deciding
    if (authLoading) return;

    const fetchOrders = async () => {
      if (!userId) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }
      setError('');
      setLoading(true);
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        all.sort((a, b) => {
          const ta = a.orderDate?.toDate?.()?.getTime() || 0;
          const tb = b.orderDate?.toDate?.()?.getTime() || 0;
          return tb - ta;
        });
        setOrders(all);
      } catch (err) {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId, authLoading]);

  const ACTIVE_STATUSES = ['placed', 'pending', 'preordered', 'accepted', 'cooking', 'ready', 'rejected'];
  const activeOrders    = orders.filter(o => ACTIVE_STATUSES.includes(o.status?.toLowerCase()));
  const completedOrders = orders.filter(o => o.status?.toLowerCase() === 'completed');

  if (loading) return (
    <div className="your-order-page">
      <div className="yo-loading"><div className="yo-spinner" /><p>Loading your orders…</p></div>
    </div>
  );

  if (error) return (
    <div className="your-order-page">
      <div className="yo-error">{error}</div>
    </div>
  );

  const displayed = activeTab === 'active' ? activeOrders : completedOrders;

  return (
    <div className="your-order-page">
      <div className="yo-header">
        <h1 className="yo-title">My <span>Orders</span></h1>
        <p className="yo-subtitle">Track and review all your campus canteen orders</p>
      </div>

      <div className="yo-stats">
        <div className="yo-stat-card">
          <span className="yo-stat-num">{orders.length}</span>
          <span className="yo-stat-label">Total Orders</span>
        </div>
        <div className="yo-stat-card">
          <span className="yo-stat-num">{activeOrders.length}</span>
          <span className="yo-stat-label">Active</span>
        </div>
        <div className="yo-stat-card">
          <span className="yo-stat-num">{completedOrders.length}</span>
          <span className="yo-stat-label">Completed</span>
        </div>
      </div>

      <div className="yo-tabs">
        <button className={`yo-tab${activeTab === 'active' ? ' active' : ''}`} onClick={() => setActiveTab('active')}>
          Active Orders <span className="yo-tab-count">{activeOrders.length}</span>
        </button>
        <button className={`yo-tab${activeTab === 'completed' ? ' active' : ''}`} onClick={() => setActiveTab('completed')}>
          Completed <span className="yo-tab-count">{completedOrders.length}</span>
        </button>
      </div>

      <div className="yo-orders-list">
        {displayed.length === 0 ? (
          <div className="yo-empty">
            <p>{activeTab === 'active' ? 'No active orders right now.' : 'No completed orders yet.'}</p>
          </div>
        ) : (
          displayed.map(order => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </div>
  );
};

export default YourOrder;
