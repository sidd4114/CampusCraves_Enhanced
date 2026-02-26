'use client';
import { createContext, useEffect, useState } from "react";
import { db } from "../Components/firebase"; // Ensure the correct path to your Firebase configuration
import { collection, getDocs } from "firebase/firestore";
import { auth } from "../Components/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // Initialise from localStorage so cart survives page refreshes
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem("campuscraves_cart");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [foodList, setFoodList] = useState([]); // New state for foodList
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Persist cart to localStorage on every change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("campuscraves_cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Fetch food items from Firestore
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const foodItemsCollection = collection(db, "foodItems");
        const foodItemsSnapshot = await getDocs(foodItemsCollection);
        const foodItemsData = foodItemsSnapshot.docs.map(doc => ({
          _id: doc.id,
          ...doc.data(),
        }));
        setFoodList(foodItemsData); // Set fetched data to foodList
      } catch (error) {
        console.error("Error fetching food items: ", error);
      }
    };

    fetchFoodItems();
  }, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) - 1,
    }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = foodList.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // Authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const contextValue = {
    foodList, // Provide foodList in the context
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    user,
    authLoading,
    getTotalCartAmount,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
