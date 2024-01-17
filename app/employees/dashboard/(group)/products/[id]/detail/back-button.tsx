'use client';

import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function BackButton() {
  const router = useRouter();
  return (
    <button onClick={() => router.back()} className="bg-posgray flex items-center gap-3 px-3 py-2 hover:bg-gray-600 text-white transition rounded-full">
      <FontAwesomeIcon icon={faCaretLeft} />
      Back
    </button>
  );
}
