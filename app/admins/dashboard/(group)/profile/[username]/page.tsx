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
import { fetcher } from "@/app/_lib/Fetcher";
import LoadingComponent from "@/app/_components/LoadingComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons/faInfo";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons/faFloppyDisk";
import { useRouter } from "next/navigation";


export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const session: any = useSession();
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter()
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
    await signOut({redirect: false});
    return router.push('/')
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
      <div className="flex flex-col justify-center bg-white mt-2 p-4 rounded-md shadow-xl">
        <div className="flex justify-start py-3 px-4">
          <p className="text-2xl font-semibold">Profile</p>
        </div>
        {data?.neverChangePassword && (
          <div className="w-full rounded-md relative flex items-center px-4 py-3 text-sm font-bold text-white bg-orange-400 my-2" role="alert">
            <FontAwesomeIcon icon={faInfo} />
            <p className="ml-2">
              We strongly recommend that you change your password at the beginning.
            </p>
          </div>
        )}
        {success && (
          <div className="relative flex w-full items-center px-4 py-3 text-sm font-bold text-white bg-green-400 rounded-md" role="alert">
            <div className="w-4 h-4 mr-4">
              <FontAwesomeIcon icon={faCheck} />
            </div>
            <p>
              Saved Successfully
            </p>
          </div>
        )}

        {!data && (
          <div className="flex flex-col justify-center mt-2 p-4 rounded-md">
            <div className="flex flex-col justify-center gap-5 mt-3">
              <div className="flex flex-col animate-pulse">
                <label
                  htmlFor="client-name-loading"
                  className="px-5 py-3 w-[100px] rounded bg-slate-300 my-3"
                ></label>
                <input
                  type="text"
                  id="client-name-loading"
                  className="px-5 rounded-md h-[35px] bg-slate-300"
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
                  className="px-5 rounded-md h-[35px] bg-slate-300"
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
                  className="px-5 rounded-md h-[35px] bg-slate-300"
                  disabled
                />
              </div>
              <div className="flex flex-row w-full gap-3">
                <div className="flex flex-col basis-1/2 animate-pulse">
                  <label
                    htmlFor="admin-new-password-loading"
                    className="px-5 py-3 w-[150px] rounded bg-slate-300 my-3"
                  ></label>
                  <input
                    type="password"
                    id="admin-new-password-loading"
                    className="px-5 rounded-md h-[35px] bg-slate-300"
                  />
                  <span className=" text-sm bg-slate-300 w-full py-2 my-1 rounded"></span>
                </div>
                <div className="flex flex-col basis-1/2 animate-pulse">
                  <label
                    htmlFor="admin-re-password-loading"
                    className="px-5 py-3 w-[150px] rounded bg-slate-300 my-3"
                  ></label>
                  <input
                    type="password"
                    id="admin-re-password-loading"
                    className="px-5 rounded-md h-[35px] bg-slate-300"
                  />
                </div>
                <div className="flex flex-col basis-1/2 animate-pulse">
                  <label
                    htmlFor="admin-old-password-loading"
                    className="px-5 py-3 w-[150px] rounded bg-slate-300 my-3"
                  ></label>
                  <input
                    type="password"
                    id="admin-old-password-loading"
                    className="px-5 rounded-md h-[35px] bg-slate-300"
                  />
                </div>
              </div>
              <div className="animate-pulse flex justify-start px-2 pt-4">
                <button className="w-[100px] h-[50px] rounded-full text-slate-300 bg-slate-300 px-3 py-1 font-semibold">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        {data && (
          <div className="flex flex-col justify-center p-4 gap-5 mt-2">
            <div className="flex flex-col">
              <label className='text-base font-semibold mb-2' htmlFor="client-name">Client Name</label>
              <input
                type="text"
                id="client-name"
                className="h-[35px] rounded-md outline bg-gray-200 outline-posblue outline-1 px-3 py-1"
                value={data?.client}
                placeholder={"Your Client Name"}
                disabled
              />
            </div>
            <div className="flex flex-col">
              <label className='text-base font-semibold mb-2' htmlFor="admin-name">Name</label>
              <input
                type="text"
                id="admin-name"
                className="h-[35px] rounded-md outline bg-gray-200 outline-posblue outline-1 px-3 py-1"
                value={data?.admin?.name}
                placeholder={"Your Admin Name"}
                disabled
              />
            </div>
            <div className="flex flex-col">
              <label className='text-base font-semibold mb-2' htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                autoComplete={data?.admin?.username}
                className="h-[35px] rounded-md outline bg-gray-200 outline-posblue outline-1 px-3 py-1"
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
                  <label className='text-base font-semibold mb-2' htmlFor="admin-new-password">Set New Password</label>
                  <input
                    type="password"
                    id="admin-new-password"
                    name="new-password"
                    className="h-[35px] rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
                    placeholder={"Insert to change"}
                    required
                  />
                </div>
                <div className="flex flex-col basis-1/2">
                  <label className='text-base font-semibold mb-2' htmlFor="admin-re-password">Re-enter Password</label>
                  <input
                    type="password"
                    id="admin-re-password"
                    name="re-password"
                    className="h-[35px] rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
                    placeholder={"Insert to change"}
                    required
                  />
                </div>
                <div className="flex flex-col basis-1/2">
                  <label className='text-base font-semibold mb-2' htmlFor="admin-old-password">Old Password</label>
                  <input
                    type="password"
                    id="admin-old-password"
                    name="old-password"
                    className="h-[35px] rounded-md outline outline-posblue outline-1 px-3 py-1 hover:outline-posgray focus:outline-posgray transition duration-400"
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
              <div className="flex justify-start px-2 pt-4 font-semibold">
                <button
                  disabled={isLoading}
                  className="w-[110px] h-[50px] flex items-center gap-3 justify-center rounded-full bg-posblue text-black hover:bg-teal-500 hover:text-white px-3 py-1  transition"
                  type="submit"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
