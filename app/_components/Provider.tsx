'use client';
import React, { Suspense } from 'react';
import { SessionProvider } from 'next-auth/react';
import LoadingComponent from './LoadingComponent';
export default function Provider({ children, session }: { children: React.ReactNode; session: any }) {
  return (
    <SessionProvider session={session}>
      <Suspense fallback={<LoadingComponent />}>{children}</Suspense>
    </SessionProvider>
  );
}
