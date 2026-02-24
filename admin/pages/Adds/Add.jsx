import React, { useState } from 'react';
import { db } from '../../../src/Components/firebase';
import { collection, doc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import './Add.css';
import { assets } from '../../src/assets/assets';

const Add = () => {
  const [image, setImage] = useState("");
  const [data, setData] = useState({
    id: "",  // User-entered ID
    name: "",
    description: "",
    price: "",
    category: "Beverages" // Default category
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image || !data.id || !data.name || !data.description || !data.price || !data.category) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const docRef = doc(collection(db, "foodItems"), data.id); // Use user-provided ID
      await setDoc(docRef, {
        _id: data.id,  // Store the user-entered ID
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        image: image, // Cloudinary URL
      });

      setData({ id: "", name: "", description: "", price: "", category: "Beverages" });
      setImage("");
      toast.success("Product added successfully!");
    } catch (error) {
      toast.error("Error adding product: " + error.message);
    }
  };

  return (
    <div className='add'>
      <form className='flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img 
              className="preview-image" 
              src={image ? image : assets.upload_area} 
              alt="Upload Preview" 
            />
          </label>
          <input 
            type="text" 
            placeholder="  Enter Image URL" 
            value={image} 
            onChange={(e) => setImage(e.target.value)} 
            required 
          />
        </div>

        <div className="add-product-id flex-col">
          <p>Product ID</p>
          <input 
            onChange={onChangeHandler} 
            value={data.id} 
            type="text" 
            name="id" 
            placeholder='  Enter unique ID' 
            required 
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input 
            onChange={onChangeHandler} 
            value={data.name} 
            type="text" 
            name="name" 
            placeholder='Type here' 
            required 
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea 
            onChange={onChangeHandler} 
            value={data.description} 
            name="description" 
            rows="6" 
            placeholder='Write content here' 
            required
          ></textarea>
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select 
              onChange={onChangeHandler} 
              name="category" 
              value={data.category}
              required
            >
              <option value="Beverages">Beverages</option>
              <option value="Indian Snacks">Indian Snacks</option>
              <option value="Rice">Rice</option>
              <option value="South-Indian">South-Indian</option>
              <option value="Today's Special">Today's Special</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input 
              onChange={onChangeHandler} 
              value={data.price} 
              type="number" 
              name="price" 
              placeholder="Enter price (e.g., 140)" 
              required 
            />
          </div>
        </div>

        <button type='submit' className='add-btn'>Add</button>
      </form>
    </div>
  );
};

export default Add;
