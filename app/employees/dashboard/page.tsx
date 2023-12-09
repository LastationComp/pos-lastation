'use client'
import { useSession } from "next-auth/react"

export default function DashboardEmployeePage() {
    const session: any = useSession()
    console.log(session)
    return (
        <>
        <div>
            Ini halaman Dashboard Employee
            Apakah kamu bisa create Product? {session.data?.user?.permissions?.emp_can_create ? 'Bisa' : 'Tidak'}
        </div>
        </>
    )
}