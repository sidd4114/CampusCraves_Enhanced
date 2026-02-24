import React, { useState, useEffect } from "react";
import { db } from "../../../src/Components/firebase"; // Adjust the import path
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./List.css";

const List = () => {
  const [list, setList] = useState([]);

  // Fetch the food items from Firestore
  const fetchList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "foodItems"));
      const foodList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setList(foodList);
    } catch (error) {
      toast.error("Error fetching food items: " + error.message);
    }
  };

  // Remove food item from Firestore
  const removeFood = async (foodId) => {
    try {
      await deleteDoc(doc(db, "foodItems", foodId));
      toast.success("Food item removed successfully");
      fetchList(); // Refresh the list after deletion
    } catch (error) {
      toast.error("Failed to remove food item: " + error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>Food List</p>
      <div className="list-table">
        <div className="list-table-formate">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item) => (
          <div key={item.id} className="list-table-formate">
            <img src={item.image} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p onClick={() => removeFood(item.id)} className="cursor">x</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
