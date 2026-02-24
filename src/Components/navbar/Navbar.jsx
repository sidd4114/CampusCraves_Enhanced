'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './Navbar.css';

const Navbar = ({ onLogout, user }) => {
    const [menu, setMenu] = useState("home");
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Update the menu state when the pathname changes
    useEffect(() => {
        const currentPage = pathname.split("/")[1];
        setMenu(currentPage);
    }, [pathname]);

    // Function to handle menu click and navigate
    const handleMenuClick = (page) => {
        setMenu(page);
        setMobileOpen(false);
        router.push(`/${page}`);
    };

    const handleAuthAction = () => {
        if (user) {
            onLogout(); // toast is shown inside onLogout (ClientProviders)
        } else {
            router.push("/login");
        }
    };

    return (
        <div className='navbar'>
            <h2 onClick={() => handleMenuClick("home")}>CampusCraves.</h2>

            {/* Desktop Menu */}
            <ul className="navbar-menu-desktop">
                <li
                    onClick={() => handleMenuClick("home")}
                    className={menu === "home" ? "active" : ""}
                >
                    Home
                </li>
                <li
                    onClick={() => handleMenuClick("menu")}
                    className={menu === "menu" ? "active" : ""}
                >
                    Menu
                </li>
                <li
                    onClick={() => handleMenuClick("preorder")}
                    className={menu === "preorder" ? "active" : ""}
                >
                    Preorder
                </li>
            </ul>

            {/* Mobile overlay */}
            {mobileOpen && <div className="navbar-overlay" onClick={() => setMobileOpen(false)} />}

            {/* Hamburger Menu */}
            <ul className={`navbar-menu${mobileOpen ? ' mobile-open' : ''}`}>
                <li
                    onClick={() => handleMenuClick("home")}
                    className={menu === "home" ? "active" : ""}
                >
                    Home
                </li>
                <li
                    onClick={() => handleMenuClick("menu")}
                    className={menu === "menu" ? "active" : ""}
                >
                    Menu
                </li>
                <li
                    onClick={() => handleMenuClick("preorder")}
                    className={menu === "preorder" ? "active" : ""}
                >
                    Preorder
                </li>
                <li
                    onClick={() => handleMenuClick("your-order")}
                    className={menu === "your-order" ? "active" : ""}
                >
                    YourOrder
                </li>
                {/* Show auth button in hamburger menu */}
                <li className="navbar-menu-auth">
                    <button className="Logout" onClick={() => { setMobileOpen(false); handleAuthAction(); }}>
                        {user ? "Logout" : "Login"}
                    </button>
                </li>
            </ul>

            <div className="navbar-right">
                <div className="navbar-basket-icon"></div>
                <img src="./icons/shopping-cart.png" className='icon' onClick={() => router.push("/cart")} alt="cart icon" />
                <div className='dot'></div>
                <button className="Logout" onClick={handleAuthAction}>
                    {user ? "Logout" : "Login"}
                </button>
                
                {/* Hamburger - moved to right side */}
                <button
                    className={`navbar-hamburger${mobileOpen ? ' open' : ''}`}
                    onClick={() => setMobileOpen(p => !p)}
                    aria-label="Toggle menu"
                >
                    <span /><span /><span />
                </button>
            </div>
        </div>
    );
};

export default Navbar;
