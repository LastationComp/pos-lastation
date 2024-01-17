'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons/faRightFromBracket';
import nProgress from 'nprogress';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@nextui-org/react';

const GenerateLink = (link: string, name: string) => {
  const pathname = usePathname();
  const router = useRouter();
  const pathDashboard = '/employees/dashboard';
  const realPath = pathDashboard + link;

  const getConditionNavbar = () => {
    if (pathname === '/employees/dashboard' && link === '') return true;

    if (pathname.includes(link) && link !== '') return true;

    return false;
  };
  return (
    <button
      onClick={() => {
        if (pathname === realPath) return;
        nProgress.start();
        router.push(realPath);
      }}
      className={'inline-block py-3 px-5 rounded-full ' + (getConditionNavbar() ? 'bg-posblue text-white' : 'hover:bg-teal-100 hover:text-black transition')}
    >
      {name}
    </button>
  );
};

export default function NavbarEmployee() {
  const session: any = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = async () => {
    await signOut({ redirect: true });
  };
  const generateImage = (url: string) => {
    if (!url) return undefined;
    return url;
  };
  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="bg-posgray" maxWidth={'full'}>
      <NavbarContent>
        <NavbarMenuToggle aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'} className="lg:hidden text-white"></NavbarMenuToggle>
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-5 text-white">
            <Image src={'/iconLastation.png'} blurDataURL={'/iconLastation.png'} className="object-cover max-w-[40px] max-h-[40px]" width={40} height={40} alt="Icon Lastation" />
            <span className="text-lg font-semibold">{session?.data?.user?.client_name ?? 'Loading...'}</span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify={'center'}>
        <div className="inline-flex py-1 text-sm font-medium text-center rounded-full bg-white text-black px-1 max-lg:hidden">
          <NavbarItem>{GenerateLink('', 'Transactions')}</NavbarItem>
          <NavbarItem>{GenerateLink('/products', 'Products')}</NavbarItem>
          <NavbarItem>{GenerateLink('/members', 'Members')}</NavbarItem>
          <NavbarItem>{GenerateLink('/profile', 'Profile')}</NavbarItem>
        </div>
      </NavbarContent>
      <NavbarContent justify="end">
        <div className="rounded-full flex bg-white items-center gap-3 pr-2 max-md:hidden">
          <Avatar src={generateImage(session?.data?.user?.avatar_url)} className="" isBordered showFallback />
          <div className="flex flex-col text-black">
            <span className="font-semibold">{session?.data?.user?.name}</span>
            <span className="text-black/60">Employee</span>
          </div>
          <button className="bg-red-600 rounded px-1 py-1" onClick={() => handleLogout()}>
            <FontAwesomeIcon icon={faRightFromBracket} className="text-white" size={'xl'} />
          </button>
        </div>
        <div className="md:hidden">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar src={generateImage(session?.data?.user?.avatar_url)} className="" isBordered showFallback />
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col text-black">
                    <span className="font-semibold">{session?.data?.user?.name}</span>
                    <span className="text-black/60">Employee</span>
                  </div>
                  <button className="bg-red-600 rounded px-1 py-1" onClick={() => handleLogout()}>
                    <FontAwesomeIcon icon={faRightFromBracket} className="text-white" size={'xl'} />
                  </button>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </NavbarContent>
      <NavbarMenu>
        <NavbarMenuItem>{GenerateLink('', 'Transactions')}</NavbarMenuItem>
        <NavbarMenuItem>{GenerateLink('/products', 'Products')}</NavbarMenuItem>
        <NavbarMenuItem>{GenerateLink('/members', 'Members')}</NavbarMenuItem>
        <NavbarMenuItem>{GenerateLink('/profile', 'Profile')}</NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
