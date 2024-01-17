'use client';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

export default function SearchProducts() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = (name: string, value: string) => {
    const url = new URLSearchParams(searchParams.toString());

    url.set(name, value);
    if (!value) url.delete(name);

    return url.toString();
  };
  return (
    <Input
      placeholder="Search by product name or barcode"
      className="w-1/2"
      radius={'full'}
      size={'sm'}
      startContent={<FontAwesomeIcon icon={faSearch} />}
      onValueChange={(val) => router.push(pathname + '?' + createQueryString('q', val))}
      type="search"
    />
  );
}
