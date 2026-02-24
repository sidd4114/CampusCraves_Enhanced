'use client';
import React, { useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import '../admin.css';

const CATEGORIES = ['Beverages', 'Indian Snacks', 'Rice', 'South-Indian', "Today's Special", 'Noodles'];

export default function AdminAddPage() {
  const [image, setImage] = useState('');
  const [data, setData] = useState({ id: '', name: '', description: '', price: '', category: 'Beverages' });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!image || !data.id || !data.name || !data.description || !data.price || !data.category) {
      toast.error('All fields are required.');
      return;
    }
    setSubmitting(true);
    try {
      const docRef = doc(collection(db, 'foodItems'), data.id);
      await setDoc(docRef, {
        _id: data.id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        image,
      });
      setData({ id: '', name: '', description: '', price: '', category: 'Beverages' });
      setImage('');
      toast.success('Item added successfully!');
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="admin-page-title">Add Food Item</h1>
      <p className="admin-page-sub">Add a new item to the canteen menu</p>

      <form className="admin-add-form" onSubmit={onSubmit}>

        {/* Image URL */}
        <div className="admin-form-group">
          <label className="admin-form-label">Image URL</label>
          {image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={image} alt="Preview" className="admin-img-preview" />
          )}
          <input
            type="text"
            className="admin-form-input"
            placeholder="Paste image URL (e.g. from Cloudinary)"
            value={image}
            onChange={e => setImage(e.target.value)}
            required
          />
        </div>

        {/* Product ID */}
        <div className="admin-form-group">
          <label className="admin-form-label">Product ID</label>
          <input
            type="text"
            name="id"
            className="admin-form-input"
            placeholder="Unique identifier (e.g. burger_01)"
            value={data.id}
            onChange={onChange}
            required
          />
        </div>

        {/* Name */}
        <div className="admin-form-group">
          <label className="admin-form-label">Product Name</label>
          <input
            type="text"
            name="name"
            className="admin-form-input"
            placeholder="e.g. Veg Burger"
            value={data.name}
            onChange={onChange}
            required
          />
        </div>

        {/* Description */}
        <div className="admin-form-group">
          <label className="admin-form-label">Description</label>
          <textarea
            name="description"
            className="admin-form-textarea"
            placeholder="Brief description of the item…"
            value={data.description}
            onChange={onChange}
            rows={4}
            required
          />
        </div>

        {/* Category & Price */}
        <div className="admin-form-row">
          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-form-label">Category</label>
            <select name="category" className="admin-form-select" value={data.category} onChange={onChange} required>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-form-group" style={{ margin: 0 }}>
            <label className="admin-form-label">Price (₹)</label>
            <input
              type="number"
              name="price"
              className="admin-form-input"
              placeholder="e.g. 140"
              value={data.price}
              onChange={onChange}
              min="1"
              required
            />
          </div>
        </div>

        <button type="submit" className="admin-submit-btn" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add Item'}
        </button>
      </form>
    </div>
  );
}
