'use client'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import useSWR from 'swr'

export default function EmployeeEditMemberPage({params} : {params:{customerCode:string}}) {
    const fetcher = (url:string) => fetch(url).then(res => res.json())
    const customer_code = params.customerCode
    const {data} = useSWR(`/api/employee/members/${customer_code}`,fetcher)
    
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [point, setPoint] = useState(0)
    const [isLoading, setIsLoading] = useState(false)


    const handleEditMember = async (e:any) => {
        e.preventDefault()
        setIsLoading(true)
        const pointMember = Number(point)
        const res = await fetch(`/api/employee/members/${customer_code}`,{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                email: email,
                point: pointMember
            })

        })

        setIsLoading(false)
        if(!res) 
            Swal.fire({
            title: 'Failed to Update Member',
            icon: 'error',
            })
            Swal.fire({
            title: 'Member Successfully Updated!',
            icon: 'success',
          })
          router.push('/employees/dashboard/member')
    }

    useEffect(() => {
        setName(data?.member?.name)
        setEmail(data?.member?.email)
        setPhone(data?.member?.phone)
        setPoint(data?.member?.point)
    }, [
        data
    ])
  return (
    <>
    <form 
    action=""
    method='post'
    onSubmit={(e) => handleEditMember(e)}>
        <div className='flex justify-center mt-4'>
            <div className='wrapper p-3 rounded-xl shadow-lg w-[500px] h-[500px] bg-white'>
                <div className='flex justify-start'>
                    <h1 className='text-xl font-bold mt-[30px] ml-2'>Edit Member</h1>
                </div>
                <div className='px-5 py-2 mt-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="">Name</label>
                        <input type="text" onChange={(e) => setName(e.target.value)} value={name} className='outline outline-1 outline-posgray px-2 rounded-md w-[400px] h-[40px]' placeholder='John Doe' />
                        <label htmlFor="">Email</label>
                        <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} className='outline outline-1 outline-posgray px-2 rounded-md w-[400px] h-[40px]' placeholder='example@gmail.com' />
                        <label htmlFor="">Phone</label>
                        <input type="text" onChange={(e) => setPhone(e.target.value)} value={phone} className='outline outline-1 outline-posgray px-2 rounded-md w-[400px] h-[40px]' placeholder='08**********' />
                        <label htmlFor="">Point</label>
                        <input type="number" onChange={(e:any) => setPoint(e.target.value)} value={point} className='outline outline-1 outline-posgray px-2 rounded-md w-[400px] h-[40px]' />
                    </div>
                    <div className='flex flex-row gap-[10px] mt-4'>
                        <button type='submit' className='bg-green-600 text-white rounded-full px-3 py-2 hover:bg-green-300 hover:text-black transition'>
                            <FontAwesomeIcon icon={isLoading ? faSpinner : faPlus} />Save</button>
                        <button type="reset" className='bg-black text-white rounded-full px-3 py-2 hover:bg-white hover:text-black transition outline outline-1' onClick={() => router.back()}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    </>
  )
}
