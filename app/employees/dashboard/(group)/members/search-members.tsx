'use client';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SearchMembers() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = (name: string, value: string) => {
    const url = new URLSearchParams(searchParams.toString());
    url.set(name, value);
    if (!value) url.delete(name);
    return url.toString();
  };
  return <Input size={'sm'} radius={'full'} placeholder="Search by name or code..." type="search" onValueChange={(val) => router.push(pathname + '?' + createQueryString('q', val))} startContent={<FontAwesomeIcon icon={faSearch} />} />;
}
