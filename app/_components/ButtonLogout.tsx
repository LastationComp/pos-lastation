'use client'
import React, { useState } from 'react'
import {signOut} from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation';
import nProgress from 'nprogress';
export default function ButtonLogout() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const handleLogout = async() => {
    nProgress.start();
    setIsLoading(true)
    await signOut({ redirect: true });
    // return router.push('/')

  }
  return (
    <button className="bg-red-700 rounded px-3 py-1 text-white" onClick={() => handleLogout()}>
      {isLoading ? 'Logout...' : "Logout"}
    </button>
  );
}
