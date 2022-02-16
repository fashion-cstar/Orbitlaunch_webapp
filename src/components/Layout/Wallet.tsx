import { Button } from "@mui/material";
import { useTokenBalance, useEthers } from "@usedapp/core";
import { useWalletConnect } from "@app/components/WalletConnect/WalletConnect";
import localforage from "localforage";
import { formatEther } from "@ethersproject/units";
import useOrbit from "@app/lib/hooks/useOrbit";
import { AppTokenAddress } from '@app/shared/AppConstant';
import { Web3ModalButton } from "../WalletConnect/Web3Modal";

function BalanceAmount() {
  const m31Address = AppTokenAddress;
  const { account } = useEthers();
  const userBalance = useTokenBalance(m31Address, account);
  const formattedBalance = (!!userBalance) ? formatEther(userBalance) : '0';
  const m31Amount = (!!formattedBalance) ? parseFloat(formattedBalance).toFixed(3) : '0';

  const orbitKpi = (useOrbit()) ? useOrbit() : null;
  const amountInDolls = (!!orbitKpi.price) ? parseFloat(m31Amount) * parseFloat(orbitKpi.price) : 0;

  return (
    <>
      <div className="flex justify-center text-xs">{m31Amount} M31 (${amountInDolls.toFixed(2)})</div>
    </>
  )
}

function BalanceAndDisconnect() {
  const { deactivate, connector } = useEthers();
  const handleDisconnect = async () => {
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
  const activateProvider = Web3ModalButton();
  const isConnected = !!account;

  return (
    <div className="flex justify-center pt-[50px]">
      {!isConnected && (
        <Button
          variant="contained"
          onClick={activateProvider}
          className="relative">
          Connect Wallet
        </Button>
      )}
      {isConnected && <BalanceAndDisconnect />}
    </div>
  );
}