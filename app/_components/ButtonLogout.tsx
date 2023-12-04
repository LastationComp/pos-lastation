'use client'
import React from 'react'
import {signOut} from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation';
export default function ButtonLogout() {
  const router = useRouter()
  const handleLogout = async() => {
    await signOut({ redirect: true });

  }
  return (
    <button className="bg-red-700 rounded px-3" onClick={() => handleLogout()}>
      Logout
    </button>
  );
}
