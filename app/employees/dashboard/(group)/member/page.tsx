'use client'
import PosButton from '@/app/_components/PosButton'
import PosTable from '@/app/_components/PosTable'
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import useSWR from 'swr'

export const fetcher = (url:string) => fetch(url).then(res => res.json())

export default function EmployeeMemberPage() {

  const {data, mutate} = useSWR("/api/employee/members", fetcher)
  

  return (
    <>
    <div className='mt-5'>
      <div className='wrapper p-5 rounded-xl shadow-md shadow- w-full  bg-white'>
        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>List Members</h1>
          <PosButton icon={faPlus} onClick={() => {}}>Add Member</PosButton>
        </div>
        <div className='flex justify-between items-center'>
          <h3>Show
            <div className=''></div>
          </h3>
          <input type="text" className='outline outline-1 outline-posgray px-3 rounded-md w-[200px] h-[35px]' placeholder='Search Product' />
        </div>
        <div className='mt-3'>
        <PosTable fixed headers={['Customer Code', 'Name', 'Email', 'Phone', 'Point', "Action"]}>
          {data && data.members.map((member : any, index:number) => (
            <tr key={index+1}>
              <td className='p-3'>{member.customer_code}</td>
              <td className='p-3'>{member.name}</td>
              <td className='p-3'>{member.email}</td>
              <td className='p-3'>{member.phone}</td>
              <td className='p-3'>{member.point}</td>
              <td className='p-3'>
                <div className='flex gap-2'>
                  <button className='text-white bg-red-500 w-[30px] h-[30px] rounded-md' onClick={}><FontAwesomeIcon icon={faTrash}/></button>
                  <button className='text-white bg-yellow-500 w-[30px] h-[30px] rounded-md'><FontAwesomeIcon icon={faPencil}/></button>
                </div>
              </td>
            </tr>
          ))}
        </PosTable>
        </div> 
      </div>
    </div>
    </>
  )
}
