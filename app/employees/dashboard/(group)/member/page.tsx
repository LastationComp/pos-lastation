'use client'
import PosButton from '@/app/_components/PosButton'
import PosTable from '@/app/_components/PosTable'
import { fetcher } from '@/app/_lib/Fetcher'
import PosTableNew from '@/app/_lib/NextUiPos/PosTable'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import Swal from 'sweetalert2'
import useSWR from 'swr'


export default function EmployeeMemberPage() {

  const session : any = useSession()
  const {data, mutate} = useSWR(`/api/employee/members?license=${session?.data?.user?.license_key}`, fetcher)

  const router = useRouter()

  const handleWarning = async (name:string, customer_code:string) => {
    Swal.fire({
      title: `Delete this member?`,
      text: `${name} (${customer_code})`,
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) return handleDelete(name, customer_code);
    });
  }

  const handleDelete = async (id:string , customer_code:string) => {
    const res = await fetch("/api/employee/members/" + customer_code, {
      method: "DELETE"
    })
    if(!res) 
    return Swal.fire({
      title: `Failed to delete ${customer_code}`,
      icon: "error"
    });

    mutate(data)

    Swal.fire({
      title: `${customer_code} Successfully Deleted!`,
      icon: "success"
    });
  }

  const memberData = () => {
    let newData: any[] = [];
    data?.members.map((member: any, i: number) => {
      newData.push({
        key: i + 1,
        no: i + 1,
        customer_code: member.customer_code,
        name: member.name,
        email: member.email,
        phone: member.phone,
        point: member.point,
        action: <div className='flex gap-2'>
        <button onClick={() => handleWarning(member.name, member.customer_code)} className='text-white bg-red-500 w-[30px] h-[30px] rounded-md' ><FontAwesomeIcon icon={faTrash}/></button>
        <button onClick={() => router.push(`/employees/dashboard/member/${member.customer_code}/edit`)} className='text-white bg-yellow-500 w-[30px] h-[30px] rounded-md'><FontAwesomeIcon icon={faPencil}/></button>
      </div>
      });
    });

    return newData;

  }
  

  return (
    <>
    <div className='mt-5'>
      <div className='wrapper p-5 rounded-xl shadow-lg w-full bg-white'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>List Members</h1>
          <PosButton icon={faPlus} onClick={() => router.push('/employees/dashboard/member/add')}>Add Member</PosButton>
        </div>
        {/* <div className='flex justify-between items-center'>
          <h3>Show
            <div className=''></div>
          </h3>
          <input type="text" className='outline outline-1 outline-posgray px-3 rounded-md w-[200px] h-[35px]' placeholder='Search Member' />
        </div> */}
        <div className='mt-3'>
        <PosTableNew columns={['Customer Code', 'Name', 'Email', 'Phone', 'Point', 'Action']} data={memberData()}/>
        </div> 
      </div>
    </div>
    </>
  )
}
