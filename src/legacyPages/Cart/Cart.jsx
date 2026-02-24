'use client';
import React, { useContext } from 'react';
import '../../views/Cart/Cart.css';
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
        {/* Conditionally render CartModal only if user is not logged in */}
        {user === null && <CartModal />} {/* Display modal if user is not logged in */}
        
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
          {foodList.map((item, index) => {
            if (cartItems[item._id] > 0) {
              return (
                <>
                  <div className="cart-items-title cart-items-item" key={index}>
                    <img src={item.image} alt={item.name}></img>
                    <p>{item.name}</p>
                    <p>₹{item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>₹{item.price * cartItems[item._id]}</p>
                    <p onClick={() => removeFromCart(item._id)} className="cross">X</p>
                  </div>
                  <hr />
                </>
              );
            }
          })}
        </div>

        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div className="cart-total-details">
              <p>Total</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <button onClick={() => router.push("/checkout")}>Proceed To CheckOut </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Cart;
