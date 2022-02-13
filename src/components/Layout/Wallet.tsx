import { Button } from "@mui/material";
import { useEthers } from "@usedapp/core";
import { useWalletConnect } from "@app/components/WalletConnect/WalletConnect";
import localforage from "localforage";

function BalanceAmount() {
  // @todo get amount of M31 and * with the price to get the value in $
  const m31Amount = "62,816";
  const dollarAmount = "58,152";

  return (
    <>
      <div className="flex justify-center text-xs">{m31Amount} M31 (${dollarAmount})</div>
    </>
  )
}

function BalanceAndDisconnect() {

  const handleDisconnect = async () => {
    const { deactivate, connector } = useEthers();

    await localforage.setItem("connectionStatus", false);
    deactivate();
    if (connector) {
      (connector as any)?.deactivate();
    }
  };

  return (
    <div className="flex flex-col flex-1 rounded-md bg-[#001926] p-4">
      <div className="flex flex-col mb-[10px] text-gray-400">
        <div className="flex justify-center text-xs">Available Balance</div>
        <BalanceAmount />
      </div>

      <Button
        variant="outlined"
        onClick={handleDisconnect}
        className="relative">
        Disconnect
      </Button>
    </div>
  )
}

export default function Wallet() {
  const { account } = useEthers();
  const { openWalletConnectDialog } = useWalletConnect();
  const isConnected = !!account;

  return (
    <div className="flex justify-center pt-[50px]">
      {!isConnected && (
        <Button
          variant="contained"
          onClick={openWalletConnectDialog}
          className="relative">
          Connect Wallet
        </Button>
      )}
      {isConnected && <BalanceAndDisconnect />}
    </div>
  );
}