"use client"
import { faAddressCard, faUserPen, faUserTie, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import React from 'react'
import useSWR from 'swr'

export default function SuperAdminDashboard() {
  const session : any = useSession()
  const id = session?.data?.user?.id
  const fetcher = (url:string) => fetch(url).then(res => res.json())  
  const {data} = useSWR(`/api/superadmin/dashboard/${id}`, fetcher)

  return (
    <>
    <div className='grid grid-cols-4 gap-3'>
      <div className='wrapper shadow-lg outline outline-0 rounded-md px-2 py-3 mt-5 bg-purple-500'>
        <div className='px-3'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-white text-md'>Clients</h1>
              <h1 className='text-white text-xl'>{data?.TotalClient}</h1>
            </div>
            <div>
              <FontAwesomeIcon className='text-white' icon={faUserTie} size={'2xl'} />
            </div>
          </div>
        </div>
      </div>
      <div className='wrapper shadow-lg outline outline-0 rounded-md px-2 py-3 mt-5 bg-blue-500'>
      <div className='px-3'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-white text-md'>Employee</h1>
              <h1 className='text-white text-xl'>{data?.TotalEmployee}</h1>
            </div>
            <div>
              <FontAwesomeIcon className='text-white' icon={faUserPen} size={'2xl'} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
