'use client';
import React, { useEffect, useState } from 'react';
import { db } from '../../../Components/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import '../admin.css';

export default function AdminListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      const snap = await getDocs(collection(db, 'foodItems'));
      setList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      toast.error('Error fetching items: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFood = async (id) => {
    if (!confirm('Remove this item?')) return;
    try {
      await deleteDoc(doc(db, 'foodItems', id));
      toast.success('Item removed');
      fetchList();
    } catch (err) {
      toast.error('Error: ' + err.message);
    }
  };

  useEffect(() => { fetchList(); }, []);

  if (loading) return <p style={{ color: '#888', fontFamily: 'sans-serif' }}>Loading items…</p>;

  return (
    <div>
      <h1 className="admin-page-title">Food Items</h1>
      <p className="admin-page-sub">{list.length} items in the menu</p>

      {list.length === 0 ? (
        <div className="admin-no-data">No food items found. Add some from the Add Item page.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item.id}>
                  <td>
                    {item.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.image} alt={item.name} className="admin-list-img" />
                    ) : (
                      <div style={{ width: 56, height: 56, background: '#2e2e2e', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>—</div>
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <button className="admin-remove-btn" onClick={() => removeFood(item.id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
