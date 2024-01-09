import LoadingComponent from '@/app/_components/LoadingComponent';
import { Suspense } from 'react';
import AddButton from './add-button';
import SearchUnit from './search-unit';
import dynamic from 'next/dynamic';

const UnitTable = dynamic(() => import('./unit-table'));

export default function SuperAdminUnitsPage() {
  return (
    <>
      <div>
        <div className="text-xl font-semibold">Units</div>
        <div className="flex justify-between items-center">
          <div>
            <SearchUnit />
          </div>
          <AddButton />
        </div>
        <Suspense fallback={<LoadingComponent />}>
          <UnitTable />
        </Suspense>
      </div>
    </>
  );
}
