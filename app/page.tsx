import dynamic from 'next/dynamic';
import ModalLicense from './modal-license';
import LoadingComponent from './_components/LoadingComponent';

const FormLogin = dynamic(() => import('./form-login'), { ssr: false, loading: () => (<span>Loading...</span>) });
export default function Home() {
  return (
    <>
      <ModalLicense />
      <main className="">
        <section className="text-white flex justify-center items-center h-screen">
          <FormLogin />
        </section>
      </main>
    </>
  );
}
