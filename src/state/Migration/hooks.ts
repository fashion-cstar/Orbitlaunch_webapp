import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { useCallback, useEffect, useMemo, useState } from "react"
import { useEthers, ChainId } from "@usedapp/core"
import { ethers } from "ethers"
import { getContract, parseEther, calculateGasMargin } from 'src/utils'
import ERC20_ABI from 'src/lib/contract/abis/erc20.json'
import PAD_ABI from 'src/lib/contract/abis/orbitpad.json'
import { TransactionResponse } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { M31TokenAddress, RpcProviders } from "@app/shared/PadConstant"
import { getTierValues } from '@app/shared/TierLevels'
import { getChainIdFromName, PROJECT_STATUS } from 'src/utils'
import { useTokenBalance } from '../hooks'
import useRefresh from '../useRefresh'

export function useJoinPresaleCallback(): {
  joinPresaleCallback: (padContractAddress: string, tokenContractAddress: string, amount: number, blockchain: string) => Promise<string>
} {
  // get claim data for this account
  const { account, library, chainId } = useEthers()

  const joinPresaleCallback = async function (padContractAddress: string, tokenContractAddress: string, amount: number, blockchain: string) {
    const chainId = getChainIdFromName(blockchain);
    const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
    const tokenContract: Contract = getContract(tokenContractAddress, ERC20_ABI, RpcProviders[chainId], account ? account : undefined)
    let decimals = await tokenContract.decimals()

    if (!account || !library || !padContract) return
    if (tokenContractAddress === AddressZero) {
      return padContract.estimateGas.deposit(parseEther(amount, decimals), {
        value: parseEther(amount, decimals)
      }).then(estimatedGasLimit => {
        const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
        return padContract.deposit(parseEther(amount, decimals), {
          gasLimit: calculateGasMargin(gas), value: parseEther(amount, decimals)
        }).then((response: TransactionResponse) => {
          return response.hash
        })
      })
    } else {
      return padContract.estimateGas.deposit(parseEther(amount, decimals)).then(estimatedGas => {
        return padContract.estimateGas.deposit(parseEther(amount, decimals)).then(estimatedGasLimit => {
          const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
          return padContract.deposit(parseEther(amount, decimals), {
            gasLimit: calculateGasMargin(gas)
          }).then((response: TransactionResponse) => {
            return response.hash
          })
        })
      })
    }
  }

  return { joinPresaleCallback }
}

