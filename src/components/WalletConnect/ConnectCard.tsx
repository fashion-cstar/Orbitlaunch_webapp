import { Button } from '@mui/material'
import { useEthers } from '@usedapp/core'
import { ArrowSwapHorizontal } from 'iconsax-react'
import { CHAIN_ID_MAP, CHAIN_ID_ICON_MAP } from 'shared/AppConstant'
import { useWalletConnect } from './WalletConnect'

export default function ConnectCard() {
  const { account } = useEthers()
  const { openWalletConnectDialog } = useWalletConnect()

  const chain = CHAIN_ID_MAP[56]
  const chainIcon = CHAIN_ID_ICON_MAP[56]
  const oppositeChainId = 1
  const oppositeChain = CHAIN_ID_MAP[oppositeChainId]
  const oppositeChainIcon = CHAIN_ID_ICON_MAP[oppositeChainId]

  return (
    <div className="bg-gradient-primary rounded p-[2px]">
      <div className="space-y-4 rounded bg-gray-900 p-4 text-white shadow-2xl shadow-yellow-600">
        <div className="flex items-center space-x-2">
          <img src="/millions.png" alt="MILLIONS" className="h-6 w-6" />
          <div className="font-bold">BRIDGE</div>
        </div>
        <div className="flex items-center space-x-2 rounded bg-slate-800 py-1 px-2 sm:space-x-4">
          <div className="flex items-center space-x-2">
            {chainIcon}
            <div className="text-xs sm:text-sm">{chain}</div>
          </div>

          <ArrowSwapHorizontal
            color="#f6f2c0"
            variant="TwoTone"
            className="text-white"
          />

          <div className="flex items-center space-x-2">
            {oppositeChainIcon}
            <div className="text-xs sm:text-sm">{oppositeChain}</div>
          </div>
        </div>
        <div className="font-medium">
          Welcome MILLIONS holders to the ETH x BSC Bridge!{' '}
          <p>Please connect your wallet to continue</p>
        </div>
        <Button
          fullWidth
          className="bg-gradient-primary"
          variant={'contained'}
          onClick={openWalletConnectDialog}
        >
          {account ? 'disconnect' : 'connect'}
        </Button>
      </div>
    </div>
  )
}
