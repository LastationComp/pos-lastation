import React from 'react';
import FormProfile from './form-profile';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/api/auth/authOptions';

const getAdminProfile = async (username: string, license: string) => {
  const res = await fetch(`${process.env.NEXT_URL}/api/admins/${username}?license=${license}`, {
    cache: 'no-store',
  });
  return res.json();
};
export default async function ProfilePage({ params }: { params: { username: string } }) {
  const session: any = await getServerSession(authOptions);
  const data = await getAdminProfile(params.username, session?.user.license_key);

  return (
    <>
      <div className="flex flex-col justify-center bg-white mt-2 p-4 rounded-md shadow-xl">
        <div className="flex justify-start py-3 px-4">
          <p className="text-2xl font-semibold">Profile</p>
        </div>
        {!data && (
          <div className="flex flex-col justify-center mt-2 p-4 rounded-md">
            <div className="flex flex-col justify-center gap-5 mt-3">
              <div className="flex flex-col animate-pulse">
                <label htmlFor="client-name-loading" className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"></label>
                <input type="text" id="client-name-loading" className="px-5 rounded-md h-[35px] bg-slate-300" disabled />
              </div>
              <div className="flex flex-col animate-pulse">
                <label htmlFor="client-username-loading" className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"></label>
                <input type="text" id="client-username-loading" className="px-5 rounded-md h-[35px] bg-slate-300" disabled />
              </div>
              <div className="flex flex-col animate-pulse">
                <label htmlFor="client-loading" className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"></label>
                <input type="text" id="client-loading" className="px-5 rounded-md h-[35px] bg-slate-300" disabled />
              </div>
              <div className="flex flex-row w-full gap-3">
                <div className="flex flex-col basis-1/2 animate-pulse">
                  <label htmlFor="admin-new-password-loading" className="px-5 py-3 w-[150px] rounded bg-slate-300 my-3"></label>
                  <input type="password" id="admin-new-password-loading" className="px-5 rounded-md h-[35px] bg-slate-300" />
                  <span className=" text-sm bg-slate-300 w-full py-2 my-1 rounded"></span>
                </div>
                <div className="flex flex-col basis-1/2 animate-pulse">
                  <label htmlFor="admin-re-password-loading" className="px-5 py-3 w-[150px] rounded bg-slate-300 my-3"></label>
                  <input type="password" id="admin-re-password-loading" className="px-5 rounded-md h-[35px] bg-slate-300" />
                </div>
                <div className="flex flex-col basis-1/2 animate-pulse">
                  <label htmlFor="admin-old-password-loading" className="px-5 py-3 w-[150px] rounded bg-slate-300 my-3"></label>
                  <input type="password" id="admin-old-password-loading" className="px-5 rounded-md h-[35px] bg-slate-300" />
                </div>
              </div>
              <div className="animate-pulse flex justify-start px-2 pt-4">
                <button className="w-[100px] h-[50px] rounded-full text-slate-300 bg-slate-300 px-3 py-1 font-semibold">Save</button>
              </div>
            </div>
          </div>
        )}
        {data && <FormProfile username={params.username} data={data} session={session} />}
      </div>
    </>
  );
}
