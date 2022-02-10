import {
  CSSObject,
  Drawer as MuiDrawer,
  styled,
  Theme,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  SIDEBAR_ITEMS,
  SIDEBAR_ICON_MAP,
  SIDEBAR_ROUTES,
} from "./LayoutConstants";

import { Button, Menu, MenuItem } from "@mui/material";
import { useEthers } from "@usedapp/core";
import { ArrowDown2 } from "iconsax-react";
import localforage from "localforage";
import { MouseEvent, useState } from "react";
import { useWalletConnect } from "../WalletConnect/WalletConnect";

const drawerWidth = 216;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `64px`,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface SidebarProps {
  isOpen: boolean;
}

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

export default function Sidebar({ isOpen }: SidebarProps) {
  const router = useRouter();
  const matchesDesktop = useMediaQuery(`(min-width: 1024px)`);

  const routeMatch = (path: string) => {
    return router.pathname === path;
  };

  return (
    <Drawer
      variant={"permanent"}
      open={isOpen}
      sx={{
        "& .MuiDrawer-paper": {
          zIndex: 20,
          top: 64,
          backgroundColor: "#06111C",
          borderRight: "1px solid #112b40",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <div className="w-[216px] space-y-2 py-4 px-2">
        {Object.keys(SIDEBAR_ITEMS).map((key, index) => {
          const Icon = SIDEBAR_ICON_MAP[key];
          const isActive = routeMatch(SIDEBAR_ROUTES[key]);
          const isComingSoon = SIDEBAR_ROUTES[key] === "/coming-soon";

          const { openWalletConnectDialog } = useWalletConnect();
          const { account } = useEthers();
          const isConnected = !!account;

          return (
            <Tooltip
              // disableHoverListener={isOpen}
              title={
                isComingSoon
                  ? `${SIDEBAR_ITEMS[key]} (Coming Soon)`
                  : SIDEBAR_ITEMS[key]
              }
              placement="right"
            >
              <div
                className={clsx("relative", {
                  "w-[48px]": !isOpen,
                  "w-full": isOpen,
                })}
              >
                {isActive && (
                  <div className="absolute -left-6 bottom-1/2 h-8 w-8  translate-y-1/2 transform flex items-center justify-center rounded-full bg-blurry">
                    <div className="h-3 w-3 rounded-full bg-[#463DB4]" />
                  </div>
                )}
                <Link href={SIDEBAR_ROUTES[key]} passHref>
                  <a
                    key={key}
                    className={clsx(
                      "flex items-center space-x-6 tracking-[0.5px] rounded p-3 transition duration-300",
                      {
                        "text-app-primary": isActive,
                        "pointer-events-none": isComingSoon,
                      }
                    )}
                  >
                    <Icon active={isActive} />
                    {isOpen && (
                      <div className="text-sm">{SIDEBAR_ITEMS[key]}</div>
                    )}
                  </a>
                </Link>
              </div>
            </Tooltip>
            // @todo: create a dedicated component to handle Wallet connexion
            // {!isConnected && (
            //   <Button
            //     variant="outlined"
            //     onClick={openWalletConnectDialog}
            //     className="relative"
            //   >
            //     <span className="absolute -top-1 right-[-6px] flex h-3 w-3">
            //       <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-app-primary opacity-75"></span>
            //       <span className="relative inline-flex h-3 w-3 rounded-full bg-app-primary"></span>
            //     </span>
            //     Connect Wallet
            //   </Button>
            // )}
            // {isConnected && <AccountMenu />}
          );
        })}
      </div>
    </Drawer>
  );
}
