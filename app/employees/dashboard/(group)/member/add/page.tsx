'use client'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons/faCaretLeft'
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
        <div className='flex flex-col w-[600px] mt-4 p-4 bg-white rounded-md shadow-lg'>
            <p className="text-2xl font-semibold p-4">Add Member</p>
                <div className='flex flex-col gap-3 px-6'>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-base font-semibold mb-2'>Name</label>
                        <input type="text" onChange={(e) => setName(e.target.value)} className='w-[500px] h-[35px] rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400' placeholder='name member' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-base font-semibold mb-2'>Email</label>
                        <input type="text" onChange={(e) => setEmail(e.target.value)} className='w-[500px] h-[35px] rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400' placeholder='example@gmail.com' />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-base font-semibold mb-2'>Phone</label>
                        <input type="text" onChange={(e) => setPhone(e.target.value)} className='w-[500px] h-[35px] rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400' placeholder='08**********' />
                    </div>
                    <div className='flex flex-row justify-end py-2 px-4'>
                        <button type="reset" className='w-[80px] h-[45px] bg-red-500 rounded-full hover:bg-red600 hover:text-white transition' onClick={() => router.back()}>
                            <FontAwesomeIcon icon={faCaretLeft} /> Back
                        </button>
                        <button type='submit' className='w-[80px] h-[45px] ml-2 bg-teal-300 text-black rounded-full hover:bg-teal-700 hover:text-white transition'>
                            <FontAwesomeIcon icon={isLoading ? faSpinner : faPlus} /> Add</button>
                    </div>
                </div>
        </div>
    </form>
    </>
  )
}
