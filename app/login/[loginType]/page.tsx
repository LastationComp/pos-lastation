import { Metadata } from "next";
import { redirect } from "next/navigation";

const metadata: Metadata = {
    title: 'Validating Login'
}

export default function LoginType({params}: {params: {loginType: string}}) {
    const loginType = params.loginType

    if (loginType === 'super_admin') return redirect('/dashboard/superadmin/login')
    return (
        <>
        <div>Redirecting...</div>
        </>
    )
}