'use client';

import PosButton from "@/app/_components/PosButton";
import PosTable from "@/app/_components/PosTable";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { useRouter } from "next/navigation";
import useSWR from "swr";


export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SuperAdminUnitsPage()
{
    const router = useRouter()
    const {data, mutate} = useSWR("/api/superadmin/units",fetcher)

    return (
        <>
        <div className="text-lg font-semibold">Units</div>
      <div className="flex justify-end items-center">
        <PosButton icon={faPlus} onClick={() => router.push('units/add')}>
          Add Unit
        </PosButton>
      </div>
      <PosTable fixed headers={["No", "Name"]}>
        {data && data?.units.map((uni: any, i: number) => (
        <tr key={i}>
          <td className="p-3">{i+1}</td>
          <td className="p-3">{uni.name}</td>
        </tr>
        ))}
      </PosTable>
        </>
    )
}