import { injectedConnector, walletConnectConnector, wcoprovider } from "@app/lib/connector";
import useMedia from "@app/lib/hooks/useMedia";
import { CloseOutlined } from "@mui/icons-material";
import { Dialog, IconButton } from "@mui/material";
import { useEthers } from "@usedapp/core";
import { createContext, FC, useCallback, useContext, useState } from "react";
import MetaMaskCard from "./MetaMaskCard";
import WalletConnectCard from "./WalletConnectCard";
import TrustWalletCard from "./TrustWalletCard";
import { useSnackbar } from "@app/lib/hooks/useSnackbar";
import localforage from "localforage";

import { providers as hello } from "ethers";

export const WalletConnectContext = createContext({
  open: false,
  openWalletConnectDialog: () => {},
  closeWalletConnectDialog: () => {},
});

export const WalletConnectProvider: FC = ({ children }) => {
  const [open, setOpen] = useState(false);
  const { activate } = useEthers();
  const { matchesDesktop } = useMedia();

  const { snackbar } = useSnackbar();
  const handleOpenWalletConnect = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseWalletConnect = useCallback(() => {
    setOpen(false);
  }, []);

  const handleConnectMetamask = async () => {
    await activate(injectedConnector);
    handleCloseWalletConnect();
    await localforage.setItem("connectionStatus", true);
  };

  const handleConnectWalletConnect = async () => {
    try {
      // @todo: try using provider instead connectors
      // @todo: fix here, can connect, no able to display wallet info
      await wcoprovider.enable();
      const web3Provider = new hello.Web3Provider(wcoprovider);
      console.log(wcoprovider.accounts); // this works
      await activate(web3Provider);
      await localforage.setItem("connectionStatus", true);
    } catch (error) {
      console.log(error);
    } finally {
      handleCloseWalletConnect();
    }
  };

  const providers = {
    open,
    openWalletConnectDialog: handleOpenWalletConnect,
    closeWalletConnectDialog: handleCloseWalletConnect,
  };

  return (
    <WalletConnectContext.Provider value={providers}>
      {children}
      <Dialog
        open={open}
        fullScreen={!matchesDesktop}
        onClose={handleCloseWalletConnect}
        PaperProps={{
          style: {
            background: "transparent",
          },
        }}
      >
        <div className="space-y-4 rounded-md bg-gray-900 p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-xl font-bold text-white">Choose Provider</div>
            <IconButton onClick={handleCloseWalletConnect}>
              <CloseOutlined color="inherit" className="text-white" />
            </IconButton>
          </div>
          <MetaMaskCard onClick={handleConnectMetamask} />
          {!matchesDesktop && (
            <TrustWalletCard onClick={handleConnectMetamask} />
          )}
          <WalletConnectCard onClick={handleConnectWalletConnect} />
        </div>
      </Dialog>
    </WalletConnectContext.Provider>
  );
};

export function useWalletConnect() {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error(
      "useWalletConnect must be used within a WalletConnectProvider"
    );
  }
  return context;
}

export const withWalletConnect = (Component: FC) => (props: any) => {
  return (
    <WalletConnectProvider>
      <Component {...props} />
    </WalletConnectProvider>
  );
};
