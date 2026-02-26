'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import '../admin.css';

/* ── Status pipeline ───────────────────────────────────── */
const STATUS_FLOW = {
  placed:    { label: 'Order Placed',     color: '#c9a96e', next: ['accepted', 'rejected'] },
  pending:   { label: 'Pending',          color: '#c9a96e', next: ['accepted', 'rejected'] },
  preordered:{ label: 'Preordered',       color: '#6aa0ff', next: ['accepted', 'rejected'] },
  accepted:  { label: 'Accepted',         color: '#a78bfa', next: ['cooking'] },
  cooking:   { label: 'Cooking',          color: '#fb923c', next: ['ready'] },
  ready:     { label: 'Ready for Pickup', color: '#34d399', next: ['completed'] },
  completed: { label: 'Completed',        color: '#60d078', next: [] },
  rejected:  { label: 'Rejected',         color: '#f87171', next: [] },
};

const ACTION_LABELS = {
  accepted:  { label: 'Accept Order',      icon: '✓', cls: 'btn-accept'   },
  rejected:  { label: 'Reject Order',      icon: '✕', cls: 'btn-reject'   },
  cooking:   { label: 'Start Cooking',     icon: '🍳', cls: 'btn-cooking'  },
  ready:     { label: 'Mark Ready',        icon: '🔔', cls: 'btn-ready'    },
  completed: { label: 'Mark Completed',    icon: '✓', cls: 'btn-complete'  },
};

const PIPELINE_STEPS = ['placed', 'accepted', 'cooking', 'ready', 'completed'];

const getStepIndex = (status) => {
  const s = status?.toLowerCase();
  if (s === 'pending' || s === 'preordered') return 0;
  return PIPELINE_STEPS.indexOf(s);
};

