'use client';
import React, { useContext } from 'react';
import './FoodDisplay.css';
import FoodItem from '../FoodItem/FoodItem';
import { StoreContext } from '../../context/StoreContext'; // Ensure the correct path

const FoodDisplay = ({ category }) => {
  const { foodList } = useContext(StoreContext); // Consume foodList from context

  return (
    <div className='food-display' id='food-display'>
      <div className="food-display-header">
        <span className="section-label">Our Menu</span>
        <h2>Culinary Creations</h2>
        <hr className="food-display-divider" />
      </div>
      <div className="food-display-list">
        {foodList.map((item) => (
          (category === "All" || category === item.category) && (
            <FoodItem 
              key={item._id} 
              id={item._id} 
              name={item.name} 
              description={item.description} 
              price={item.price} 
              image={item.image} 
            />
          )
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
