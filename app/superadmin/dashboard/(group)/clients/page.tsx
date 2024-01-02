'use client';
import React, { BaseSyntheticEvent, Suspense, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import PosTable from '@/app/_components/PosTable';
import PosButton from '@/app/_components/PosButton';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer } from '@fortawesome/free-solid-svg-icons/faServer';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
// export const fetcher = (url: string) => fetch(url).then((res) => res.json());

import LoadingComponent from '@/app/_components/LoadingComponent';
import { fetcher } from '@/app/_lib/Fetcher';
import Swal from 'sweetalert2';
import { faUserCheck, faUserClock, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from '@nextui-org/react';
import { generateHeaders } from '@/app/_lib/NextUiPos/GenerateHeaderTable';
export default function Dashboard() {
  const router = useRouter();
  const { data, mutate } = useSWR('/api/superadmin/clients', fetcher, {
    revalidateOnMount: true,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [clientCode, setClientCode] = useState('');

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    const clipboard = document.getElementById(value);
    if (clipboard) {
      clipboard.innerHTML = 'Copied';
      setTimeout(() => {
        clipboard.innerHTML = 'Copy';
      }, 3000);
    }
  };

 

  const columns = generateHeaders(['NO', 'License Key', 'Client Name', 'Client Code', 'Username', 'Expires Time', 'Client Status', 'Action'])


  const handleUpdateExpires = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrMsg('');
    const formData = new FormData(e.target);
    const res = await fetch(`/api/superadmin/clients/expires`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_code: clientCode,
        service_days: formData.get('expires_days') ?? 0,
      }),
    });

    const result = await res.json();

    setIsLoading(false);

    if (!res.ok && res.status !== 200) {
      return setErrMsg(result?.message);
    }

    onClose();
    return mutate(data);
  };

  const handleWarning = async (client_code: string, client_name: string, isDeactivated: boolean) => {
    if (isDeactivated)
      return Swal.fire({
        title: 'Deactivate this Client?',
        text: `${client_name}`,
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
      }).then((res) => {
        if (res.isConfirmed) return handleDeactivate(client_code);
      });

    return Swal.fire({
      title: 'Activate this Client',
      text: `${client_name}`,
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) return handleActivate(client_code);
    });
  };

  const handleDeactivate = async (client_code: string) => {
    const res = await fetch(`/api/superadmin/clients/${client_code}`, {
      method: 'DELETE',
    });

    if (res) return mutate(data);
  };

  const handleActivate = async (client_code: string) => {
    const res = await fetch(`/api/superadmin/clients/${client_code}`, {
      method: 'PUT',
    });

    if (res) return mutate(data);
  };

  if (!data) return <LoadingComponent />;
  return (
    <>

      <Modal backdrop={'opaque'} isOpen={isOpen} onClose={onClose} >
        <ModalContent>
          {(onClose) => (
            <>
              <form action="" method="post" onSubmit={handleUpdateExpires}>
                <ModalHeader>Update Expires</ModalHeader>
                <ModalBody>
                  <div id="popup-expires" className="bg-white rounded p-3 flex flex-col">
                    {errMsg && <div className="bg-red-500 p-3 rounded text-white">{errMsg}</div>}
                    <label htmlFor="expires_days">Service Days</label>
                    <input type="number" id="expires_days" required name="expires_days" placeholder="Service Days..." className="rounded outline outline-1 outline-posblue shadow-md px-3 py-1" />
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button type="submit" disabled={isLoading} className="bg-posblue rounded px-3 py-2 my-1 hover:text-white hover:bg-teal-500 transition flex justify-center items-center gap-3">
                    <FontAwesomeIcon icon={isLoading ? faSpinner : faServer} spin={isLoading} />
                    {isLoading ? 'Updating...' : 'Update'}
                  </button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="text-xl font-semibold">Clients</div>
      <div className="flex justify-end items-center">
        <PosButton icon={faPlus} onClick={() => router.push('clients/add')}>
          Add Client
        </PosButton>
      </div>

      <Table aria-label="Client Table">
        <TableHeader columns={columns}>{(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}</TableHeader>
        <TableBody emptyContent={'No Units. Click "Add Unit" to add it.'}>
          {data &&
            data.map((data: any, i: number) => (
              <TableRow key={data.license_key} className="odd:bg-poslight even:bg-slate-200 ">
                <TableCell className="p-3">{i + 1}</TableCell>
                <TableCell className="p-3">
                  {/* {data.license_key} */}
                  <Chip variant='flat'>
                    Hidden
                  </Chip>
                  <button onClick={() => handleCopy(data.license_key)} id={data.license_key} className="rounded bg-gray-600  mx-1 p-1 text-white">
                    Copy
                  </button>
                </TableCell>
                <TableCell className="p-3">{data.client_name}</TableCell>
                <TableCell className="p-3">{data.client_code}</TableCell>
                <TableCell className="p-3">{data.admin.username}</TableCell>
                <TableCell className="p-3">{data.expires_left}</TableCell>
                <TableCell className="p-3">
                  {data.is_active ? (
                    <Chip color="success" variant={'flat'}>
                      Active
                    </Chip>
                  ) : (
                    <Chip color="danger" variant={'flat'}>
                      Non Active
                    </Chip>
                  )}
                </TableCell>
                <TableCell className="">
                  <div className="flex gap-3">
                    {data.is_active ? (
                      <Tooltip color="danger" closeDelay={0} placement={'left'} showArrow content={'Deactive Client'}>
                        <Button isIconOnly color="danger" size="sm" onClick={() => handleWarning(data.client_code, data.client_name, true)} aria-label="Deactive Employee">
                          <FontAwesomeIcon icon={faUserXmark} />
                        </Button>
                      </Tooltip>
                    ) : (
                      <Tooltip color="success" closeDelay={0} placement={'left'} showArrow content="Active Client">
                        <Button isIconOnly color="success" size="sm" onClick={() => handleWarning(data.client_code, data.client_name, false)} aria-label="Deactive Employee">
                          <FontAwesomeIcon icon={faUserCheck} />
                        </Button>
                      </Tooltip>
                    )}
                    <div className="-z-1">
                      <Tooltip color="primary" showArrow closeDelay={0} placement={'right'} content={'Update Expires'}>
                        <Button
                          isIconOnly
                          color="primary"
                          size="sm"
                          onClick={() => {
                            setClientCode(data.client_code);
                            onOpen();
                          }}
                          aria-label="Deactive Employee"
                        >
                          <FontAwesomeIcon className="mx-1" icon={faUserClock} />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {/* <PosTable fixed headers={['No', 'License Key', 'Client Name', 'Client Code', 'Username', 'Time Expires', 'Client Status', 'Action']}>
        {data &&
          data.map((data: any, i: number) => (
            <tr key={data.license_key} className="odd:bg-poslight even:bg-slate-200 ">
              <TableCell className="p-3">{i + 1}</TableCell>
              <TableCell className="p-3">
                {data.license_key}
                <button onClick={() => handleCopy(data.license_key)} id={data.license_key} className="rounded bg-gray-600  mx-1 p-1 text-white">
                  Copy
                </button>
              </TableCell>
              <TableCell className="p-3">{data.client_name}</TableCell>
              <TableCell className="p-3">{data.client_code}</TableCell>
              <TableCell className="p-3">{data.admin.username}</TableCell>
              <TableCell className="p-3">{data.expires_left}</TableCell>
              <TableCell className="p-3">
                {data.is_active ? (
                  <Chip color="success" variant={'flat'}>
                    Active
                  </Chip>
                ) : (
                  <Chip color="danger" variant={'flat'}>
                    Non Active
                  </Chip>
                )}
              </TableCell>
              <TableCell className="flex gap-3 items-center justify-center my-3 ">
                {data.is_active ? (
                  <Button isIconOnly color="danger" size="sm" onClick={() => handleWarning(data.client_code, data.client_name, true)} aria-label="Deactive Employee">
                    <FontAwesomeIcon icon={faUserXmark} />
                  </Button>
                ) : (
                  <Tooltip color="success" content="Active Client">
                    <Button isIconOnly color="success" size="sm" onClick={() => handleWarning(data.client_code, data.client_name, false)} aria-label="Deactive Employee">
                      <FontAwesomeIcon icon={faUserCheck} />
                    </Button>
                  </Tooltip>
                )}
                <div className="-z-1">
                  <Button
                    isIconOnly
                    color="primary"
                    size="sm"
                    onClick={() => {
                      setClientCode(data.client_code);
                      onOpen();
                    }}
                    aria-label="Deactive Employee"
                    className="-z-999"
                  >
                    <FontAwesomeIcon className="mx-1" icon={faUserClock} />
                  </Button>
                </div>
              </TableCell>
            </tr>
          ))}
      </PosTable> */}
    </>
  );
}
