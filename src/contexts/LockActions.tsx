/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState, useRef } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { useEthers, ChainId } from "@usedapp/core"
import { getContract, parseEther, calculateGasMargin } from 'src/utils'
import TierTokenLockABI from 'src/lib/contract/abis/TierTokenLockAbi.json'
import { TransactionResponse } from '@ethersproject/providers'
import { getChainIdFromName, PROJECT_STATUS } from 'src/utils'
import { RpcProviders } from "@app/shared/PadConstant"
import useRefresh from '../state/useRefresh'
import { TierTokenLockContractAddress } from "@app/shared/AppConstant"

declare type Maybe<T> = T | null | undefined

export interface ILockActionsContext {
    userClaimedTier: number
    unlockTimes: number
    lockedAmount: BigNumber
    lockAndClaimTierCallback: (amount: BigNumber, lockDays: number,) => Promise<TransactionResponse>
    userTierAndUnlockTimeCallback: (address: string) => Promise<string>
    extendLockTimeCallback: (additionalDays: number) => Promise<TransactionResponse>
    increaseTierCallback: (amount: BigNumber) => Promise<TransactionResponse>
    unlockTokenCallback: () => Promise<TransactionResponse>
    updateTierAndUnlockTime: () => Promise<void>
}

const LockActionsContext = React.createContext<Maybe<ILockActionsContext>>(null)

export const LockActionsProvider = ({ children = null as any }) => {
    const { account, library } = useEthers()
    const chainId = getChainIdFromName('bsc');
    const lockContract: Contract = getContract(TierTokenLockContractAddress, TierTokenLockABI, library, account ? account : undefined)
    const [userClaimedTier, setTier] = useState(0)
    const [unlockTimes, setUnlockTimes] = useState(0)
    const [lockedAmount, setLockedAmount] = useState(BigNumber.from(0))
    const { slowRefresh } = useRefresh()

    const lockAndClaimTierCallback = async function (amount: BigNumber, lockDays: number) {
        if (!account || !library || !TierTokenLockContractAddress) return
        return lockContract.estimateGas.lockAndClaimTier(amount, BigNumber.from(lockDays)).then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return lockContract.lockAndClaimTier(amount, BigNumber.from(lockDays), {
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response
            })
        })
    }

    const userTierAndUnlockTimeCallback = async function (address: string) {
        if (!account || !library || !TierTokenLockContractAddress) return
        return lockContract.getUserTierAndUnlockTime(address).then((res: any) => {
            return res
        })
    }

    const extendLockTimeCallback = async function (additionalDays: number) {
        if (!account || !library || !TierTokenLockContractAddress) return
        return lockContract.estimateGas.extendLockTime(BigNumber.from(additionalDays)).then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return lockContract.extendLockTime(BigNumber.from(additionalDays), {
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response
            })
        })
    }

    const increaseTierCallback = async function (amount: BigNumber) {
        if (!account || !library || !TierTokenLockContractAddress) return
        return lockContract.estimateGas.increaseTier(amount).then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return lockContract.increaseTier(amount, {
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response
            })
        })
    }

    const unlockTokenCallback = async function () {
        if (!account || !library || !TierTokenLockContractAddress) return
        return lockContract.estimateGas.unlockToken().then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return lockContract.unlockToken({
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response
            })
        })
    }

    const fetchTierAndUnlockTime = async () => {
        const res = await lockContract.getUserTierAndUnlockTime(account)
        return res
    }

    const fetchUserLockAmount = async () => {
        const res = await lockContract.userLockInfo(account)
        return res
    }

    const updateTierAndUnlockTime = async () => {
        fetchTierAndUnlockTime().then(async (result: any) => {
            setTier(result[0]?.toNumber() == 10 ? 0 : result[0]?.toNumber() + 1)
            let blocknumber = await library.getBlockNumber()
            let block = await library.getBlock(blocknumber)
            let blocktimestamp = block.timestamp
            setUnlockTimes(result[1]?.toNumber() - blocktimestamp)
        }).catch(error => { console.log(error) })
        fetchUserLockAmount().then(result => {
            setLockedAmount(result?.amount)
        }).catch(error => { console.log(error) })
    }

    useEffect(() => {
        if (TierTokenLockContractAddress && account && library) {
            updateTierAndUnlockTime()
        }
    }, [slowRefresh, account])

    return (
        <LockActionsContext.Provider
            value={{
                userClaimedTier,
                unlockTimes,
                lockedAmount,
                lockAndClaimTierCallback,
                userTierAndUnlockTimeCallback,
                extendLockTimeCallback,
                increaseTierCallback,
                unlockTokenCallback,
                updateTierAndUnlockTime
            }}
        >
            {children}
        </LockActionsContext.Provider>
    )
}

export const useLockActions = () => {
    const context = useContext(LockActionsContext)

    if (!context) {
        throw new Error('Component rendered outside the provider tree')
    }

    return context
}
