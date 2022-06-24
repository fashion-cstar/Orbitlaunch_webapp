/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState, useRef } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useEthers, ChainId } from "@usedapp/core";
import { getContract, parseEther, calculateGasMargin } from 'src/utils'
import { TransactionResponse } from '@ethersproject/providers'
import { RpcProviders } from "@app/shared/PadConstant"
import useRefresh from '../state/useRefresh'
import { getChainIdFromName } from 'src/utils'
import orbitplay from 'src/lib/contract/abis/orbitplay.json'
import { OrbitPlayContractAddress as playContractAddress } from "@app/shared/PlayConstant"

declare type Maybe<T> = T | null | undefined

export interface IPlayedInfo {
    timesPlayed: number
    paidOut: BigNumber
    burnt: BigNumber
}

export interface IPlayContext {
    playInfo: IPlayedInfo
    diceInfo: IPlayedInfo
    spinInfo: IPlayedInfo
    coinFlipInfo: IPlayedInfo
    placeDiceRollBetCallback: (amount: BigNumber, diceNumber: number,) => Promise<any>
    claimDiceRollWinCallback: () => Promise<TransactionResponse>
    placeCoinFlipBetCallback: (amount: BigNumber, diceNumber: number,) => Promise<any>
    claimCoinFlipWinCallback: () => Promise<TransactionResponse>
    placeSpinBetCallback: (amount: BigNumber, diceNumber: number,) => Promise<any>
    claimSpinWinCallback: () => Promise<TransactionResponse>
    updateOrbitPlayStats: () => void
}

const PlayContext = React.createContext<Maybe<IPlayContext>>(null)
const blockchain = 'bsc'

export const PlayProvider = ({ children = null as any }) => {
    const { account, library } = useEthers()
    const { slowRefresh } = useRefresh()
    const [playInfo, setPlayInfo] = useState<IPlayedInfo>({ timesPlayed: 0, paidOut: BigNumber.from(0), burnt: BigNumber.from(0) })
    const [diceInfo, setDiceInfo] = useState<IPlayedInfo>({ timesPlayed: 0, paidOut: BigNumber.from(0), burnt: BigNumber.from(0) })
    const [spinInfo, setSpinInfo] = useState<IPlayedInfo>({ timesPlayed: 0, paidOut: BigNumber.from(0), burnt: BigNumber.from(0) })
    const [coinFlipInfo, setCoinFlipInfo] = useState<IPlayedInfo>({ timesPlayed: 0, paidOut: BigNumber.from(0), burnt: BigNumber.from(0) })

    useEffect(() => {
        updateOrbitPlayStats()
    }, [slowRefresh, account])

    const placeDiceRollBetCallback = async function (amount: BigNumber, diceNumber: number) {
        const chainId = getChainIdFromName(blockchain);
        const playContract: Contract = getContract(playContractAddress, orbitplay, library, account ? account : undefined)
        if (!account || !library || !playContractAddress) return
        return playContract.estimateGas.placeDiceRollBet(amount, BigNumber.from(diceNumber)).then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return playContract.placeDiceRollBet(amount, BigNumber.from(diceNumber), {
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response.wait().then((res: any) => {
                    return res.events.pop()
                })
            })
        })
    }

    const claimDiceRollWinCallback = async function () {
        const chainId = getChainIdFromName(blockchain);
        const playContract: Contract = getContract(playContractAddress, orbitplay, library, account ? account : undefined)
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
        const chainId = getChainIdFromName(blockchain);
        const playContract: Contract = getContract(playContractAddress, orbitplay, library, account ? account : undefined)
        if (!account || !library || !playContractAddress) return
        return playContract.estimateGas.placeCoinFlipBet(amount, BigNumber.from(diceNumber)).then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return playContract.placeCoinFlipBet(amount, BigNumber.from(diceNumber), {
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response.wait().then((res: any) => {
                    return res.events.pop()
                })
            })
        })
    }

    const claimCoinFlipWinCallback = async function () {
        const chainId = getChainIdFromName(blockchain);
        const playContract: Contract = getContract(playContractAddress, orbitplay, library, account ? account : undefined)
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

    const placeSpinBetCallback = async function (amount: BigNumber, diceNumber: number) {
        const chainId = getChainIdFromName(blockchain);
        const playContract: Contract = getContract(playContractAddress, orbitplay, library, account ? account : undefined)
        if (!account || !library || !playContractAddress) return
        return playContract.estimateGas.placeSpinBet(amount, BigNumber.from(diceNumber)).then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return playContract.placeSpinBet(amount, BigNumber.from(diceNumber), {
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response.wait().then((res: any) => {
                    return res.events.pop()
                })
            })
        })
    }

    const claimSpinWinCallback = async function () {
        const chainId = getChainIdFromName(blockchain);
        const playContract: Contract = getContract(playContractAddress, orbitplay, library, account ? account : undefined)
        if (!account || !library || !playContractAddress) return
        return playContract.estimateGas.claimSpinWin().then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return playContract.claimSpinWin({
                gasLimit: calculateGasMargin(gas)
            }).then((response: TransactionResponse) => {
                return response
            })
        })
    }

    const fetchPlayInfo = async (playContract: Contract) => {
        const res = await playContract.playInfo()
        return res
    }

    const fetchDiceInfo = async (playContract: Contract) => {
        const res = await playContract.diceInfo()
        return res
    }

    const fetchCoinFlipInfo = async (playContract: Contract) => {
        const res = await playContract.coinFlipInfo()
        return res
    }

    const fetchSpinInfo = async (playContract: Contract) => {
        const res = await playContract.spinInfo()
        return res
    }

    const updateOrbitPlayStats = async () => {
        const chainId = getChainIdFromName(blockchain);
        const playContract: Contract = getContract(playContractAddress, orbitplay, RpcProviders[chainId], account ? account : undefined)
        fetchPlayInfo(playContract).then(async (result: any) => {
            setPlayInfo({ timesPlayed: result?.timesPlayed, paidOut: result?.paidOut, burnt: result?.burnt })
        }).catch(error => { console.log(error) })

        fetchDiceInfo(playContract).then(result => {
            setDiceInfo({ timesPlayed: result?.timesPlayed, paidOut: result?.paidOut, burnt: result?.burnt })
        }).catch(error => { console.log(error) })

        fetchCoinFlipInfo(playContract).then(result => {
            setCoinFlipInfo({ timesPlayed: result?.timesPlayed, paidOut: result?.paidOut, burnt: result?.burnt })
        }).catch(error => { console.log(error) })

        fetchSpinInfo(playContract).then(result => {
            setSpinInfo({ timesPlayed: result?.timesPlayed, paidOut: result?.paidOut, burnt: result?.burnt })
        }).catch(error => { console.log(error) })
    }

    return (
        <PlayContext.Provider
            value={{
                playInfo,
                diceInfo,
                spinInfo,
                coinFlipInfo,
                placeDiceRollBetCallback,
                claimDiceRollWinCallback,
                placeCoinFlipBetCallback,
                claimCoinFlipWinCallback,
                placeSpinBetCallback,
                claimSpinWinCallback,
                updateOrbitPlayStats
            }}
        >
            {children}
        </PlayContext.Provider >
    )
}

export const usePlay = () => {
    const context = useContext(PlayContext)

    if (!context) {
        throw new Error('Component rendered outside the provider tree')
    }

    return context
}
