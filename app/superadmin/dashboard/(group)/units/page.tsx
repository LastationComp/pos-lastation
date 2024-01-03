'use client';

import LoadingComponent from '@/app/_components/LoadingComponent';
import PosButton from '@/app/_components/PosButton';
import PosTable from '@/app/_components/PosTable';
import { fetcher } from '@/app/_lib/Fetcher';
import PosTableNew from '@/app/_lib/NextUiPos/PosTable';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input, Pagination } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';
import { useState } from 'react';
import Swal from 'sweetalert2';
import useSWR from 'swr';

export default function SuperAdminUnitsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const { data, mutate } = useSWR(`/api/superadmin/units?page=${page}&paginate=10&q=${query}`, fetcher, {
    keepPreviousData: true,
  });

  const handleWarning = async (id: any, name: string) => {
    Swal.fire({
      title: 'Are You Sure?',
      text: `Are You Sure Want To Delete ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) return handleDelete(id);
    });
  };

  const handleDelete = async (id: any) => {
    const res = await fetch('/api/superadmin/units/' + id, {
      method: 'DELETE',
    });

    if (res.ok && res.status == 200) {
      setPage(1);
      mutate(data);
    }
  };

  if (!data) return <LoadingComponent />;

  const getUnitData = () => {
    let dumpData: any[] = [];
    data?.units.forEach((data: any, i: number) => {
      dumpData.push({
        key: i + 1,
        no: i + 1,
        name: data.name,
        action: (
          <div>
            <button onClick={() => handleWarning(data.id, data.name)} className="font-medium text-red-600 dark:text-red-500 hover:underline pr-3">
              Delete
            </button>
            <button onClick={() => router.push('/superadmin/dashboard/units/' + data.id + '/edit')} className="font-medium text-yellow-800 dark:text-yellow-600 hover:underline">
              Edit
            </button>
          </div>
        ),
      });
    });
    return dumpData;
  };

  return (
    <>
      <div>
        <div className="text-xl font-semibold">Units</div>
        <div className="flex justify-between items-center">
          <div>
            <Input
              placeholder="Search by Unit"
              value={query}
              onChange={(e) => {
                setPage(1);
                setQuery(e.target.value);
              }}
              type="text"
              onClear={() => setQuery('')}
              isClearable
              startContent={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            />
          </div>
          <PosButton
            icon={faPlus}
            onClick={() => {
              nProgress.start();
              router.push('units/add');
            }}
          >
            Add Unit
          </PosButton>
        </div>
        {/* <PosTable fixed headers={['No', 'Name', 'Action']}>
        {data &&
          data?.units.map((data: any, i: number) => (
            <tr key={data.id} className="odd:bg-poslight even:bg-slate-200 ">
              <td className="p-3">{i + 1}</td>
              <td className="p-3">{data.name}</td>
              <td>
                <button onClick={() => handleWarning(data.id, data.name)} className="font-medium text-red-600 dark:text-red-500 hover:underline pr-3">
                  Delete
                </button>
                <button onClick={() => router.push('/superadmin/dashboard/units/' + data.id + '/edit')} className="font-medium text-yellow-800 dark:text-yellow-600 hover:underline">
                  Edit
                </button>
              </td>
            </tr>
          ))}
      </PosTable> */}
        <PosTableNew columns={['NO', 'Name', 'Action']} data={getUnitData()} />
        {data?.units.length !== 0 && (
          <div className="flex w-full justify-center">
            <Pagination isCompact disableAnimation showControls showShadow color="primary" page={page} total={data?.total_page} onChange={(page) => setPage(page)} />
          </div>
        )}
      </div>
    </>
  );
}
