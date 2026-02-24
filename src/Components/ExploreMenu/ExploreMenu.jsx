'use client';
import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase instance
import './ExploreMenu.css';

const ExploreMenu = ({ category, setCategory }) => {
  const [menuItems, setMenuItems] = useState([]);  // State to hold fetched categories

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'menuItems'));
        const categories = querySnapshot.docs.map(doc => doc.data());
        // Sort categories based on menu_name (ascending order)
      categories.sort((a, b) => a.menu_name.localeCompare(b.menu_name));

      
        setMenuItems(categories);  // Set fetched categories to state
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchMenuItems();  // Fetch categories when the component mounts
  }, []);

  return (
    <div className="explore-menu">
      <h1>Check out our Cravings</h1>
      <p className="explore-menu-text">
        Explore a variety of mouthwatering dishes tailored to suit every craving! 
        From hearty meals to quick snacks and refreshing beverages, our menu is crafted 
        to delight your taste buds. Enjoy seamless online ordering and skip the hassle of 
        long queues—your favorite food is just a click away!
      </p>

      <div className="explore-menu-list">
        {menuItems.map((item, index) => (
          <div 
            key={index}
            onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
            className="explore-menu-list-item"
          >
            <img
              className={category === item.menu_name ? "active" : ""}
              src={item.menu_image} // Use the image field from Firestore
              alt={item.menu_name}
            />
            <p>{item.menu_name}</p>  {/* Display the menu name */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreMenu;