'use client';
import React from 'react'
import './Preorder.css'
import { useEffect } from 'react';
import {motion,useInView} from "framer-motion"
import Footer from '../../Components/Footer/Footer';

const Preorder = () => {
   
        const scrollToContent = () => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
          });
        };
   
  return (

    <>
    <motion.div className="preorder-header"
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeInOut" }}>
      <div className='hea'>
        <h1>Want to Pre-Order your food?</h1>
        <p>Skip the queue and have your meal ready when you arrive.</p>
        </div>
    </motion.div>

      <div className="scroll-button-container" onClick={scrollToContent}>
        <motion.div
          className="scroll-button"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="arrow">↓</div>
        </motion.div>
      </div>
      
     <div className='steps'>
     <motion.div
        className="steps-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
      >
        <motion.div
          className="step"
          initial={{ opacity: 0,y:100 }}
          whileInView={{ opacity: 1,y:0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-200px' }}
        >
          <h2>Step 1: Choose Your Meal</h2>
          <p>Select your favorite meal from the menu.</p>
        </motion.div>

        <motion.div
          className="step"
          initial={{ opacity: 0,y:100 }}
          whileInView={{ opacity: 1,y:0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-200px' }}
        >
          <h2>Step 2: Add to Cart</h2>
          <p>Add the meal to your cart to proceed.</p>
        </motion.div>

        <motion.div
          className="step"
          initial={{ opacity: 0,y:100 }}
          whileInView={{ opacity: 1 ,y:0}}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-200px' }}
        >
          <h2>Step 3: Proceed to Checkout</h2>
          <p>Once you’ve reviewed your cart, proceed to checkout.</p>
        </motion.div>

        <motion.div
          className="step"
          initial={{ opacity: 0,y:100 }}
          whileInView={{ opacity: 1,y:0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-200px' }}
        >
          <h2>Step 4:  Select Type of Order</h2>
          <p>Choose between Pre-order or Instant for your meal delivery.</p>
        </motion.div>

        <motion.div
          className="step"
          initial={{ opacity: 0,y:100 }}
          whileInView={{ opacity: 1,y:0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-200px' }}
        >
          <h2>Step 5:  Payment</h2>
          <p>Choose your payment method and complete the transaction securely.</p>
        </motion.div>
        <motion.div
          className="step"
          initial={{ opacity: 0,y:100 }}
          whileInView={{ opacity: 1,y:0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-200px' }}
        >
          <h2>Step 6: You&apos;re Done!</h2>
          <p>You&apos;re all set! Your order is confirmed, and you’ll receive updates shortly.</p>
        </motion.div>




      </motion.div>
      
        
   
     </div>
     
    <Footer/>   
    </>
  )
}

export default Preorder
