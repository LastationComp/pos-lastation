'use client'
import { useSession } from "next-auth/react"

export default function DashboardEmployeePage() {
    const session: any = useSession()
    return (
        <>
        <div>
            Ini halaman Dashboard Transaksi
        </div>
        </>
    )
}