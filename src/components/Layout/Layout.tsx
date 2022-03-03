import React, { PropsWithChildren } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import Sidebar from "./Sidebar";

const gradientColor = {
  backgroundImage: 'linear-gradient(165deg, #161f35 -10%, #06111c 30%)'
}

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Header />
      <div className="flex flex-column items-start py-[64px] z-[1300]" style={gradientColor}>
        <div className="tempdesktop">
          <Sidebar isOpen />
        </div>
        <div className="p-10 grow">
          {children}
        </div>
        <div className="tempmobile fixed bottom-0 w-full h-[45px] border-t border-t-[#112b40]" style={gradientColor}>
          <BottomNav />
        </div>
      </div>
    </>
  );
}
