'use client';
import React from 'react';
import { motion } from 'framer-motion';
import './Ewallet.css'; // Import CSS
import Footer from '../../Components/Footer/Footer';

// Parent container animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.4 },
  },
};

// Image animation
const imageVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 2, ease: 'easeOut' } },
};

// Text animations
const textVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
};

// Steps Data
const steps = [
  { title: "Add funds to your E-Wallet", icon: "💳" },
  { title: "Order food and drinks from participating restaurants", icon: "🍔" },
  { title: "Scan the QR code at checkout", icon: "📱" },
  { title: "Pay with your E-Wallet balance", icon: "💰" },
  { title: "Enjoy your meal", icon: "🍽️" },
];

// Why Use Ewallet Data
const benefits = [
  {
    title: "Convenience",
    description: "No need to carry cash or cards",
    image: "https://cdn.usegalileo.ai/sdxl10/43e5408f-72e2-4695-b707-1a6c7fcbfc09.png",
  },
  {
    title: "Efficiency",
    description: "Skip lines and reduce wait times",
    image: "https://cdn.usegalileo.ai/sdxl10/75649306-691c-43f2-81ec-f7c80886a166.png",
  },
  {
    title: "Security",
    description: "Secure payment and personal data",
    image: "https://cdn.usegalileo.ai/sdxl10/3179afbe-3014-4d6f-80cd-d9b8336f819f.png",
  },
];

const faqData = [
  {
    question: "How do I add funds to my E-Wallet?",
    answer: "You can add funds to your E-Wallet through various payment methods such as debit/credit cards or online bank transfers."
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes, we use the latest encryption technologies to ensure that your payment details and personal information are secure."
  },
  {
    question: "Can I use my E-Wallet balance across different restaurants?",
    answer: "Yes, you can use your E-Wallet balance to order food from any participating restaurant within the system."
  },
  {
    question: "How do I get my 10% off on the first purchase?",
    answer: "The 10% discount will automatically be applied to your first purchase once you create an account and add funds to your E-Wallet."
  },
];

const Ewallet = () => {
  return (
    <>
      {/* E-Wallet Section */}
      <motion.div
        className="ewallet-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Left Side: Image */}
        <motion.div className="ewallet-image" variants={imageVariants}>
          <img src="/ewallet.jpg" alt="Ewallet" className="ewallet-img" />
        </motion.div>

        {/* Right Side: Text and Button */}
        <motion.div className="ewallet-text">
          <motion.div className="ewallet-intro" variants={textVariants}>
            Introducing
          </motion.div>

          <div className="ewallet-you-to">
            <motion.div className="ewallet-you" variants={textVariants}>
              you
            </motion.div>
            <motion.div className="ewallet-to" variants={textVariants}>
              to
            </motion.div>
          </div>

          <motion.div className="ewallet-title" variants={textVariants}>
            Ewallet
          </motion.div>

          <motion.h2 className="ewallet-description" variants={textVariants}>
            Pay for your food with just a tap. Easily add funds and pay for your order. Plus, get 10% off your first E-Wallet purchase.
          </motion.h2>

          <motion.button className="ewallet-button" variants={textVariants}>
            <span>Create an account</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* How It Works Section */}
      <div className="how-it-works-container">
        <h2 className="section-title left-align">How it works</h2>
        <motion.div 
          className="steps-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.3, duration: 0.8, ease: "easeOut" }
            }
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              className="step-card"
              key={index}
              initial={{ opacity: 0, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.2 }}
            >
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Why Use Ewallet Section */}
      <div className="why-ewallet-container">
        <h2 className="section-title left-align">Why use Campus Craves E-Wallet?</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div 
                className="benefit-image" 
                style={{ backgroundImage: `url(${benefit.image})` }}
              ></div>
              <div>
                <p className="benefit-title">{benefit.title}</p>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 class="faq-title">Frequently Asked Questions</h2>
<div class="faq-container">
  <details class="faq-item" open>
    <summary class="faq-summary">
      <p class="faq-question">What is the Campus Craves E-Wallet?</p>
      <div class="faq-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
        </svg>
      </div>
    </summary>
    <p class="faq-answer">The Campus Craves E-Wallet is a digital payment solution that allows students to pay for meals and snacks at participating on-campus dining locations. By adding funds to your E-Wallet, you can enjoy the convenience of contactless payment and skip the hassle of carrying cash or credit cards.</p>
  </details>

  <details class="faq-item">
    <summary class="faq-summary">
      <p class="faq-question">How do I add funds to my E-Wallet?</p>
      <div class="faq-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
        </svg>
      </div>
    </summary>
    <p class="faq-answer">You can add funds to your E-Wallet through the Campus Craves portal. The process is quick and secure, ensuring that your payment is safely processed.</p>
  </details>

  <details class="faq-item">
    <summary class="faq-summary">
      <p class="faq-question">Where can I use my E-Wallet?</p>
      <div class="faq-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
        </svg>
      </div>
    </summary>
    <p class="faq-answer">The E-Wallet can be used at any participating dining locations on campus, including the canteen and snack counters.</p>
  </details>
</div>


      
          <Footer/>
      
    </>
  );
};

export default Ewallet;
