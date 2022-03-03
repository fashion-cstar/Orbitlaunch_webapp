import { Button } from "@mui/material";
import { useRouter } from "next/router";
import React, { PropsWithChildren } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import Sidebar from "./Sidebar";

const gradientColor = {
  backgroundImage: 'linear-gradient(165deg, #161f35 -10%, #06111c 30%)'
}

export default function Layout({ children }: PropsWithChildren<{}>) {

  const router = useRouter();

  const goToPad = () => {
    router.push({ pathname: '/pad' })
  };

  return (
    <>
      <Header />
      <div className="flex flex-column items-start py-[64px] z-[1300]" style={gradientColor}>
        <div className="tempdesktop">
          <Sidebar isOpen />
        </div>
        {(router.pathname === '/pad') ? (
          <div className="p-10 grow">
            {children}
          </div>
        ) : (
          <div className="p-10 grow text-center">
            We're working to release the responsive versions of the Fund/Pad/Dashboard over the next few days.<br /><br />
            To access this immediately please visit on a laptop/desktop device.<br /><br />

            <br /><br />
            Good news!<br />
            OrbitPad is already compatible with mobile.<br /><br />

            <Button
              variant="outlined"
              onClick={goToPad}
              className="relative"
              sx={{ borderRadius: "12px" }}
            >
              Navigate to OrbitPad
            </Button>
          </div>
        )}
        <div className="tempmobile fixed bottom-0 w-full h-[45px] border-t border-t-[#112b40]" style={gradientColor}>
          <BottomNav />
        </div>
      </div>
    </>
  );
}
