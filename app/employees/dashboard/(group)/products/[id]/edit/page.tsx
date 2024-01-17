import authOptions from '@/app/api/auth/authOptions';
import { getServerSession } from 'next-auth';
import dynamic from 'next/dynamic';

const FormEditProduct = dynamic(() => import('./form-edit-product'), { ssr: false });
export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  return (
    <>
      <h1 className="text-lg font-bold">Edit Product</h1>
      <FormEditProduct id={params.id} session={session} />
    </>
  );
}
