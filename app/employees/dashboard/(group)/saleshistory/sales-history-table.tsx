'use client';

import LoadingComponent from '@/app/_components/LoadingComponent';
import { formatDate, formatDateOnly, formatTimeOnly } from '@/app/_lib/DateFormat';
import { fetcher } from '@/app/_lib/Fetcher';
import PosTableNew from '@/app/_lib/NextUiPos/PosTable';
import { formatNumber, formatRupiah } from '@/app/_lib/RupiahFormat';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import React, { useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import printJS from 'print-js';
import { useReactToPrint } from 'react-to-print';

export default function SalesHistoryTable({ session }: { session: any }) {
  const license_key = session?.user?.license_key;

  const [showReceipt, setShowReceipt] = useState(false);
  const printRef = useRef(null);
  const [noRef, setNoRef] = useState('');
  const { data } = useSWR(`/api/employee/saleshistory?license=${license_key}`, fetcher);
  const salesDetails = useSWR(`/api/employee/saleshistory/${noRef}`, fetcher);
  const receipt = useMemo(() => {
    return salesDetails.data;
  }, [salesDetails]);

  const handleReceipt = (no_ref: string) => {
    setShowReceipt(true);
    setNoRef(no_ref);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });
  
  const salesHistoryData = data?.sales_history.map((trx: any, index: number) => {
    return {
      key: index + 1,
      no: index + 1,
      no_references: trx.no_ref,
      date: formatDate(trx.created_at),
      employee: trx?.employee?.name,
      total: formatRupiah(trx.total_price),
      action: (
        <>
          <button onClick={() => handleReceipt(trx.no_ref)} className="text-black bg-teal-300 px-5 py-1 rounded-md hover:text-white hover:bg-teal-500 transition">
            <FontAwesomeIcon icon={faEye} />
          </button>
        </>
      ),
    };
  });

  if (!data) return <LoadingComponent />;
  return (
    <>
      <Modal isOpen={showReceipt} onOpenChange={(isopen) => setShowReceipt(isopen)}>
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader>Transaction Details</ModalHeader>
              <ModalBody>
                {!receipt && <LoadingComponent />}
                {receipt?.receiptDetail && (
                  <>
                    <div className="wrapper my-3" id="print-out" ref={printRef}>
                      <div className="flex flex-col">
                        <div className="flex justify-center p-3">
                          <div className="flex gap-1">
                            <div className="flex flex-col">
                              <h1 className="flex justify-center text-sm font-semibold">{receipt?.receiptDetail?.employee?.admin?.client?.client_name}</h1>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center mt-2">
                          <div className="grid grid-cols-2 gap-y-1 gap-5 w-full px-5">
                            <div className="text-xs font-semibold">Kasir : {receipt?.receiptDetail?.employee?.name}</div>
                            <div className="text-xs font-semibold">Member : {receipt?.receiptDetail?.customer?.name ?? '-'}</div>
                            <div className="text-xs font-semibold">Waktu : {formatDateOnly(receipt?.receiptDetail?.created_at)}</div>
                            <div className="text-xs font-semibold">{formatTimeOnly(receipt?.receiptDetail?.created_at)}</div>
                          </div>
                        </div>
                        <div className="p-5">
                          <table className="w-full table-auto">
                            <thead className="border border-x-0 border-y-2 border-dashed border-black">
                              <tr>
                                <th className="text-start text-xs py-2 w-1/2">Produk</th>
                                <th className="text-center text-xs">Qty</th>
                                <th className="text-center text-xs">Harga</th>
                                <th className="text-center text-xs">Total</th>
                              </tr>
                            </thead>
                            <tbody className="border border-x-0 border-y-2 border-dashed border-black">
                              {receipt &&
                                receipt?.receiptDetail?.transactionLists.map((receipt: any, index: number) => (
                                  <tr key={index + 1}>
                                    <td className="text-xs font-semibold py-2">{receipt?.sellingUnit?.product?.product_name}</td>
                                    <td className="text-center text-xs font-semibold py-2">{receipt?.qty}</td>
                                    <td className="text-center text-xs font-semibold py-2">{formatNumber(receipt?.price_per_qty)}</td>
                                    <td className="text-center text-xs font-semibold py-2">{formatNumber(receipt?.total_price)}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          <div className="pt-2">
                            <h1 className="text-xs font-semibold py-1">Total : {formatRupiah(Number(receipt?.receiptDetail?.total_price))},</h1>
                            <h1 className="text-xs font-semibold py-1">Tunai : {formatRupiah(receipt?.receiptDetail?.pay)},</h1>
                            <h1 className="text-xs font-semibold py-1">Kembali : {formatRupiah(receipt?.receiptDetail?.change)}</h1>
                          </div>
                          <div className="border border-x-0 border-y-[1px] border-dashed border-black"></div>
                          <div className="flex justify-center">
                            <h1 className="text-xs font-semibold text-center py-2">
                              Terima Kasih Atas Kunjungan Anda <br />
                              Periksa Barang sebelum dibeli <br />
                              note : Barang yang sudah dibeli tidak bisa ditukar
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Button onClick={handlePrint}>Print</Button>
                    </div>
                  </>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <PosTableNew columns={['No References', 'Date', 'Employee', 'Total', 'Action']} data={salesHistoryData} />
    </>
  );
}
