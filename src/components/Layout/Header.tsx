import { Portal } from "@mui/base";
import LogoHorizontal from "@app/components/svgs/LogoHorizontal";
import EarthIcon from "../svgs/socials/EarthIcon";
import InstagramIcon from "../svgs/socials/InstagramIcon";
import TwitterIcon from "../svgs/socials/TwitterIcon";
import TelegramIcon from "../svgs/socials/TelegramIcon";
import Wallet from "./Wallet";

const gradientColor = {
  backgroundImage: 'linear-gradient(90deg, #161f35 -10%, #06111c 80%)'
}

export default function Header() {
  return (
    <Portal>
      <div className="fixed top-0 left-0 flex min-h-[64px] w-full items-center border-b border-b-[#112b40]" style={gradientColor}>
        <div className="flex w-full items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <LogoHorizontal className="h-[16px]" />
          </div>

          <div className="tempmobile">
            <Wallet isMobile />
          </div>

          <div className="flex flex-row items-center space-x-4">
            <a className="w-[20px]" href={'https://www.orbitlaunch.io'} target="_blank"><EarthIcon /></a>
            <a className="w-[20px]" href={'https://instagram.com/orbitlaunchm31'} target="_blank"><InstagramIcon /></a>
            <a className="w-[20px]" href={'https://twitter.com/orbitlaunchm31'} target="_blank"><TwitterIcon /></a>
            <a className="w-[20px]" href={'https://t.me/orbitlaunchbsc'} target="_blank"><TelegramIcon /></a>
          </div>
        </div>
      </div>
    </Portal>
  );
}
