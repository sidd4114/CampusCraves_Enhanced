'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import './Navbar.css';

const Navbar = ({ onLogout, user }) => {
    const [menu, setMenu] = useState("home");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const lastScrollY = useRef(0);
    const ticking = useRef(false);

    // Update the menu state when the pathname changes
    useEffect(() => {
        const currentPage = pathname.split("/")[1];
        setMenu(currentPage);
    }, [pathname]);

    useEffect(() => {
        if (mobileOpen) {
            setIsHidden(false);
            return;
        }

        lastScrollY.current = window.scrollY || 0;

        const handleScroll = () => {
            if (ticking.current) {
                return;
            }

            ticking.current = true;
            window.requestAnimationFrame(() => {
                const currentY = window.scrollY || 0;
                const delta = currentY - lastScrollY.current;
                const threshold = 12;

                if (Math.abs(delta) >= threshold) {
                    if (currentY <= 20) {
                        setIsHidden(false);
                    } else if (delta > 0) {
                        setIsHidden(true);
                    } else {
                        setIsHidden(false);
                    }
                    lastScrollY.current = currentY;
                }

                ticking.current = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [mobileOpen]);

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
        <div className={`cc-navbar${isHidden ? ' cc-navbar--hidden' : ''}`}>
            <div className="navbar-inner">
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
                <div
                    className={`navbar-overlay${mobileOpen ? ' is-visible' : ''}`}
                    onClick={() => setMobileOpen(false)}
                />

                {/* Hamburger Menu */}
                <ul className={`navbar-menu${mobileOpen ? ' mobile-open' : ''}`}>
                    <li className="navbar-menu-close">
                        <button
                            type="button"
                            className="navbar-close-btn"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Close menu"
                        >
                            Close
                        </button>
                    </li>
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
                    <img src="/icons/shopping-cart.png" className='icon' onClick={() => router.push("/cart")} alt="cart icon" />
                    <div className='dot'></div>
                    <button className="Logout" onClick={handleAuthAction}>
                        {user ? "Logout" : "Login"}
                    </button>
                    
                    {/* Hamburger - moved to right side */}
                    <button
                        className={`navbar-hamburger${mobileOpen ? ' open' : ''}`}
                        onClick={() => setMobileOpen(p => !p)}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
