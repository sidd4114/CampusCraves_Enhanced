import React, { useEffect, useState } from 'react';
import { db } from '../../../src/Components/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import './Analytics.css';

const COLORS = ['#c9a96e', '#e8c98a', '#a07840', '#f0d9a8', '#7a5a2a', '#d4b07a', '#e0c48a'];

const Analytics = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const snap = await getDocs(collection(db, 'orders'));
                setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="an-loading"><div className="an-spinner" /><p>Loading analytics…</p></div>;

    // ── Item popularity ──────────────────────────────────────────
    const itemMap = {};
    orders.forEach(order => {
        (order.items || []).forEach(item => {
            const name = item.itemName || item.name || 'Unknown';
            itemMap[name] = (itemMap[name] || 0) + (item.quantity || 1);
        });
    });
    const itemData = Object.entries(itemMap)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 8);

    // ── Revenue per day ──────────────────────────────────────────
    const revenueMap = {};
    orders.forEach(order => {
        const ts = order.createdAt?.toDate?.() || order.timestamp?.toDate?.();
        if (!ts) return;
        const day = ts.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        revenueMap[day] = (revenueMap[day] || 0) + (order.totalAmount || 0);
    });
    const revenueData = Object.entries(revenueMap).map(([date, revenue]) => ({ date, revenue })).slice(-14);

    // ── Busy hours ───────────────────────────────────────────────
    const hourMap = {};
    for (let i = 0; i < 24; i++) hourMap[i] = 0;
    orders.forEach(order => {
        const ts = order.createdAt?.toDate?.() || order.timestamp?.toDate?.();
        if (!ts) return;
        const h = ts.getHours();
        hourMap[h] = (hourMap[h] || 0) + 1;
    });
    const hourData = Object.entries(hourMap).map(([h, count]) => ({
        hour: `${h.toString().padStart(2, '0')}:00`,
        orders: count
    }));

    // ── Order status breakdown ───────────────────────────────────
    const statusMap = {};
    orders.forEach(o => {
        const s = o.status || 'Unknown';
        statusMap[s] = (statusMap[s] || 0) + 1;
    });
    const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

    // ── KPI cards ────────────────────────────────────────────────
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const completedCount = orders.filter(o => o.status?.toLowerCase() === 'completed').length;
    const totalItems = Object.values(itemMap).reduce((a, b) => a + b, 0);
    const topItem = itemData[0]?.name || '—';

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="an-tooltip">
                    <p className="an-tt-label">{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} style={{ color: p.color }}>
                            {p.name}: <strong>{p.name === 'revenue' ? `₹${p.value}` : p.value}</strong>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="analytics">
            <div className="an-header">
                <h1>Analytics Dashboard</h1>
                <p>Live insights from all canteen orders</p>
            </div>

            {/* KPI Cards */}
            <div className="an-kpi-grid">
                <div className="an-kpi-card">
                    <span className="an-kpi-icon">₹</span>
                    <div>
                        <p className="an-kpi-value">₹{totalRevenue.toLocaleString('en-IN')}</p>
                        <p className="an-kpi-label">Total Revenue</p>
                    </div>
                </div>
                <div className="an-kpi-card">
                    <span className="an-kpi-icon">🧾</span>
                    <div>
                        <p className="an-kpi-value">{orders.length}</p>
                        <p className="an-kpi-label">Total Orders</p>
                    </div>
                </div>
                <div className="an-kpi-card">
                    <span className="an-kpi-icon">✅</span>
                    <div>
                        <p className="an-kpi-value">{completedCount}</p>
                        <p className="an-kpi-label">Completed Orders</p>
                    </div>
                </div>
                <div className="an-kpi-card">
                    <span className="an-kpi-icon">🍽️</span>
                    <div>
                        <p className="an-kpi-value">{totalItems}</p>
                        <p className="an-kpi-label">Items Sold</p>
                    </div>
                </div>
                <div className="an-kpi-card highlight">
                    <span className="an-kpi-icon">⭐</span>
                    <div>
                        <p className="an-kpi-value">{topItem}</p>
                        <p className="an-kpi-label">Best Selling Item</p>
                    </div>
                </div>
            </div>

            <div className="an-charts-grid">
                {/* Most Popular Items */}
                <div className="an-chart-card wide">
                    <h3>Most Popular Items</h3>
                    <p className="an-chart-sub">Items ranked by total quantity ordered</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={itemData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" tick={{ fill: '#aaa', fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                            <YAxis tick={{ fill: '#aaa', fontSize: 12 }} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="qty" name="quantity" fill="#c9a96e" radius={[4, 4, 0, 0]}>
                                {itemData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Order Status Pie */}
                <div className="an-chart-card">
                    <h3>Order Status Breakdown</h3>
                    <p className="an-chart-sub">Distribution by status</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Trend */}
                <div className="an-chart-card wide">
                    <h3>Revenue Trend (Last 14 Days)</h3>
                    <p className="an-chart-sub">Daily revenue in ₹</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="date" tick={{ fill: '#aaa', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#aaa', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={2} dot={{ r: 4, fill: '#c9a96e' }} activeDot={{ r: 7 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Busy Hours */}
                <div className="an-chart-card wide">
                    <h3>Busiest Hours</h3>
                    <p className="an-chart-sub">Order volume by hour of day</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={hourData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="hour" tick={{ fill: '#aaa', fontSize: 10 }} interval={1} />
                            <YAxis tick={{ fill: '#aaa', fontSize: 12 }} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="orders" fill="#c9a96e" radius={[4, 4, 0, 0]}>
                                {hourData.map((entry, i) => (
                                    <Cell key={i} fill={entry.orders === Math.max(...hourData.map(h => h.orders)) ? '#f0d9a8' : '#c9a96e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Items Table */}
            <div className="an-table-card">
                <h3>Top Items Leaderboard</h3>
                <table className="an-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item Name</th>
                            <th>Units Sold</th>
                            <th>Popularity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itemData.map((item, i) => (
                            <tr key={i}>
                                <td className={i === 0 ? 'rank gold' : i === 1 ? 'rank silver' : i === 2 ? 'rank bronze' : 'rank'}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                </td>
                                <td>{item.name}</td>
                                <td>{item.qty}</td>
                                <td>
                                    <div className="an-bar-wrap">
                                        <div className="an-bar-fill" style={{ width: `${(item.qty / (itemData[0]?.qty || 1)) * 100}%` }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Analytics;
