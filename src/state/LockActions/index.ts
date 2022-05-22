import { useCallback, useEffect, useMemo, useState } from "react"
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { useEthers, ChainId } from "@usedapp/core"
import { getContract, parseEther, calculateGasMargin } from 'src/utils'
import TierTokenLockABI from 'src/lib/contract/abis/TierTokenLockAbi.json'
import { TransactionResponse } from '@ethersproject/providers'
import { getChainIdFromName, PROJECT_STATUS } from 'src/utils'
import { RpcProviders } from "@app/shared/PadConstant"
import moment from 'moment'
import useRefresh from '../useRefresh'

export function useLockContract(lockContractAddress: string, blockchain: string): {
    lockAndClaimTierCallback: (amount: BigNumber, lockDays: number,) => Promise<TransactionResponse>,
    userTierAndUnlockTimeCallback: (address: string) => Promise<string>,
    extendLockTimeCallback: (additionalDays: number) => Promise<TransactionResponse>,
    increaseTierCallback: (amount: BigNumber) => Promise<TransactionResponse>,
    unlockTokenCallback: () => Promise<TransactionResponse>
} {
    // get claim data for this account
    const { account, library } = useEthers()
    const chainId = getChainIdFromName(blockchain);
    const lockContract: Contract = getContract(lockContractAddress, TierTokenLockABI, library, account ? account : undefined)
    const lockAndClaimTierCallback = async function (amount: BigNumber, lockDays: number) {
        if (!account || !library || !lockContractAddress) return
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
        if (!account || !library || !lockContractAddress) return
        return lockContract.getUserTierAndUnlockTime(address).then((res: any) => {
            return res
        })
    }

    const extendLockTimeCallback = async function (additionalDays: number) {
        if (!account || !library || !lockContractAddress) return
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
        if (!account || !library || !lockContractAddress) return
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
        if (!account || !library || !lockContractAddress) return
        return lockContract.estimateGas.unlockToken().then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return lockContract.unlockToken({
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response.hash
            })
        })
    }
    return { lockAndClaimTierCallback, userTierAndUnlockTimeCallback, extendLockTimeCallback, increaseTierCallback, unlockTokenCallback }
}

export function useTierAndUnlockTime(lockContractAddress: string, blockchain: string, isOpen: boolean): { userClaimedTier: number, unlockTimes: number, lockedAmount: BigNumber, updateTierAndUnlockTime: () => void } {
    const { account, library } = useEthers()
    const [userClaimedTier, setTier] = useState(0)
    const [unlockTimes, setUnlockTimes] = useState(0)
    const [lockedAmount, setLockedAmount] = useState(BigNumber.from(0))
    const chainId = getChainIdFromName(blockchain);
    const { slowRefresh, fastRefresh } = useRefresh()

    const fetchTierAndUnlockTime = async () => {
        const lockContract: Contract = getContract(lockContractAddress, TierTokenLockABI, RpcProviders[chainId], account ? account : undefined)
        const res = await lockContract.getUserTierAndUnlockTime(account)
        return res
    }
    const fetchUserLockAmount = async () => {
        const lockContract: Contract = getContract(lockContractAddress, TierTokenLockABI, RpcProviders[chainId], account ? account : undefined)
        const res = await lockContract.userLockInfo(account)
        return res
    }

    const updateTierAndUnlockTime = async () => {
        fetchTierAndUnlockTime().then(result => {
            setTier(result[0]?.toNumber() == 10 ? 0 : result[0]?.toNumber() + 1)
            let cur = moment(moment.now())
            let unlockTimestamp = moment(result[1]?.toNumber() * 1000)
            setUnlockTimes(unlockTimestamp.diff(cur, 'seconds') < 0 ? 0 : unlockTimestamp.diff(cur, 'seconds'))
        }).catch(error => { console.log(error) })
        fetchUserLockAmount().then(result => {
            setLockedAmount(result?.amount)
        }).catch(error => { console.log(error) })
    }

    useEffect(() => {
        if (lockContractAddress) {
            updateTierAndUnlockTime()
        }
    }, [lockContractAddress, slowRefresh, isOpen])

    return { userClaimedTier, unlockTimes, lockedAmount, updateTierAndUnlockTime }
}