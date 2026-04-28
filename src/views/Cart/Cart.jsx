'use client';
import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import Footer from '../../Components/Footer/Footer';
import CartModal from '../../Components/CartModal/CartModal';
import { useRouter } from "next/navigation";

const Cart = () => {
  const { cartItems, foodList, removeFromCart, getTotalCartAmount, user } = useContext(StoreContext);
  const router = useRouter();
  return (
    <>
      <div className="cart">
        <h1 className="cart-page-title">Your <span>Shopping Cart</span></h1>
        {/* Conditionally render CartModal only if user is not logged in */}
        {user === null && <CartModal />} {/* Display modal if user is not logged in */}
        
        {getTotalCartAmount() === 0 ? (
          <div className="empty-cart">
            <h3>Your cart is empty</h3>
            <p>Add some delicious items to get started!</p>
            <button onClick={() => router.push("/menu")} className="browse-menu-btn">
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              <div className="cart-items-title">
                <p>Items</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
              </div>
              <br />
              <hr />
          {foodList.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <React.Fragment key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img src={item.image} alt={item.name}></img>
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>₹{item.price * cartItems[item._id]}</p>
                    <p onClick={() => removeFromCart(item._id)} className="cross">X</p>
                  </div>
                  <hr />
                </React.Fragment>
              );
            }
          })}
            </div>
          </>
        )}
        <div className="cart-bottom">
          <div className="cart-promocode">
            <p>Got a promo code? Enter it here to get amazing discounts on your order!</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Enter promo code" />
              <button type="submit">Apply</button>
            </div>
          </div>
          
          <div className="cart-total">
            <h2>Cart Summary</h2>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 20}</p>
            </div>
            <div className="cart-total-details">
              <p>GST (5%)</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : Math.round(getTotalCartAmount() * 0.05)}</p>
            </div>
            <hr style={{margin: '16px 0', border: '1px solid var(--border-subtle)'}} />
            <div className="cart-total-details grand-total">
              <p>Total Amount</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20 + Math.round(getTotalCartAmount() * 0.05)}</p>
            </div>
            <p className="cart-total-summary">Inclusive of all taxes • Free delivery on orders above ₹299</p>
            <button onClick={() => router.push("/checkout")} disabled={getTotalCartAmount() === 0}>
              {getTotalCartAmount() === 0 ? "Add Items to Continue" : "Proceed To Checkout"}
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Cart;
