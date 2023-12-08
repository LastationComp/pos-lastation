'use client';

import PosButton from "@/app/_components/PosButton";
import PosTable from "@/app/_components/PosTable";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { useRouter } from "next/navigation";
import useSWR from "swr";


export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SuperAdminUnitsPage()
{
    const router = useRouter()
    const {data, mutate} = useSWR("/api/superadmin/units",fetcher)

    const handleDelete = async (id:any) => {
      const res = await fetch('/api/superadmin/units/' + id,{
        method: 'DELETE',
      });

      if (res.ok && res.status == 200) {
        mutate(data);
      }
    }

    return (
        <>
        <div className="text-xl font-semibold">Units</div>
      <div className="flex justify-end items-center">
        <PosButton icon={faPlus} onClick={() => router.push('units/add')}>
          Add Unit
        </PosButton>
      </div>
      <PosTable fixed headers={["No", "Name", "Action"]}>
        {data && data?.units.map((data: any, i: number) => (
        <tr key={data.id} className="odd:bg-poslight even:bg-slate-200 ">
          <td className="p-3">{i+1}</td>
          <td className="p-3">{data.name}</td>
          <td>
            <button onClick={() => handleDelete(data.id)} className="font-medium text-red-600 dark:text-red-500 hover:underline pr-3">
              Delete
            </button>
            <button onClick={() => router.push('/superadmin/dashboard/units/'+ data.id + '/edit')} className="font-medium text-yellow-800 dark:text-yellow-600 hover:underline">
              Edit
            </button>
          </td>
        </tr>
        ))}
      </PosTable>
        </>
    )
}