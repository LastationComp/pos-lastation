'use client'
import LoadingComponent from '@/app/_components/LoadingComponent'
import { fetcher } from '@/app/_lib/Fetcher'
import { faUsers } from '@fortawesome/free-solid-svg-icons/faUsers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import React from 'react'
import useSWR from 'swr'

export default function AdminDashboardPage() {
  const session : any = useSession()
  const id = session?.data?.user?.id
  const {data} = useSWR(`/api/admins/dashboard/${id}`, fetcher)

  if(!data) return (
    <LoadingComponent/>
  )
  return (
    <>
    <div className='grid grid-cols-4 gap-3'>
      <div className='wrapper shadow-lg outline outline-0 rounded-md px-2 py-3 mt-5 bg-purple-500'>
        <div className='px-3'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-white text-md'>Employees</h1>
              <h1 className='text-white text-xl'>{data?.TotalEmployee}</h1>
            </div>
            <div>
              <FontAwesomeIcon className='text-white' icon={faUsers} size={'2xl'} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
