"use client";
import React, {
  BaseSyntheticEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const session: any = useSession();
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data } = useSWR(
    `/api/admins/${params.username}?license=${session.data?.user?.license_key}`,
    fetcher, {
      revalidateOnFocus: false,
    }
  );

  const handleSubmit = async (e: BaseSyntheticEvent) => {
    const formData = new FormData(e.target);
    const data = {
      license_key: session.data?.user?.license_key ?? "",
      new_password: formData.get("new-password"),
      old_password: formData.get("old-password"),
      re_password: formData.get("re-password"),
    };
    const res = await fetch("/api/admins/" + params.username, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    setIsLoading(false);
    if (!res.ok && res.status !== 200) {
      return setErrMsg(result.message);
    }
    e.target.reset();
    setSuccess(res.ok && res.status === 200);
    return signOut();
  };

  const showWarning = (e: BaseSyntheticEvent) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure to change password?",
      icon: "warning",
      width: 600,
      html: "After you change it, you will be logout automatically",
      showConfirmButton: true,
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setSuccess(false);
        setIsLoading(true);
        setErrMsg("");
        return setTimeout(() => {
          return handleSubmit(e);
        }, 500);
      }

      return setIsLoading(false);
    });
  };
  useEffect(() => {
    // setClientName(data?.client ?? '')
  }, [data]);
  return (
    <>
      <div>Ini Profile {params.username}</div>
      {data?.neverChangePassword && (
        <div className="flex w-full bg-orange-400 rounded p-3 text-white">
          Kami sangat menyarankan anda untuk ganti password di awal
        </div>
      )}

      {!data && (
        <div className="flex flex-col justify-center w-1/2 mt-5">
          <div className="flex flex-col animate-pulse">
            <label
              htmlFor="client-name-loading"
              className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"
            ></label>
            <input
              type="text"
              id="client-name-loading"
              className="px-5 rounded bg-slate-300"
              disabled
            />
          </div>
          <div className="flex flex-col animate-pulse">
            <label
              htmlFor="client-username-loading"
              className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"
            ></label>
            <input
              type="text"
              id="client-username-loading"
              className="px-5 rounded bg-slate-300"
              disabled
            />
          </div>
          <div className="flex flex-col animate-pulse">
            <label
              htmlFor="client-loading"
              className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"
            ></label>
            <input
              type="text"
              id="client-loading"
              className="px-5 rounded bg-slate-300"
              disabled
            />
          </div>
          <div className="flex flex-row w-full gap-3">
            <div className="flex flex-col basis-1/2 animate-pulse">
              <label
                htmlFor="admin-new-password-loading"
                className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"
              ></label>
              <input
                type="password"
                id="admin-new-password-loading"
                className="px-5 rounded bg-slate-300"
              />
              <span className=" text-sm bg-slate-300 w-full py-2 my-1 rounded"></span>
            </div>
            <div className="flex flex-col basis-1/2 animate-pulse">
              <label
                htmlFor="admin-re-password-loading"
                className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"
              ></label>
              <input
                type="password"
                id="admin-re-password-loading"
                className="px-5 rounded bg-slate-300"
              />
            </div>
            <div className="flex flex-col basis-1/2 animate-pulse">
              <label
                htmlFor="admin-old-password-loading"
                className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"
              ></label>
              <input
                type="password"
                id="admin-old-password-loading"
                className="px-5 rounded bg-slate-300"
              />
            </div>
          </div>
          <div className="animate-pulse">
            <button className="text-slate-300 rounded bg-slate-300 px-3 py-1 font-semibold">
              Save
            </button>
          </div>
        </div>
      )}
      {data && (
        <div className="flex flex-col justify-center w-1/2 gap-5 mt-5">
          <div className="flex flex-col">
            <label htmlFor="client-name">Client Name</label>
            <input
              type="text"
              id="client-name"
              className="rounded shadow-md px-3 py-1"
              value={data?.client}
              placeholder={"Your Client Name"}
              disabled
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="admin-name">Name</label>
            <input
              type="text"
              id="admin-name"
              className="rounded shadow-md px-3 py-1"
              value={data?.admin?.name}
              placeholder={"Your Admin Name"}
              disabled
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              autoComplete={data?.admin?.username}
              className="rounded shadow-md px-3 py-1"
              value={data?.admin?.username}
              placeholder={"Your Username"}
              disabled
            />
          </div>
          <form
            action=""
            id="change-password"
            method="post"
            onSubmit={(e) => showWarning(e)}
          >
            <div className="flex flex-row w-full gap-3">
              <div className="flex flex-col basis-1/2">
                <label htmlFor="admin-new-password">Set New Password</label>
                <input
                  type="password"
                  id="admin-new-password"
                  name="new-password"
                  className="rounded shadow-md px-3 py-1"
                  placeholder={"Insert to change"}
                  required
                />
              </div>
              <div className="flex flex-col basis-1/2">
                <label htmlFor="admin-re-password">Re-enter Password</label>
                <input
                  type="password"
                  id="admin-re-password"
                  name="re-password"
                  className="rounded shadow-md px-3 py-1"
                  placeholder={"Insert to change"}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="admin-old-password">Old Password</label>
                <input
                  type="password"
                  id="admin-old-password"
                  name="old-password"
                  className="rounded shadow-md px-3 py-1"
                  placeholder={"Insert to change"}
                  required
                />
              </div>
            </div>
            <div>
              {!errMsg ? (
                <span className="text-slate-400 text-sm">
                  Please fill if you want to change password
                </span>
              ) : (
                <span className="text-red-600 text-sm">{errMsg}</span>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <button
                disabled={isLoading}
                className="text-white rounded bg-green-600 px-3 disabled:bg-green-700 py-1 hover:bg-green-700 font-semibold"
                type="submit"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              {success && (
                <span className="text-green-600">Saved Successfully</span>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
