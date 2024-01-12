'use client';

import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import useSWR from 'swr';
import { formatRupiah } from '@/app/_lib/RupiahFormat';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, Tooltip, useDisclosure } from '@nextui-org/react';
import { fetcher } from '@/app/_lib/Fetcher';
import { formatDate, formatDateOnly } from '@/app/_lib/DateFormat';
import PosTableNew from '@/app/_lib/NextUiPos/PosTable';
import LoadingComponent from '@/app/_components/LoadingComponent';

export default function SalesHistoryTable({ session }: { session: any }) {
  const [trxRef, setTrxRef] = useState('');
  const [query, setQuery] = useState('');
  const res = useSWR(`/api/admins/dashboard/${session?.user?.id}/${trxRef}`, fetcher);
  const sales_history = useSWR(`/api/admins/dashboard/${session?.user?.id}/sales_history?q=${query}`, fetcher, {
    keepPreviousData: true,
  }).data;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const getTrxDetail = (trxRef: string) => {
    setTrxRef(trxRef);
  };

  const trx: any = useMemo(() => {
    return res.data;
  }, [res]);
  const getSalesHistory = () => {
    let newData: any[] = [];

    sales_history?.transactions.forEach((trx: any, i: number) => {
      newData.push({
        key: i + 1,
        no_references: trx.no_ref,
        date: formatDate(trx.created_at),
        employee: trx.employee.name,
        total: formatRupiah(trx.total_price),
        action: (
          <Tooltip content={'Detail'} showArrow={true} placement={'left'} color={'default'}>
            <Button isIconOnly onPress={onOpen} onPressStart={() => getTrxDetail(trx.no_ref)} className="bg-posblue" size="sm">
              <FontAwesomeIcon icon={faEye} />
            </Button>
          </Tooltip>
        ),
      });
    });

    return newData;
  };
  return (
    <>
      <Modal placement={'top-center'} isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1>Transaction Details</h1>
                <Skeleton isLoaded={trx?.no_ref}>
                  <span className="text-sm font-normal">No References : {trx?.no_ref}</span>
                </Skeleton>
                <Skeleton isLoaded={trx?.created_at}>
                  <span className="text-sm font-normal">Date : {formatDate(trx?.created_at)}</span>
                </Skeleton>
                <Skeleton isLoaded={trx?.employee?.name}>
                  <span className="text-sm font-normal">Employee : {trx?.employee?.name}</span>
                </Skeleton>
              </ModalHeader>
              <ModalBody>
                <span>Customer : {trx?.customer?.name ?? '-'}</span>

                <h1>Product Lists</h1>
                {!trx?.transactionLists && <LoadingComponent />}
                {trx?.transactionLists && (
                  <table className="table-auto border-collapse border border-1">
                    <thead>
                      <tr>
                        <th className="border border-1 text-start">Product</th>
                        <th className="border border-1">Unit</th>
                        <th className="border border-1">Qty</th>
                        <th className="border border-1">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trx?.transactionLists.length !== 0 &&
                        trx?.transactionLists.map((trxList: any, i: number) => (
                          <tr key={i} className="text-center">
                            <td className="border border-1 text-start">{trxList.sellingUnit.product.product_name}</td>
                            <td className="border border-1">{trxList.sellingUnit.unit.name}</td>
                            <td className="border border-1">{`${trxList.qty} x ${trxList.sellingUnit.price}`}</td>
                            <td className="border border-1">{formatRupiah(trxList.total_price)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
                <Skeleton isLoaded={trx?.total_price}>
                  <div className="text-end">Total Price : {formatRupiah(trx?.total_price)}</div>
                </Skeleton>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="flex my-3">
        <Input placeholder="Search by No References..." startContent={<FontAwesomeIcon icon={faSearch} />} size={'sm'} radius={'full'} type="search" onValueChange={(value) => setQuery(value)} />
      </div>
      <Skeleton isLoaded={sales_history}>
        <PosTableNew data={getSalesHistory()} columns={['NO References', 'Date', 'Employee', 'Total', 'Action']} />
      </Skeleton>
    </>
  );
}
