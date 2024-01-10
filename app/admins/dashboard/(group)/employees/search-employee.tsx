'use client';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';

export default function SearchEmployee() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      if (!value) params.delete(name);
      return params.toString();
    },
    [searchParams]
  );
  return (
    <Input
      type="search"
      defaultValue={searchParams.get('q') ?? ''}
      onValueChange={(value) => router.push(pathname + '?' + createQueryString('q', value))}
      startContent={<FontAwesomeIcon icon={faSearch} />}
      radius={'full'}
      size={'sm'}
      placeholder="Input name Employee"
      className="rounded-full outline outline-1 outline-posblue"
    />
  );
}
