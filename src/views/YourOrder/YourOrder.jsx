'use client';
import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../Components/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { StoreContext } from '../../context/StoreContext';
import './YourOrder.css';

const StatusBadge = ({ status }) => {
    const s = status?.toLowerCase();
    const cls = s === 'completed' ? 'badge-completed' : s === 'preordered' ? 'badge-preorder' : 'badge-placed';
    const label = s === 'completed' ? 'Completed' : s === 'preordered' ? 'Preordered' : 'Placed';
    return <span className={`order-status-badge ${cls}`}>{label}</span>;
};

const OrderCard = ({ order }) => {
    const [expanded, setExpanded] = useState(false);
    const items = order.items || [];
    const total = order.totalPrice ?? items.reduce((sum, i) => sum + (i.totalPrice ?? (i.price ?? 0) * (i.quantity ?? 1)), 0);
    const placedAt = order.orderDate?.toDate?.() ?? null;

    return (
        <div className={`order-card-new ${order.status?.toLowerCase() === 'completed' ? 'completed' : 'current'}`}>
            <div className="order-card-header" onClick={() => setExpanded(p => !p)}>
                <div className="order-meta">
                    <span className="order-id-label">#{order.id.slice(-8).toUpperCase()}</span>
                    {placedAt && (
                        <span className="order-date">
                            {placedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' '}
                            {placedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    )}
                </div>
                <div className="order-card-right">
                    <StatusBadge status={order.status} />
                    <span className="order-total-label">₹{total}</span>
                    <span className="expand-icon">{expanded ? '▲' : '▼'}</span>
                </div>
            </div>

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
                    {order.canteen && <p className="order-canteen">Canteen: {order.canteen}</p>}
                    {order.pickupTime && <p className="order-canteen">Pickup Time: {order.pickupTime}</p>}
                </div>
            )}
        </div>
    );
};

const YourOrder = () => {
    const { user } = useContext(StoreContext);
    const userId = user?.uid;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('active');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                setError("Please log in to view your orders.");
                setLoading(false);
                return;
            }
            try {
                const ordersRef = collection(db, 'orders');
                const q = query(ordersRef, where('userId', '==', userId));
                const snapshot = await getDocs(q);
                const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort newest first by orderDate
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
    }, [userId]);

    const activeOrders = orders.filter(o => {
        const s = o.status?.toLowerCase();
        return s === 'placed' || s === 'preordered' || s === 'pending';
    });
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
