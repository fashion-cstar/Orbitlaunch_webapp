import React, { PropsWithChildren, useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import BottomNav from "./BottomNav";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CloseIcon from "../svgs/CloseIcon";

const gradientColor = {
  backgroundImage: 'linear-gradient(165deg, #161f35 -10%, #06111c 30%)'
}

export default function Layout({ children }: PropsWithChildren<{}>) {

  const [alreadyWarn, setAlreadyWarn] = useState('false');

  useEffect(() => {
    setAlreadyWarn(localStorage.getItem('orbitPhishingWarning'));
  }, [])

  const router = useRouter();
  const goToPath = (path: string) => {
    router.push({ pathname: path })
  };
  const goToMain = () => {
    setAlreadyWarn('true');
    localStorage.setItem('orbitPhishingWarning', 'true')
    router.push({ pathname: '/' })
  };

  return (
    <>
      <Header />
      <div className="flex flex-column items-start py-[64px] z-[1300]" style={gradientColor}>
        {!alreadyWarn && (
          <div className="grow fixed top-50 w-full h-[35px] bg-[#b24f9e] border-b border-b-[#112b40] z-[1400]">
            <p className="flex justify-center p-2 text-xs md:text-sm cursor-pointer" onClick={goToMain}>
              Make sure you're visiting&nbsp;&nbsp;
              <p className="flex row items-center">
                <a className="rounded-full bg-[#634fb2] hover:bg-[#06111c] px-2">https://app.orbitlaunch.io</a>
                <CloseIcon />
              </p>
            </p>
          </div>
        )}
        <div className="desktop-layout">
          <Sidebar isOpen />
        </div>
        <div className="p-6 md:p-10 grow">
          {children}
        </div>
        <div className="mobile-layout fixed bottom-0 w-full h-[45px] border-t border-t-[#112b40]" style={gradientColor}>
          <BottomNav />
        </div>
      </div>
    </>
  );
}
