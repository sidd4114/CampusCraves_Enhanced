'use client';
import React, { useContext } from 'react';
import './FoodItem.css';
import { StoreContext } from '../../context/StoreContext';



const FoodItem = ({ id, name, price, description, image }) => {

    const{cartItems,addToCart,removeFromCart}=useContext(StoreContext)


    return (
        <div className='food-item'>
        <div className="food-item-image-container">
            <img className='food-item-image' src={image} alt={name} />
            {!cartItems[id] ? (
            <img
                className="add-to-cart-icon"
                onClick={() => addToCart(id)}  
                src='/icons/addingtocart.png'
                alt='Add to cart'
            />
            ) : (
            <div className='food-item-counter'>
                <img
                onClick={()=>removeFromCart(id)}
                src='/icons/cross1.png'
                alt='Decrease quantity'
                className='quantity-btn'
                />
                <p>{cartItems[id]}</p>
                <img
                onClick={()=>addToCart(id)}
                src='/icons/add1.png'
                alt='Increase quantity'
                className='quantity-btn'
                />
            </div>
            )}
        </div>

        <div className="food-item-info">
            <div className="food-item-name-rating">
            <h3>{name}</h3>
            {/* You can add stars or ratings here if you want */}
            </div>

            <p className="food-item-desc">{description}</p>

            <div className="food-item-footer">
            <p className="food-item-price">₹{price}</p>
            </div>
        </div>
        </div>
    );
    };

    export default FoodItem;
