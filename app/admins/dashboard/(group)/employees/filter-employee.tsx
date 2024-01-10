'use client';

import { Switch } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';

export default function FilterEmployee() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = useCallback(
    (name: string, value: boolean) => {
      let finalValue = value ? '1' : '0';
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, finalValue);
      return params.toString();
    },
    [searchParams]
  );
  return <Switch size="sm" onValueChange={(e) => router.push(pathname + '?' + createQueryString('show', e))}></Switch>;
}
