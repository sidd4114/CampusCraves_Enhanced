import { db } from "../Components/firebase"; // Import Firestore
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

// Function to fetch foodList from Firestore
async function fetchFoodList() {
  try {
    const querySnapshot = await getDocs(collection(db, "foodItems")); // "foods" is your Firestore collection
    const foodArray = querySnapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() })); // Convert to array
   
    return foodArray;
  } catch (error) {
    console.error("Error fetching foodList:", error);
    return []; // Return an empty array in case of an error
  }
}

// Function to place the order
export async function placeOrder(userId, orderType, paymentMethod, cartItems, pickupDate = null, pickupTime = null,suggestedQueue) {
  try {
    console.log(`🔥 Received suggestedQueue: ${suggestedQueue}`);
    const foodList = await fetchFoodList(); // Ensure foodList is fetched before using it

    if (!Array.isArray(foodList) || foodList.length === 0) {
      throw new Error("foodList is empty or not an array.");
    }

    // Prepare order data
    const orderData = {
      userId,  
      items: getSelectedItems(cartItems, foodList), 
      totalPrice: calculateTotalPrice(cartItems, foodList), 
      status: orderType === "instant" ? "Placed" : "Preordered",
      orderDate: serverTimestamp(),
      paymentMethod,
      paymentStatus: "Placed",
      pickupDate: orderType === "preorder" ? pickupDate : null,
      pickupTime: orderType === "preorder" ? pickupTime : null,
      queueNo:suggestedQueue,
    };

    console.log("Order Data: ", orderData); // Debugging log

    const docRef = await addDoc(collection(db, "orders"), orderData);
    console.log("Order placed with ID: ", docRef.id);
    alert("Order placed successfully!");

    return {id:docRef.id};

  } catch (error) {
    console.error("Error placing order: ", error);
    alert("Failed to place order. Please try again.");
  }
}

// Helper function to calculate the total price
function calculateTotalPrice(cartItems, foodList) {
  let totalAmount = 0;

  // Ensure foodList is an array
  const foodArray = Array.isArray(foodList) ? foodList : Object.values(foodList);

  Object.keys(cartItems).forEach((itemId) => {
    const item = foodArray.find((food) => food._id === itemId);
    if (item) {
      totalAmount += item.price * cartItems[itemId];
    }
  });

  return totalAmount;
}

// Helper function to get selected items
function getSelectedItems(cartItems, foodList) {
  const selectedItems = [];
  const foodArray = Array.isArray(foodList) ? foodList : Object.values(foodList); // Ensure it's an array

  Object.keys(cartItems).forEach((itemId) => {
    const item = foodArray.find((food) => food._id === itemId);
    if (item && cartItems[itemId] > 0) {
      selectedItems.push({
        name: item.name,
        price: item.price,
        quantity: cartItems[itemId],
        totalPrice: item.price * cartItems[itemId],
      });
    }
  });

  return selectedItems;
}
