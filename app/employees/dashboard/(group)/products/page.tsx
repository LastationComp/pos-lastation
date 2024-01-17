import React from 'react';
import ButtonAdd from './button-add';
import SearchProducts from './search-products';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';
import dynamic from 'next/dynamic';

const ProductsTable = dynamic(() => import('./products-table'), { ssr: false });
export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  return (
    <div className="mx-3 mt-3">
      <div className="text-2xl font-bold">Products Lists</div>
      <div className="bg-white rounded-md shadow-lg p-4">
        <div className="flex justify-between items-center">
          <SearchProducts />
          <ButtonAdd session={session} />
        </div>
        <ProductsTable session={session} />
      </div>
    </div>
  );
}
