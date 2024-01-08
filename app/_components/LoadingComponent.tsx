
import { CircularProgress } from '@nextui-org/react';
import React from 'react'

export default function LoadingComponent() {
  return (
    <div className="flex justify-center my-5">
      <div className="flex items-center gap-3">
        <CircularProgress />
        <span>Loading...</span>
      </div>
    </div>
  );
}
