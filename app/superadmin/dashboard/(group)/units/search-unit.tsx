'use client';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';

export default function SearchUnit() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <Input
      aria-label="Search Unit"
      radius="full"
      placeholder="Search by Unit"
      onChange={(e) => {
        if (!e.target.value) return router.push(pathname);
        return router.push(pathname + '?' + createQueryString('q', e.target.value));
      }}
      defaultValue={searchParams.get('q') ?? ''}
      type="search"
      startContent={<FontAwesomeIcon icon={faMagnifyingGlass} />}
    />
  );
}
