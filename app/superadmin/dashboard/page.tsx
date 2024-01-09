import LoadingComponent from '@/app/_components/LoadingComponent';
import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const DashboardCard = dynamic(() => import('./dashboard-card'));
export default function SuperAdminDashboard() {
  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <Suspense fallback={<LoadingComponent />}>
          <DashboardCard />
        </Suspense>
      </div>
    </>
  );
}
