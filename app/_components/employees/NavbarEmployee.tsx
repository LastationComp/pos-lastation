'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import ButtonLogout from '../ButtonLogout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import nProgress from 'nprogress';

const generateLink = (link: string, name: string) => {
  const pathDashboard = '/employees/dashboard';
  const realPath = pathDashboard + link;
  const pathname = usePathname();
  const router = useRouter()
  return (
    <button onClick={() => {
      nProgress.start()
      router.push(`${realPath}`)
      }} className={'inline-block py-3 px-5 rounded-full ' + (pathname === realPath ? 'bg-posblue text-white' : 'hover:bg-teal-100 hover:text-black transition')}>
      {name}
    </button>
  );
};


export default function NavbarEmployee({ session }: { session: any }) {
  const router = useRouter();

  const handleLogout = async () => {
    {
      await signOut({ redirect: false });
      return router.push('/');
    }
  };
  const generateImage = (url: string) => {
    const realPath = `/employees/${url}`;
    return realPath;
  };
  return (
    <nav className="bg-posgray border-gray-900 dark:bg-gray-900">
      <div className="h-10vh flex justify-between items-center z-50 gap-3 text-white lg:py-4 px-20">
        <div className="flex items-center flex-1">
          <span className="text-3xl font-bold">
            <Link href="/" className="flex items-center gap-5">
              <Image src={'/iconLastation.png'} blurDataURL={'/iconLastation.png'} className="object-cover max-w-[40px] max-h-[40px]" width={40} height={40} alt="Icon Lastation" />
              {session?.user?.client_name ?? 'Loading...'}
            </Link>
          </span>
        </div>
        <div className="">
          <ul className="inline-flex text-sm font-medium text-center rounded-full bg-white text-black border-b border-black ">
            <li className="mx-2 my-1 ">{generateLink('', 'Transaction')}</li>
            <li className="mx-2 my-1">{generateLink('/products', 'Products')}</li>
            <li className="mx-2 my-1">{generateLink('/member', 'Member')}</li>

            <li className="mx-2 my-1">{generateLink('/profile', 'Profile')}</li>
          </ul>
        </div>
        <div className="lg:flex md:flex lg:flex-1 items center justify-end font-normal hidden">
          {/* <div className="w-[157px] h-[50px] flex-col justify-start items-start gap-2.5 inline-flex">
            <div className="w-[194px] h-[50px] relative">
              <div className="w-[194px] h-[50px] left-0 top-0 absolute bg-stone-50 rounded-[30px]" />
              <div className="w-44 h-[38px] left-[9px] top-[6px] absolute justify-start items-center gap-2.5 inline-flex">
                <div className="justify-start items-center gap-2 flex">
                  <Image className="object-cover max-w-[40px] max-h-[40px] rounded-full" loading="lazy" src={generateImage(session?.user?.avatar_url ?? 'default.png')} alt={session?.data?.user?.name ?? 'Employee'} width={40} height={40} />
                  <div className="flex-col justify-center items-start gap-[8px] inline-flex">
                    <span className="w-[90px] h-2.5 text-black text-sm font-bold">{session?.user?.name ?? 'Loading...'}</span>
                    <span className="w-[90px] h-2.5 text-black text-xs font-medium font-['Montserrat']">Employee</span>
                  </div>
                </div>
                <div className="justify-end  relative ">
                  <button className="bg-red-600 p-3 rounded-[10px]">log</button>
                </div>
              </div>
            </div>
          </div> */}
          <div className="rounded-full bg-white flex items-center">
            <Image
              className="object-cover max-w-auto w-[40px] max-h-auto h-[40px] rounded-full mx-2"
              loading="eager"
              blurDataURL={generateImage(session?.user?.avatar_url ?? 'default.png')}
              src={generateImage(session?.user?.avatar_url ?? 'default.png')}
              alt={session?.data?.user?.name ?? 'Employee'}
              width={40}
              height={40}
            />
            <div className="flex flex-col text-black mr-2">
              <span className="font-semibold">{session?.user?.name}</span>
              <span className="text-black/60">Employee</span>
            </div>
            <div>
              <button className="bg-red-600 p-1 rounded mr-5" onClick={() => handleLogout()}>
                <FontAwesomeIcon icon={faRightFromBracket} size={'xl'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
