'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import gsap from 'gsap';
import StoreContextProvider from '../context/StoreContext';
import Navbar from '../Components/navbar/Navbar';
import { auth, firebaseSignOut } from '../Components/firebase';

export default function ClientProviders({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [framesLoaded, setFramesLoaded] = useState(true);
  const pathname = usePathname();
  const loaderRef = useRef(null);
  const loaderContentRef = useRef(null);
  const loaderTweenRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.readyState === 'complete') {
      setPageLoaded(true);
      return;
    }

    const handleLoad = () => setPageLoaded(true);
    window.addEventListener('load', handleLoad, { once: true });
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const needsFrames = pathname === '/home' || pathname === '/';
    if (!needsFrames) {
      setFramesLoaded(true);
      return;
    }

    const hasFrames = window.__ccFramesLoaded === true;
    setFramesLoaded(hasFrames);
    if (hasFrames) return;

    const handleFramesLoaded = () => setFramesLoaded(true);
    window.addEventListener('cc:frames-loaded', handleFramesLoaded);
    return () => window.removeEventListener('cc:frames-loaded', handleFramesLoaded);
  }, [pathname]);

  useEffect(() => {
    if (!loaderRef.current || !loaderContentRef.current) return;

    if (loaderTweenRef.current) {
      loaderTweenRef.current.kill();
    }

    if (loading || !pageLoaded || !framesLoaded) {
      setShowLoader(true);
      gsap.set(loaderRef.current, { autoAlpha: 1, pointerEvents: 'auto' });
      gsap.set(loaderContentRef.current, { y: 10, scale: 0.98, opacity: 0 });
      gsap.to(loaderContentRef.current, {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
      });
      return;
    }

    setShowLoader(true);
    gsap.set(loaderRef.current, { autoAlpha: 1, pointerEvents: 'auto' });
    gsap.set(loaderContentRef.current, { y: 0, scale: 1, opacity: 1 });

    loaderTweenRef.current = gsap.to(loaderRef.current, {
      autoAlpha: 0,
      duration: 0.35,
      ease: 'power2.out',
      onComplete: () => {
        setShowLoader(false);
      },
    });

    return () => {
      if (loaderTweenRef.current) {
        loaderTweenRef.current.kill();
      }
    };
  }, [pathname, loading, pageLoaded, framesLoaded]);

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

  if ((loading || !pageLoaded || !framesLoaded) && !showLoader) return null;

  return (
    <StoreContextProvider>
      {showLoader && (
        <div className="page-loader" ref={loaderRef} aria-hidden="true">
          <div className="page-loader__glass" ref={loaderContentRef}>
            <span className="page-loader__brand">CampusCraves</span>
            <span className="page-loader__bar" />
          </div>
        </div>
      )}
      {!isAuthPage && !isAdminPage && <Navbar user={user} onLogout={handleLogout} />}
      {children}
      <ToastContainer />
    </StoreContextProvider>
  );
}
