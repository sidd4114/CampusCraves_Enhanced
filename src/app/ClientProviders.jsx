'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import StoreContextProvider from '../context/StoreContext';
import Navbar from '../Components/navbar/Navbar';
import { auth, firebaseSignOut } from '../Components/firebase';

export default function ClientProviders({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast.success('You have logged out successfully!', {
        position: 'top-center',
        autoClose: 5000,
      });
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isAdminPage = pathname.startsWith('/admin');

  if (loading) return <div>Loading...</div>;

  return (
    <StoreContextProvider>
      {!isAuthPage && !isAdminPage && <Navbar user={user} onLogout={handleLogout} />}
      {children}
      <ToastContainer />
    </StoreContextProvider>
  );
}
