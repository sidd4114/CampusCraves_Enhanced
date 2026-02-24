'use client';
import React from 'react'
import { useRouter } from 'next/navigation';
import './Header.css';


const Header = () => {
    const router = useRouter();

    const goToMenu = () => {
        router.push("/menu");
    };
    return (
    <div className='header'>
        <div className="header-bg"></div>
        <div className="header-contents">
            <span className="header-eyebrow">Campus Fine Dining</span>
            <h2>Savor the <span>Extraordinary</span>,<br/>Skip the Queue</h2>
            <p>Elevate your dining experience with a curated menu crafted from the finest ingredients. Streamline orders, skip the wait, and indulge in convenience with every bite.</p>
            <div className="header-actions">
                <button onClick={goToMenu}>Explore Menu</button>
                <button className="header-btn-secondary" onClick={() => router.push("/preorder")}>Pre-order Now</button>
            </div>
        </div>
        <div className="header-scroll">Scroll</div>
    </div>
    )
}

export default Header
