import { useCallback, useEffect, useMemo, useState } from "react"
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { useEthers, ChainId } from "@usedapp/core"
import { getContract, parseEther, calculateGasMargin } from 'src/utils'
import orbitplay from 'src/lib/contract/abis/orbitplay.json'
import { TransactionResponse } from '@ethersproject/providers'
import { getChainIdFromName, PROJECT_STATUS } from 'src/utils'
import { RpcProviders } from "@app/shared/PadConstant"
import useRefresh from '../useRefresh'

export function usePlayActions(playContractAddress: string, blockchain: string): {
    placeDiceRollBetCallback: (amount: BigNumber, diceNumber: number,) => Promise<any>,
    claimDiceRollWinCallback: () => Promise<TransactionResponse>,
    placeCoinFlipBetCallback: (amount: BigNumber, diceNumber: number,) => Promise<any>,
    claimCoinFlipWinCallback: () => Promise<TransactionResponse>
} {
    // get claim data for this account
    const { account, library } = useEthers()
    const chainId = getChainIdFromName(blockchain);
    const playContract: Contract = getContract(playContractAddress, orbitplay, library, account ? account : undefined)
    const placeDiceRollBetCallback = async function (amount: BigNumber, diceNumber: number) {
        if (!account || !library || !playContractAddress) return
        return playContract.estimateGas.placeDiceRollBet(amount, BigNumber.from(diceNumber)).then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return playContract.placeDiceRollBet(amount, BigNumber.from(diceNumber), {
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response.wait().then((res: any) => {
                    console.log(res)
                    return res.events.pop()
                })
            })
        })
    }

    const claimDiceRollWinCallback = async function () {
        if (!account || !library || !playContractAddress) return
        return playContract.estimateGas.claimDiceRollWin().then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return playContract.claimDiceRollWin({
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response
            })
        })
    }

    const placeCoinFlipBetCallback = async function (amount: BigNumber, diceNumber: number) {
        if (!account || !library || !playContractAddress) return
        return playContract.estimateGas.placeCoinFlipBet(amount, BigNumber.from(diceNumber)).then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return playContract.placeCoinFlipBet(amount, BigNumber.from(diceNumber), {
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response.wait().then((res: any) => {
                    console.log(res)
                    return res.events.pop()
                })
            })
        })
    }

    const claimCoinFlipWinCallback = async function () {
        if (!account || !library || !playContractAddress) return
        return playContract.estimateGas.claimCoinFlipWin().then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return playContract.claimCoinFlipWin({
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response
            })
        })
    }
    return {
        placeDiceRollBetCallback,
        claimDiceRollWinCallback,
        placeCoinFlipBetCallback,
        claimCoinFlipWinCallback
    }
}

export function useOrbitPlayStats(playContractAddress: string, blockchain: string, isOpen: boolean): { playInfo: any, diceInfo: any, coinFlipInfo: any, updateOrbitPlayStats: () => void } {
    const { account, library } = useEthers()
    const [playInfo, setPlayInfo] = useState<any>({ timesPlayed: 0, paidOut: BigNumber.from(0), burnt: BigNumber.from(0) })
    const [diceInfo, setDiceInfo] = useState<any>({ timesPlayed: 0, paidOut: BigNumber.from(0), burnt: BigNumber.from(0) })
    const [coinFlipInfo, setCoinFlipInfo] = useState<any>({ timesPlayed: 0, paidOut: BigNumber.from(0), burnt: BigNumber.from(0) })
    const chainId = getChainIdFromName(blockchain);
    const { slowRefresh } = useRefresh()

    const fetchPlayInfo = async () => {
        const playContract: Contract = getContract(playContractAddress, orbitplay, RpcProviders[chainId], account ? account : undefined)
        const res = await playContract.playInfo()
        return res
    }
    
    const fetchDiceInfo = async () => {
        const playContract: Contract = getContract(playContractAddress, orbitplay, RpcProviders[chainId], account ? account : undefined)
        const res = await playContract.diceInfo()
        return res
    }

    const fetchCoinFlipInfo = async () => {
        const playContract: Contract = getContract(playContractAddress, orbitplay, RpcProviders[chainId], account ? account : undefined)
        const res = await playContract.coinFlipInfo()
        return res
    }

    const updateOrbitPlayStats = async () => {

        fetchPlayInfo().then(async (result: any) => {
            setPlayInfo({ timesPlayed: result?.timesPlayed, paidOut: result?.paidOut, burnt: result?.burnt })
        }).catch(error => { console.log(error) })

        fetchDiceInfo().then(result => {
            setDiceInfo({ timesPlayed: result?.timesPlayed, paidOut: result?.paidOut, burnt: result?.burnt })
        }).catch(error => { console.log(error) })

        fetchCoinFlipInfo().then(result => {
            setCoinFlipInfo({ timesPlayed: result?.timesPlayed, paidOut: result?.paidOut, burnt: result?.burnt })
        }).catch(error => { console.log(error) })
    }

    useEffect(() => {
        if (playContractAddress && account && library) {
            updateOrbitPlayStats()
        }
    }, [playContractAddress, slowRefresh, isOpen, account])

    return { playInfo, diceInfo, coinFlipInfo, updateOrbitPlayStats }
}