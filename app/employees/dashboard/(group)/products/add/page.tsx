import React from 'react';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';
import dynamic from 'next/dynamic';

const FormAddProduct = dynamic(() => import('./form-add-product'), { ssr: false });
export default async function AddProductPage() {
  const session = await getServerSession(authOptions);
  return (
    <>
      <h1 className="font-bold text-xl">Add Product</h1>
      <div className="mx-3">
        <FormAddProduct session={session} />
      </div>
    </>
  );
}
