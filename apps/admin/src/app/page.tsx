'use client';

import React, { useEffect, useState } from 'react';
import AdminAuth from '@/app/auth/emailandpassword/Admin.auth';
import MainScreen from '@/app/Admin.Dashboard/Mainscreen/MainScreen';
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-[#121212]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-bg-light dark:bg-[#121212] transition-colors duration-300">
      {user ? <MainScreen /> : <AdminAuth />}
    </main>
  );
}
