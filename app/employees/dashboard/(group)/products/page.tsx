'use client'

import PosButton from '@/app/_components/PosButton';
import PosTable from '@/app/_components/PosTable'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function ProductsPage() {
    const router = useRouter()
  return (
    <>
      <div>Ini Halaman Products</div>
      <div className="flex justify-between">
        <div>
            <PosButton icon={faPlusCircle} onClick={() => router.push('products/add')}>
                Add Product
            </PosButton>
        </div>
      </div>
      <PosTable fixed headers={['NO', 'Name', 'Smallest Unit', 'Action']}>
        <tr>
            <td className='p-3'>1</td>
            <td className='p-3'>Pecel</td>
            <td className='p-3'>Tes</td>
            <td className='p-3'><button>Delete</button></td>
        </tr>
      </PosTable>
    </>
  );
}
