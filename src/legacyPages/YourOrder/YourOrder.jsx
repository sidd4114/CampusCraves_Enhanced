'use client';
import React, { useEffect, useState, useContext } from 'react';
import { db } from '../../Components/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { StoreContext } from '../../context/StoreContext';
import '../../views/YourOrder/YourOrder.css';

const YourOrder = () => {
    const { user } = useContext(StoreContext);
    const userId = user?.uid;
    const [currentOrders, setCurrentOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!userId) {
                console.error("User ID is undefined");
                setError("User ID is missing. Unable to fetch orders.");
                setLoading(false);
                return;
            }

            try {
                const ordersRef = collection(db, 'orders');
                const userOrdersQuery = query(ordersRef, where('userId', '==', userId));
                const orderSnapshot = await getDocs(userOrdersQuery);

                const current = [];
                const completed = [];

                orderSnapshot.forEach((doc) => {
                    const orderData = { id: doc.id, ...doc.data() };
                    console.log('Order Data:', orderData);

                    const status = orderData.status?.toLowerCase();

                    if (status === 'placed'|| status==='preordered') {
                        current.push(orderData);
                    } else if (status === 'completed') {
                        completed.push(orderData);
                    }
                });

                setCurrentOrders(current);
                setCompletedOrders(completed);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError("Failed to load orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    if (loading) {
        return <p className="loading-message">Loading orders...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="your-order">
            <div className="orders-section">
                <h2>Current Orders</h2>
                {currentOrders.length > 0 ? (
                    currentOrders.map(order => (
                        <div key={order.id} className="order-card current">
                            <div className="order-details">
                                <p className="order-id">Order ID: {order.id}</p>
                                {order.items?.length > 0 ? (
                                    order.items.map((item, index) => (
                                        <p key={index} className="order-item">
                                            {item.itemName || item.name || 'No item name'} - 
                                            <span className="order-quantity"> {item.quantity || 'No quantity'}</span>
                                        </p>
                                    ))
                                ) : (
                                    <p>No items in this order</p>
                                )}
                            </div>
                            <div className="status-badge">Placed</div>
                        </div>
                    ))
                ) : (
                    <p>No current orders</p>
                )}
            </div>

            <div className="orders-section">
                <h2>Completed Orders</h2>
                {completedOrders.length > 0 ? (
                    completedOrders.map(order => (
                        <div key={order.id} className="order-card completed">
                            <div className="order-details">
                                <p className="order-id">Order ID: {order.id}</p>
                                {order.items?.length > 0 ? (
                                    order.items.map((item, index) => (
                                        <p key={index} className="order-item">
                                            {item.itemName || item.name || 'No item name'} - 
                                            <span className="order-quantity"> {item.quantity || 'No quantity'}</span>
                                        </p>
                                    ))
                                ) : (
                                    <p>No items in this order</p>
                                )}
                            </div>
                            <div className="status-badge">Completed</div>
                        </div>
                    ))
                ) : (
                    <p>No completed orders</p>
                )}
            </div>
        </div>
    );
};

export default YourOrder;
