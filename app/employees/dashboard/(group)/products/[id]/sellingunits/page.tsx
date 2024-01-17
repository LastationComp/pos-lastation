import { getServerSession } from 'next-auth';
import FormAddSellingUnits from './form-add-sellingunits';
import authOptions from '@/app/api/auth/authOptions';

export default async function AddSellingUnitsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <h1 className="text-lg font-semibold">Add Selling Units</h1>
      <div className="mx-3">
        <FormAddSellingUnits session={session} id={params.id} />
      </div>
    </>
  );
}
