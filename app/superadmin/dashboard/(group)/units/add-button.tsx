'use client';

import PosButton from '@/app/_components/PosButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import React from 'react';

export default function AddButton() {
  const router = useRouter();
  return (
    <PosButton
      icon={faPlus}
      onClick={() => {
        nProgress.start();
        router.push('units/add');
      }}
    >
      Add Unit
    </PosButton>
  );
}
