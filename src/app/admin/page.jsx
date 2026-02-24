'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../../Components/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import './admin.css';

const COLORS = ['#c9a96e', '#e8c98a', '#a07840', '#f0d9a8', '#7a5a2a', '#d4b07a', '#e0c48a'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#222', border: '1px solid #c9a96e', borderRadius: 6, padding: '10px 14px', fontSize: '0.85rem', color: '#e8e0d0', fontFamily: 'sans-serif' }}>
                <p style={{ fontWeight: 600, color: '#c9a96e', margin: '0 0 6px' }}>{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color, margin: 0 }}>
                        {p.name}: <strong>{p.name === 'revenue' ? `₹${p.value}` : p.value}</strong>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function AdminAnalyticsPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDocs(collection(db, 'orders'))
            .then(snap => setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, color: '#888' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #333', borderTopColor: '#c9a96e', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p>Loading analytics…</p>
        </div>
    );

    // Item popularity
    const itemMap = {};
    orders.forEach(order => {
        (order.items || []).forEach(item => {
            const name = item.name || 'Unknown';
            itemMap[name] = (itemMap[name] || 0) + (item.quantity || 1);
        });
    });
    const itemData = Object.entries(itemMap).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 8);

    // Revenue per day
    const revenueMap = {};
    orders.forEach(order => {
        const ts = order.orderDate?.toDate?.();
        if (!ts) return;
        const day = ts.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        revenueMap[day] = (revenueMap[day] || 0) + (order.totalPrice || 0);
    });
    const revenueData = Object.entries(revenueMap).map(([date, revenue]) => ({ date, revenue })).slice(-14);

    // Busy hours
    const hourMap = {};
    for (let i = 0; i < 24; i++) hourMap[i] = 0;
    orders.forEach(order => {
        const ts = order.orderDate?.toDate?.();
        if (!ts) return;
        hourMap[ts.getHours()] = (hourMap[ts.getHours()] || 0) + 1;
    });
    const hourData = Object.entries(hourMap).map(([h, count]) => ({ hour: `${h.toString().padStart(2, '0')}:00`, orders: count }));
    const maxOrders = Math.max(...hourData.map(h => h.orders));

    // Status breakdown
    const statusMap = {};
    orders.forEach(o => { const s = o.status || 'Unknown'; statusMap[s] = (statusMap[s] || 0) + 1; });
    const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

    // KPIs
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const completedCount = orders.filter(o => o.status?.toLowerCase() === 'completed').length;
    const totalItems = Object.values(itemMap).reduce((a, b) => a + b, 0);
    const topItem = itemData[0]?.name || '—';

    const kpis = [
        { icon: '₹', value: `₹${totalRevenue.toLocaleString('en-IN')}`, label: 'Total Revenue' },
        { icon: '🧾', value: orders.length, label: 'Total Orders' },
        { icon: '✅', value: completedCount, label: 'Completed' },
        { icon: '🍽️', value: totalItems, label: 'Items Sold' },
        { icon: '⭐', value: topItem, label: 'Best Seller', highlight: true },
    ];

    return (
        <div>
            <h1 className="admin-page-title">Analytics Dashboard</h1>
            <p className="admin-page-sub">Live insights from all canteen orders</p>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20, marginBottom: 36 }}>
                {kpis.map((k, i) => (
                    <div key={i} style={{ background: k.highlight ? '#1e1a12' : '#1a1a1a', border: `1px solid ${k.highlight ? '#c9a96e' : '#2e2e2e'}`, borderRadius: 8, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <span style={{ fontSize: '1.8rem', minWidth: 36, textAlign: 'center' }}>{k.icon}</span>
                        <div>
                            <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#c9a96e', margin: '0 0 4px', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{k.value}</p>
                            <p style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'sans-serif', margin: 0 }}>{k.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginBottom: 36 }}>

                {/* Most Popular Items */}
                <div style={{ gridColumn: 'span 2', background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 8, padding: 24 }}>
                    <h3 style={{ color: '#e8e0d0', fontWeight: 400, margin: '0 0 4px' }}>Most Popular Items</h3>
                    <p style={{ color: '#666', fontSize: '0.78rem', fontFamily: 'sans-serif', margin: '0 0 20px' }}>Ranked by quantity ordered</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={itemData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="name" tick={{ fill: '#aaa', fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                            <YAxis tick={{ fill: '#aaa', fontSize: 12 }} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="qty" name="quantity" radius={[4, 4, 0, 0]}>
                                {itemData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Status Pie */}
                <div style={{ background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 8, padding: 24 }}>
                    <h3 style={{ color: '#e8e0d0', fontWeight: 400, margin: '0 0 4px' }}>Order Status Breakdown</h3>
                    <p style={{ color: '#666', fontSize: '0.78rem', fontFamily: 'sans-serif', margin: '0 0 20px' }}>Distribution by status</p>
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
                <div style={{ background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 8, padding: 24 }}>
                    <h3 style={{ color: '#e8e0d0', fontWeight: 400, margin: '0 0 4px' }}>Revenue Trend (Last 14 Days)</h3>
                    <p style={{ color: '#666', fontSize: '0.78rem', fontFamily: 'sans-serif', margin: '0 0 20px' }}>Daily revenue in ₹</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="date" tick={{ fill: '#aaa', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#aaa', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="revenue" stroke="#c9a96e" strokeWidth={2} dot={{ r: 4, fill: '#c9a96e' }} activeDot={{ r: 7 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Busy Hours */}
                <div style={{ gridColumn: 'span 2', background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 8, padding: 24 }}>
                    <h3 style={{ color: '#e8e0d0', fontWeight: 400, margin: '0 0 4px' }}>Busiest Hours</h3>
                    <p style={{ color: '#666', fontSize: '0.78rem', fontFamily: 'sans-serif', margin: '0 0 20px' }}>Order volume by hour of the day</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={hourData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="hour" tick={{ fill: '#aaa', fontSize: 10 }} interval={1} />
                            <YAxis tick={{ fill: '#aaa', fontSize: 12 }} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                                {hourData.map((entry, i) => <Cell key={i} fill={entry.orders === maxOrders && entry.orders > 0 ? '#f0d9a8' : '#c9a96e'} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div style={{ background: '#1a1a1a', border: '1px solid #2e2e2e', borderRadius: 8, padding: 24 }}>
                <h3 style={{ color: '#e8e0d0', fontWeight: 400, margin: '0 0 20px' }}>Top Items Leaderboard</h3>
                <table className="admin-table">
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
                                <td style={{ fontWeight: 700, color: i === 0 ? '#f0d060' : i === 1 ? '#a8a8b8' : i === 2 ? '#c87040' : '#ccc' }}>
                                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                                </td>
                                <td>{item.name}</td>
                                <td>{item.qty}</td>
                                <td style={{ minWidth: 120 }}>
                                    <div style={{ height: 8, background: '#2e2e2e', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(item.qty / (itemData[0]?.qty || 1)) * 100}%`, background: 'linear-gradient(90deg, #c9a96e, #f0d9a8)', borderRadius: 4, transition: 'width 0.6s ease' }} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
