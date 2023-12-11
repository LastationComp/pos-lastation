'use client'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import Swal from 'sweetalert2'

export default function EmployeeAddMemberPage() {
    const session : any = useSession()
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    const handleAddMember = async (e:any) => {
        e.preventDefault()
        setIsLoading(true)
        const res = await fetch("/api/employee/members",{
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                email: email,
                client_code: localStorage.getItem("client_code"),
                idEmployee: session?.data?.user?.id
            })

        })

        setIsLoading(false)
        if(!res) 
            Swal.fire({
            title: 'Failed to Add Member',
            icon: 'error',
            })
            Swal.fire({
            title: 'Member Successfully Added!',
            icon: 'success',
          })
          router.push('/employees/dashboard/member')
    }
  return (
    <>
    <form 
    action=""
    method='post'
    onSubmit={(e) => handleAddMember(e)}>
        <div className='flex justify-center mt-4'>
            <div className='wrapper p-3 rounded-xl shadow-lg w-[500px] h-[400px] bg-white'>
                <div className='flex justify-start'>
                    <h1 className='text-xl font-bold mt-[30px] ml-2'>Add Member</h1>
                </div>
                <div className='px-5 py-2 mt-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="">Name</label>
                        <input type="text" onChange={(e) => setName(e.target.value)} className='outline outline-1 outline-posgray px-2 rounded-md w-[400px] h-[40px]' placeholder='John Doe' />
                        <label htmlFor="">Email</label>
                        <input type="text" onChange={(e) => setEmail(e.target.value)} className='outline outline-1 outline-posgray px-2 rounded-md w-[400px] h-[40px]' placeholder='example@gmail.com' />
                        <label htmlFor="">Phone</label>
                        <input type="text" onChange={(e) => setPhone(e.target.value)} className='outline outline-1 outline-posgray px-2 rounded-md w-[400px] h-[40px]' placeholder='08**********' />
                    </div>
                    <div className='flex flex-row gap-[10px] mt-4'>
                        <button type='submit' className='bg-teal-300 text-black rounded-full px-3 py-2 hover:bg-teal-700 hover:text-white transition'>
                            <FontAwesomeIcon icon={isLoading ? faSpinner : faPlus} />Add</button>
                        <button type="reset" className='bg-black text-white rounded-full px-3 py-2 hover:bg-white hover:text-black transition outline outline-1' onClick={() => router.back()}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    </form>
    </>
  )
}
