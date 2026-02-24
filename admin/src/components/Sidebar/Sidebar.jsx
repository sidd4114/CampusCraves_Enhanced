import React from 'react';
import './sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {/* Analytics */}
        <NavLink to="/Analytics" className="sidebar-option">
          <img src={assets.order_icon} alt="Analytics Icon" />
          <p>Analytics</p>
        </NavLink>

        {/* Add Items */}
        <NavLink to="/Add" className="sidebar-option">
          <img src={assets.add_icon} alt="Add Icon" />
          <p>Add Item</p>
        </NavLink>

        {/* List Items */}
        <NavLink to="/List" className="sidebar-option">
          <img src={assets.order_icon} alt="List Icon" />
          <p>List Items</p>
        </NavLink>

        {/* Orders */}
        <NavLink to="/Orders" className="sidebar-option">
          <img src={assets.order_icon} alt="Order Icon" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
