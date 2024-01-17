'use client';

import PosButton from '@/app/_components/PosButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import nProgress from 'nprogress';

export default function ButtonAdd() {
  const router = useRouter();
  const handleAdd = () => {
    nProgress.start();
    router.push('/employees/dashboard/members/add');
  };
  return (
    <PosButton icon={faPlus} onClick={handleAdd}>
      Add Member
    </PosButton>
  );
}
