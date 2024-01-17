'use client';

import PosButton from '@/app/_components/PosButton';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import React from 'react';

export default function ButtonTransactionHistory() {
  const router = useRouter();
  const handleButton = () => {
    nProgress.start();
    router.push('dashboard/saleshistory');
  };
  return (
    <PosButton icon={faClockRotateLeft} onClick={handleButton}>
      Transactions History
    </PosButton>
  );
}
