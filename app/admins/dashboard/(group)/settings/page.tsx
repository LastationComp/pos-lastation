import React from 'react';
import SettingsPage from './settings-page';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';

export default async function AdminSettingPage() {
  const session: any = await getServerSession(authOptions);
  return (
    <>
      <div className="flex flex-col justify-center mt-2 p-4 bg-white rounded-md shadow-lg">
        <div className="flex justify-start py-3 px-4">
          <p className="text-2xl font-semibold">Settings</p>
        </div>
        <SettingsPage session={session} />
      </div>
    </>
  );
}
