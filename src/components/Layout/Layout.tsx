import { PropsWithChildren } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const gradientColor = {
  backgroundImage: 'linear-gradient(165deg, #161f35 -10%, #06111c 30%)'
}

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Header />
      <div className="tempmobile">
        <div className="grid place-items-center h-screen text-center text-[18px] p-8">
          We're working to release the responsive versions of the Fund/Pad/Dashboard over the next few days.<br /><br />
          To access this immediately please visit on a laptop/desktop device.
        </div>
      </div>

      <div className="tempdesktop">
        <div className="flex items-start py-[64px] z-[1300]" style={gradientColor}>
          <Sidebar isOpen />
          <div className="p-10 grow">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