const formatDate = (ts) => {
  if (!ts) return '—';
  const d = ts?.toDate?.() ?? new Date(ts);
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

/* ── Order Status Badge ────────────────────────────────── */
const AdminBadge = ({ status }) => {
  const cfg = STATUS_FLOW[status?.toLowerCase()] ?? STATUS_FLOW.placed;
  return (
    <span className="ao-badge" style={{ color: cfg.color, borderColor: `${cfg.color}44`, background: `${cfg.color}14` }}>
      {cfg.label}
    </span>
  );
};

/* ── Mini progress pipeline ────────────────────────────── */
const PipelineBar = ({ status }) => {
  const current = getStepIndex(status);
  return (
    <div className="ao-pipeline">
      {PIPELINE_STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className={`ao-pip-dot ${i <= current ? 'done' : ''} ${i === current ? 'active' : ''}`} title={STATUS_FLOW[step]?.label} />
          {i < PIPELINE_STEPS.length - 1 && <div className={`ao-pip-line ${i < current ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ── Order Card ────────────────────────────────────────── */
const OrderCard = ({ order, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const s = order.status?.toLowerCase() ?? 'placed';
  const nextStatuses = STATUS_FLOW[s]?.next ?? [];
  const items = order.items || [];
  const total = order.totalPrice ?? '—';
  const isRejected = s === 'rejected';
  const isCompleted = s === 'completed';

  const updateStatus = async (newStatus) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'orders', order.id), { status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1) });
      toast.success(`Order ${ACTION_LABELS[newStatus]?.label ?? newStatus}!`);
      onUpdate();
    } catch (err) {
      toast.error('Update failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`ao-card ${isRejected ? 'ao-rejected' : isCompleted ? 'ao-completed' : 'ao-active'}`}>
      {/* Header row */}
      <div className="ao-card-header" onClick={() => setExpanded(p => !p)}>
        <div className="ao-card-left">
          <span className="ao-order-id">#{order.id.slice(-8).toUpperCase()}</span>
          <span className="ao-customer">{order.userName || order.userId?.slice(0, 10) || '—'}</span>
          {order.queueNumber && <span className="ao-queue">Queue {order.queueNumber}</span>}
        </div>
        <div className="ao-card-right">
          <AdminBadge status={order.status} />
          <span className="ao-total">₹{total}</span>
          <span className="ao-time">{formatDate(order.orderDate)}</span>
          <span className="ao-chevron">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Pipeline progress */}
      {!isRejected && <PipelineBar status={order.status} />}

      {/* Expanded details */}
      {expanded && (
        <div className="ao-card-body">
          <table className="ao-items-table">
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              {items.length > 0 ? items.map((it, i) => (
                <tr key={i}>
                  <td>{it.name || '—'}</td>
                  <td>{it.quantity ?? it.qty ?? 1}</td>
                  <td>₹{it.price ?? '—'}</td>
                  <td>₹{it.totalPrice ?? ((it.price ?? 0) * (it.quantity ?? it.qty ?? 1))}</td>
                </tr>
              )) : <tr><td colSpan={4} className="ao-no-items">No item details</td></tr>}
            </tbody>
            <tfoot>
              <tr><td colSpan={3} className="ao-total-label">Grand Total</td><td className="ao-total-val">₹{total}</td></tr>
            </tfoot>
          </table>
          <div className="ao-meta-row">
            {order.orderDate && <span>Placed: <strong>{formatDate(order.orderDate)}</strong></span>}
            {order.paymentMethod && <span>Payment: <strong>{order.paymentMethod}</strong></span>}
            {order.orderType && <span>Type: <strong style={{textTransform:'capitalize'}}>{order.orderType}</strong></span>}
            {order.pickupTime && <span>Pickup: <strong>{order.pickupTime}</strong></span>}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {nextStatuses.length > 0 && (
        <div className="ao-actions">
          {nextStatuses.map(ns => {
            const a = ACTION_LABELS[ns];
            return (
              <button
                key={ns}
                className={`ao-btn ${a.cls}`}
                onClick={() => updateStatus(ns)}
                disabled={loading}
              >
                <span>{a.icon}</span> {a.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── Page ──────────────────────────────────────────────── */
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  const fetchOrders = async () => {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort newest first
      all.sort((a, b) => {
        const ta = a.orderDate?.toDate?.()?.getTime() ?? 0;
        const tb = b.orderDate?.toDate?.()?.getTime() ?? 0;
        return tb - ta;
      });
      setOrders(all);
    } catch (err) {
      toast.error('Failed to fetch orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const ACTIVE_S = ['placed', 'pending', 'preordered', 'accepted', 'cooking', 'ready'];
  const activeOrders    = orders.filter(o => ACTIVE_S.includes(o.status?.toLowerCase()));
  const completedOrders = orders.filter(o => o.status?.toLowerCase() === 'completed');
  const rejectedOrders  = orders.filter(o => o.status?.toLowerCase() === 'rejected');

  const tabs = [
    { key: 'active',    label: 'Active',    count: activeOrders.length    },
    { key: 'completed', label: 'Completed', count: completedOrders.length },
    { key: 'rejected',  label: 'Rejected',  count: rejectedOrders.length  },
  ];

  const displayed = activeTab === 'active' ? activeOrders : activeTab === 'completed' ? completedOrders : rejectedOrders;

  if (loading) return <p style={{ color: '#888', fontFamily: 'sans-serif', padding: '40px' }}>Loading orders…</p>;

  return (
    <div>
      <h1 className="admin-page-title">Orders</h1>
      <p className="admin-page-sub">Manage all incoming canteen orders with Zomato-style workflow</p>

      {/* Pipeline legend */}
      <div className="ao-legend">
        {Object.entries(STATUS_FLOW).map(([key, cfg]) => (
          <span key={key} className="ao-legend-item" style={{ color: cfg.color }}>
            <span className="ao-legend-dot" style={{ background: cfg.color }} />
            {cfg.label}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="ao-tabs">
        {tabs.map(t => (
          <button
            key={t.key}
            className={`ao-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
            <span className="ao-tab-count">{t.count}</span>
          </button>
        ))}
        <button className="ao-refresh" onClick={() => { setLoading(true); fetchOrders(); }} title="Refresh">↻ Refresh</button>
      </div>

      {/* Orders */}
      <div className="ao-list">
        {displayed.length === 0 ? (
          <div className="admin-no-data">
            {activeTab === 'active' ? 'No active orders 🎉' : activeTab === 'completed' ? 'No completed orders yet.' : 'No rejected orders.'}
          </div>
        ) : (
          displayed.map(order => <OrderCard key={order.id} order={order} onUpdate={() => { setLoading(true); fetchOrders(); }} />)
        )}
      </div>
    </div>
  );
}
