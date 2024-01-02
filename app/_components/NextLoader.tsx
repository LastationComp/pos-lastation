'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import NextTopLoader from 'nextjs-toploader';
import nProgress from 'nprogress';
import React, { useEffect } from 'react';

export default function NextLoader() {
  function FinishingLoader() {
    const pathname = usePathname();

    const router = useRouter();

    const searchParams = useSearchParams();

    useEffect(() => {
      nProgress.done();
    }, [pathname, router, searchParams]);

    return null;
  }

  return (
    <>
      <FinishingLoader />
      <NextTopLoader />
    </>
  );
}
