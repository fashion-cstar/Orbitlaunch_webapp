import React, { useMemo, useState, useEffect } from 'react'
import { Button } from "@mui/material";
import { useTokenBalance, useEthers } from "@usedapp/core";
import localforage from "localforage";
import { formatEther } from "@ethersproject/units";
import useOrbit from "@app/lib/hooks/useOrbit";
import { AppTokenAddress } from '@app/shared/AppConstant';
import { Web3ModalButton } from "../WalletConnect/Web3Modal";
import TierActionsModal from "src/components/products/TierActions"

function BalanceAmount({ isMobile }: { isMobile: boolean }) {
  const m31Address = AppTokenAddress;
  const { account } = useEthers();
  const userBalance = useTokenBalance(m31Address, account);
  const formattedBalance = (!!userBalance) ? formatEther(userBalance) : '0';
  const m31Amount = (!!formattedBalance) ? parseFloat(formattedBalance).toFixed(3) : '0';

  const orbitKpi = (useOrbit()) ? useOrbit() : null;
  const amountInDolls = (!!orbitKpi.price) ? parseFloat(m31Amount) * parseFloat(orbitKpi.price) : 0;

  return (
    <>
      {isMobile ? (
        <div className="flex justify-center text-[6px]">{m31Amount} ORBIT (${amountInDolls.toFixed(2)})</div>
      ) : (
        <div className="flex justify-center text-xs">{m31Amount} ORBIT (${amountInDolls.toFixed(2)})</div>
      )}
    </>
  )
}

function BalanceAndDisconnect({ isMobile }: { isMobile: boolean }) {
  const [isOpenTierActions, setIsOpenTierActions] = useState(false)  
  const { deactivate, connector } = useEthers();

  const handleDisconnect = async () => {
    await localforage.setItem("connectionStatus", false);
    deactivate();
    if (connector) {
      (connector as any)?.deactivate();
    }
  };

  const handleTierActions = () => {
    setIsOpenTierActions(true)
  }

  const handleCloseTierActions = () => {
    setIsOpenTierActions(false)
  }

  return (
    <>
      <TierActionsModal isOpen={isOpenTierActions} handleClose={handleCloseTierActions} />
      {isMobile ? (
        <div className="flex flex-row gap-2 my-2">
          <Button
            variant="contained"
            onClick={handleTierActions}
            className="relative">
            <span className="text-[11px]">Tier Actions</span>
          </Button>
          <Button
            variant="outlined"
            onClick={handleDisconnect}
            className="relative">
            <span className="text-[11px]">Disconnect</span>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col flex-1 rounded-md bg-[#001926] p-4">
          <div className="flex flex-col mb-[10px] text-gray-400">
            <div className="flex justify-center text-xs">Available Balance</div>
            <BalanceAmount isMobile={isMobile} />
          </div>
          <div className="flex flex-col gap-4 my-1">
            <Button
              variant="outlined"
              onClick={handleDisconnect}
              className="relative">
              Disconnect
            </Button>
            <Button
              variant="contained"
              onClick={handleTierActions}
              className="relative">
              Tier Actions
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default function Wallet({ isMobile }: { isMobile: boolean }) {
  const { account } = useEthers();
  const activateProvider = Web3ModalButton();
  const isConnected = !!account;

  return (
    <div className="flex justify-center">
      {!isConnected && (
        <Button
          variant="contained"
          onClick={activateProvider}
          className="relative">
          {isMobile ? (
            <span className="text-[11px]">Connect</span>
          ) : (
            `Connect Wallet`
          )}
        </Button>
      )}
      {isConnected && <BalanceAndDisconnect isMobile={isMobile} />}
    </div>
  );
}