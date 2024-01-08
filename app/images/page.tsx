'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function Images() {
  const [blob, setBlob]: any = useState();
  const image = async () => {
    const img = await fetch('/api/images/1', {
      cache: 'no-store',
    });

    const res = await img.text();
    setBlob(res);
  };

  useEffect(() => {
    image();
  }, []);
  return <Image src={'http://localhost:3000/api/images/clr1mb54g000787avveuukc7b/e3deeae3-58ac-4a3c-ac3c-301bdda052c2.jpeg'} width={200} height={200} alt="image" />;
}
