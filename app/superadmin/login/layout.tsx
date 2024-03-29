import React from 'react';
import NextAuthProvider from '@/app/_components/NextAuthProvider';
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-screen bg-gray-700">
        <NextAuthProvider>{children}</NextAuthProvider>
      </div>
    </>
  );
}
