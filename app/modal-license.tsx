'use client';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import React from 'react';

export default function ModalLicense() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLicense, setHasLicense] = useState(true);
  const [errMsg, setErrMsg] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const handleLicenseKey = async () => {
    const key = !licenseKey ? localStorage.getItem('license_key') : licenseKey;
    const res = await fetch('/api/license', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        license_key: key,
      }),
    });
    setIsLoading(false);
    setIsLogin(true);
    const result = await res.json();
    if (!res.ok && res.status !== 200) {
      setHasLicense(res.status === 200);
      return setErrMsg(result?.message ?? 'Internal Server Error');
    }

    localStorage.setItem('license_key', result?.client.license_key);
    setLicenseKey('');
    setHasLicense(true);
    return;
  };
  const CheckLicenseKey = () => {
    console.log('tes license callback');
    if (!localStorage.getItem('license_key') || localStorage.getItem('license_key') === '') return setHasLicense(false);
    return handleLicenseKey();
  };

  useEffect(() => {
    CheckLicenseKey();
    window.addEventListener('storage', CheckLicenseKey);
    return () => window.removeEventListener('storage', CheckLicenseKey);
  });
  return (
    <>
      <Modal isOpen={!hasLicense} placement="bottom-center" size="lg" hideCloseButton backdrop="opaque">
        <ModalContent>
          {(onclose) => (
            <>
              <form
                action=""
                method="post"
                onSubmit={(e) => {
                  e.preventDefault();
                  setErrMsg('');
                  setIsLogin(false);
                  setIsLoading(true);
                  setTimeout(() => {
                    return handleLicenseKey();
                  }, 500);
                }}
              >
                <ModalHeader></ModalHeader>

                <ModalBody>
                  <div className="flex flex-col justify-center items-center gap-5">
                    {!localStorage.getItem('license_key') && <span className="font-bold text-black">I think you has a first time use this web app. to Confirm your identity, please insert your license key</span>}

                    {errMsg && <span className="bg-red-600 text-white rounded px-3">{errMsg}</span>}
                    <div className="flex flex-col justify-center w-full gap-3">
                      <input
                        type="text"
                        required
                        name="license_key"
                        value={licenseKey}
                        onChange={(e) => setLicenseKey(e.target.value)}
                        className="bg-white w-full shadow-md rounded-[5px] p-3 outline  outline-posblue focus:outline-posgray transition outline-3"
                        placeholder="Input your License Key"
                        autoFocus
                      />
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button className="justify-center bg-white outline outline-2 outline-posblue rounded-[5px] p-3 hover:bg-posblue transition disabled:bg-green-700 text-posgray font-bold" disabled={isLoading && !isLogin}>
                    {isLoading && !isLogin ? 'Submitting...' : 'Submit'}
                  </button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* {!hasLicense && (
        <div className="absolute top-0 left-0 w-screen h-screen z-999 bg-gray-900/50 rounded p-3 backdrop-blur-sm ">
          <div className="flex flex-col justify-center items-center h-full gap-5">
            {!localStorage.getItem('license_key') && <span className="font-bold text-white">I think you has a first time use this web app. to Confirm your identity, please insert your license key</span>}
            <form
              action=""
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
                setErrMsg('');
                setIsLogin(false);
                setIsLoading(true);
                setTimeout(() => {
                  return handleLicenseKey();
                }, 500);
              }}
            >
              {errMsg && <span className="bg-red-600 text-white rounded">{errMsg}</span>}
              <div className="flex justify-center gap-3">
                <input
                  type="text"
                  required
                  name="license_key"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  className="bg-white w-[500px] shadow-md rounded-[5px] p-3 outline  outline-posblue focus:outline-posgray transition outline-3"
                  placeholder="Input your License Key"
                  autoFocus
                />
                <button className="justify-center bg-white outline outline-2 outline-posblue rounded-[5px] p-3 hover:bg-posblue transition disabled:bg-green-700 text-posgray font-bold" disabled={isLoading && !isLogin}>
                  {isLoading && !isLogin ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </>
  );
}
