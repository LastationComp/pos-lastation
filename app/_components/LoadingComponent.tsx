
import { CircularProgress } from '@nextui-org/react';
import React from 'react'

export default function LoadingComponent() {
  return (
    <div className="flex justify-center my-5">
      <div className="flex items-center gap-3">
        <CircularProgress aria-label='loading-progress'  />
        <span>Loading...</span>
      </div>
    </div>
  );
}
