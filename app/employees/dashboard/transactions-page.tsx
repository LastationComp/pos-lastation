'use client';

import React, { useState } from 'react';
import ButtonTransactionHistory from './button-transaction-history';
import PosTableNew from '@/app/_lib/NextUiPos/PosTable';
import TransactionLists from '@/app/_components/employees/transactions/TransactionLists';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Products } from '@prisma/client';
import useSWR from 'swr';
import { fetcher } from '@/app/_lib/Fetcher';
import LoadingComponent from '@/app/_components/LoadingComponent';
import { Input, Tooltip } from '@nextui-org/react';

export default function TransactionsPage({ session }: { session: any }) {
  const { data, mutate } = useSWR(`/api/employee/transactions?license=${session?.user?.license_key}`, fetcher);
  const [transactionLists, setTransactionLists]: any = useState([]);
  const [barcode, setBarcode] = useState('');
  const checkSelectedProduct = (id: string) => {
    const checkIsSelected = transactionLists.find((tsx: Products) => tsx.id === id);
    if (!checkIsSelected) return true;
    return false;
  };

  const reloadMutate = () => {
    mutate(data);
  };

  const sortFilter = (a: any, b: any) => {
    const checkIsSelected = transactionLists.find((trx: Products) => trx.id === a.id);
    const checkIsSelected2 = transactionLists.find((trx: Products) => trx.id === b.id);
    if (checkIsSelected && !checkIsSelected2) return -1;
    if (!checkIsSelected && checkIsSelected2) return 1;
    if (a.product_name < b.product_name) return -1;
    if (a.product_name > b.product_name) return 1;
    return 0;
  };

  const transactionListsData = data?.list_products.sort(sortFilter).map((trx: any, i: number) => {
    return {
      key: i + 1,
      no: i + 1,
      barcode: trx.barcode,
      product_name: trx.product_name,
      action: checkSelectedProduct(trx.id) && (
        <Tooltip content="Select" placement={'left'} className='bg-posblue'>
          <button
            onClick={() => {
              let transactions = [...transactionLists];

              transactions.push({
                ...trx,
                sel_id: trx.sellingUnits[0].id,
                price: trx.sellingUnits[0].price,
                total_price: trx.sellingUnits[0].price * 1,
              });

              setTransactionLists(transactions);
            }}
            className="bg-posblue rounded px-2"
          >
            <FontAwesomeIcon icon={faCheck} />
          </button>
        </Tooltip>
      ),
    };
  });

  const inputByBarcode = () => {
    const newTrx = transactionLists.map((oldTrx: any) => {
      if (oldTrx.barcode === barcode)
        return {
          ...oldTrx,
          qty: oldTrx.qty + 1,
          total_price: oldTrx.price * (oldTrx.qty + 1),
        };

      return oldTrx;
    });

    setTransactionLists(newTrx);
  };

  const findOrCreateByBarcode = () => {
    const newTrx = data?.list_products.find((trx: any) => trx.barcode === barcode);
    if (!newTrx) return;

    let newTrxList = [...transactionLists];

    newTrxList.push({
      ...newTrx,
      sel_id: newTrx.sellingUnits[0].id,
      price: newTrx.sellingUnits[0].price,
      total_price: newTrx.sellingUnits[0].price * 1,
    });

    setTransactionLists(newTrxList);
  };
  return (
    <div className="grid grid-cols-6 h-max gap-5 ">
      <div className="bg-white drop-shadow-xl rounded-lg p-5 col-span-6 md:col-span-3">
        <div className="flex justify-between items-center">
          <Input
            size={'sm'}
            radius="full"
            startContent={<FontAwesomeIcon icon={faSearch} />}
            placeholder="Input by barcode"
            value={barcode}
            onValueChange={(val) => setBarcode(val)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const checkTrxList = transactionLists.find((trx: any) => trx.barcode === barcode);
                if (checkTrxList) {
                  return inputByBarcode();
                }
                return findOrCreateByBarcode();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') setBarcode('');
            }}
            className="w-1/2"
          />
          <ButtonTransactionHistory />
        </div>
        {!data && <LoadingComponent />}
        {data && <PosTableNew columns={['Barcode', 'Product Name', 'Action']} data={transactionListsData} />}
      </div>
      <div className="bg-white shadow-md rounded-lg p-3 col-span-6 md:col-span-3 ">
        <TransactionLists mutate={reloadMutate} session={session} transactions={transactionLists} setTransaction={setTransactionLists} />
      </div>
    </div>
  );
}
