'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiBarChartBoxLine,
  RiFileListLine,
  RiMenuLine,
  RiAddCircleLine,
  RiShoppingBag3Line,
  RiCloseLine,
} from 'react-icons/ri';
import './admin.css';

const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { href: '/admin',         label: 'Analytics',   icon: <RiBarChartBoxLine  /> },
    { href: '/admin/orders',  label: 'Orders',       icon: <RiShoppingBag3Line /> },
    { href: '/admin/list',    label: 'List Items',   icon: <RiFileListLine     /> },
    { href: '/admin/add',     label: 'Add Item',     icon: <RiAddCircleLine    /> },
  ];

  const isActive = (href) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div className="admin-root">
      {/* Top Navbar */}
      <header className="admin-navbar">
        <button
          className="admin-menu-toggle"
          onClick={() => setSidebarOpen(p => !p)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
        </button>
        <div className="admin-brand-wrap">
          <span className="admin-brand-dot" />
          <h2 className="admin-brand">CampusCraves</h2>
        </div>
        <span className="admin-panel-label">Admin Panel</span>
      </header>

      <div className="admin-body">
        {sidebarOpen && (
          <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <aside className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="admin-sidebar-header">
            <span className="admin-sidebar-title">Navigation</span>
          </div>
          <nav className="admin-sidebar-nav">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`admin-nav-link${isActive(link.href) ? ' active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-nav-icon">{link.icon}</span>
                <span>{link.label}</span>
                {isActive(link.href) && <span className="admin-nav-active-dot" />}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
