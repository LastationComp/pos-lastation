"use client";
import Image from "next/image";
import { useState } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

export default function HomeSuperAdmin() {
  const { data, status }: { data: any; status: any } = useSession();
  const [wrong, setWrong] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (data: FormData) => {
    const res = await signIn("credentials", {
      username: data.get("username"),
      password: data.get("password"),
      role: "super_admin",
      license_key: null,
      redirect: false,
    });
    setWrong(!res?.ok ?? false);
    if (res?.ok && res.status == 200)
      return router.push("/superadmin/dashboard");
    setIsLoading(false);
    if (res?.ok) return router.push("dashboard");
  };
  if (status == "")
    return (
      <>
        <div className="flex justify-center text-white">Validating...</div>
      </>
    );
  return (
    <section className="flex justify-center items-center text-black">
      <form
        action=""
        onSubmit={(e) => {
          setIsLoading(true);
          setWrong(false);
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          setTimeout(() => {
            return handleSubmit(formData);
          }, 500);
        }}
      >
        <div className="flex flex-col  rounded shadow-md mt-[150px] w-[500px] h-[450px] p-3 bg-white my-auto gap-3 rounded">
          <div
            className="container relative flex items-center px-4 py-3 text-sm font-bold text-white bg-blue-500"
            role="alert"
          >
            <i className="fa-solid fa-triangle-exclamation"></i>
            <p>Username or Password is Wrong</p>
          </div>

          <h1 className="text-center text-2xl font-bold font-['Montserrat']">
            Super Admin Page
          </h1>
          {wrong && (
            <span className="bg-red-600 w-full text-center p-3 rounded">
              Username or Password is Wrong
            </span>
          )}
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            className="rounded px-3 outline outline-0 shadow-md text-black py-1 "
            placeholder="Input your Username"
            required
            autoFocus
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="rounded px-3 outline outline-0 shadow-md text-black py-1 "
            placeholder="Input your Username"
            required
          />
          <button
            className="justify-center bg-green-600 rounded p-3 hover:bg-green-700 transition disabled:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? "Signing..." : "Sign In"}
          </button>
        </div>
      </form>
    </section>
  );
}
