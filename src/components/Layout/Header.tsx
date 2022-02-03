import { Portal } from "@mui/base";
import { Button, Menu, MenuItem } from "@mui/material";
import { useEthers } from "@usedapp/core";
import LogoHorizontal from "@app/components/svgs/LogoHorizontal";
import { useWalletConnect } from "@app/components/WalletConnect/WalletConnect";
import { ArrowDown2 } from "iconsax-react";
import localforage from "localforage";
import { MouseEvent, useState } from "react";

function AccountMenu() {
  const { account, deactivate, connector } = useEthers();
  const [anchorEl, setAnchorEl] = useState<HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDisconnect = async () => {
    await localforage.setItem("connectionStatus", false);
    deactivate();
    if (connector) {
      (connector as any)?.deactivate();
    }
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        variant="contained"
        className="rounded bg-app-dark-primary p-[10px] font-mono text-sm text-white"
        endIcon={<ArrowDown2 size={12} />}
      >
        {account?.substr(0, 4)}*****
        {account?.substr(account?.length - 4, 4)}
      </Button>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "account-button",
          className: "bg-app-dark-primary py-0",
        }}
      >
        <MenuItem onClick={handleDisconnect}>Disconnect</MenuItem>
      </Menu>
    </div>
  );
}
export default function Header() {
  const { account } = useEthers();
  const { openWalletConnectDialog } = useWalletConnect();
  const isConnected = !!account;

  return (
    <Portal>
      <div className="fixed top-0 left-0 z-[1300] flex min-h-[64px] w-full items-center border-b border-b-[#112b40] bg-[#06111C]">
        <div className="flex w-full items-center justify-between px-6">
          <div className="flex items-center space-x-2">
            <LogoHorizontal className="h-[16px]" />
          </div>

          <div className="flex items-center space-x-4">
            {/* md:block */}
            <div className="hidden">
              <Button type="button" variant="outlined">
                Buy $M31
              </Button>
            </div>
            {!isConnected && (
              <Button
                variant="outlined"
                onClick={openWalletConnectDialog}
                className="relative"
              >
                <span className="absolute -top-1 right-[-6px] flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-app-primary opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-app-primary"></span>
                </span>
                Connect Wallet
              </Button>
            )}
            {isConnected && <AccountMenu />}
          </div>
        </div>
      </div>
    </Portal>
  );
}
