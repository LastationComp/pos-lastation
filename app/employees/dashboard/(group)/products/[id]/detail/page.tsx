import React from 'react';
import ProductDetail from './product-detail';
import BackButton from './back-button';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';

export default async function PageProductDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <div className="bg-white rounded-md p-3 shadow-lg mt-3 mx-3">
        <div className="text-lg font-semibold">Product detail</div>
        <div className="grid grid-cols-2 gap-5">
          <ProductDetail id={params.id} session={session} />
          <div className="flex col-span-2 justify-end ">
            <BackButton />
          </div>
        </div>
      </div>
    </>
  );
}
