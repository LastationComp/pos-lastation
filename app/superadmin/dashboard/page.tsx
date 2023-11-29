'use client'
import React from 'react'
import {signOut} from 'next-auth/react'
export default function Dashboard() {
  return (
    <>
        
      <div>Ini Dashboard</div>
      <button onClick={() => signOut()}>Logout</button>
    </>
  );
}
