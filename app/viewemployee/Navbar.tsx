export default function Navbar() {
  return (
    <>
      <nav className="bg-slate-900 border-gray-900 dark:bg-gray-900">
        <div className="h-10vh flex justify-between z-50 text-white lg:py-4 px-20">
          <div className="flex items-center flex-1">
            <span className="text-3xl font-bold">
              <a href="/">Last Station</a>
            </span>
          </div>
          <ul className="inline-flex text-sm font-medium text-center rounded-full bg-white text-black border-b border-black ">
            <li className="mx-2 my-1 ">
              <a
                href="#"
                className="inline-block py-3 px-5 text-black bg-green-200 rounded-full active "
              >
                Transaksi
              </a>
            </li>
            <li className="mx-2 my-1">
              <a
                href="#"
                className="inline-block py-3 px-5 rounded-full hover:text-black hover:bg-green-100 "
              >
                Produk
              </a>
            </li>
            <li className="mx-2 my-1">
              <a
                href="#"
                className="inline-block py-3 px-5 rounded-full hover:text-black hover:bg-green-100 "
              >
                Member
              </a>
            </li>
            <li className="mx-2 my-1">
              <a
                href="#"
                className="inline-block py-3 px-5 rounded-full hover:text-black hover:bg-green-100 "
              >
                History
              </a>
            </li>
          </ul>
          <div className="lg:flex md:flex lg: flex-1 items center justify-end font-normal hidden">
            <div className="w-[157px] h-[50px] flex-col justify-start items-start gap-2.5 inline-flex">
              <div className="w-[194px] h-[50px] relative">
                <div className="w-[194px] h-[50px] left-0 top-0 absolute bg-stone-50 rounded-[30px]" />
                <div className="w-44 h-[38px] left-[9px] top-[6px] absolute justify-start items-center gap-2.5 inline-flex">
                  <div className="justify-start items-center gap-2 flex">
                    <img
                      className="w-[40px] h-[40px] rounded-full"
                      src="https://via.placeholder.com/40x40"
                    />
                    <div className="flex-col justify-center items-start gap-[8px] inline-flex">
                      <span className="w-[90px] h-2.5 text-black text-sm font-bold">
                        John Doe
                      </span>
                      <span className="w-[90px] h-2.5 text-black text-xs font-medium font-['Montserrat']">
                        Employee
                      </span>
                    </div>
                  </div>
                  <div className="justify-end w-[40px] h-[35px] relative bg-zinc-300 rounded-[10px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
