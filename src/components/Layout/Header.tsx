import { Portal } from "@mui/base";
import { Button } from "@mui/material";
import LogoHorizontal from "@app/components/svgs/LogoHorizontal";

export default function Header() {
  return (
    <Portal>
      <div className="fixed top-0 left-0 z-[1300] flex min-h-[64px] w-full items-center border-b border-b-[#112b40] bg-[#06111C]">
        <div className="flex w-full items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <LogoHorizontal className="h-[16px]" />
          </div>

          <div className="flex items-center space-x-4">
            {/* md:block */}
            <div className="">
              {/* @todo: add link to pancakeswap */}
              <Button type="button" variant="outlined">
                Buy $M31
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
