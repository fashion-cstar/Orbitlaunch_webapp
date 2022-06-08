/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState, useRef } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useEthers, useTokenBalance } from "@usedapp/core";
import { getContract, parseEther, calculateGasMargin } from 'src/utils'
import { TransactionResponse } from '@ethersproject/providers'
import { RpcProviders } from "@app/shared/PadConstant"
import useRefresh from '../state/useRefresh'
import { CompletedFundAddresses, LastFundAddresses, CurrentFundAddresses, isUsingOldTier } from '@app/shared/FundConstant'
import { getChainIdFromName } from 'src/utils'
import orbitFundAbi from "@app/lib/contract/abis/OrbitFundAbi.json";
import { formatEther } from '@app/utils'
import { formatEther as formatEtherCommon } from "@ethersproject/units";
import { getTierValues, tierInformation } from '@app/shared/TierLevels'
import { useLockActions } from "@app/contexts"
import { AppTokenAddress, OrbtTokenAddress } from '@app/shared/AppConstant';

declare type Maybe<T> = T | null | undefined

export interface ITotalStats {
    investedAmount: string
    investors: string
    ProfitToDate: string
}

export interface IPriorTotalStats {
    investedAmount: string
    profit: string
    returned: string
}

export interface IPriorPersnalStats {
    investedAmount: string
    profit: string
    returned: string
}

export interface ICurrentUserStats {
    investedAmount: string
    RoiToDate: string
}

export interface IFundStatsContext {
    totalStats: ITotalStats
    priorTotalStats: IPriorTotalStats
    userCurrentStats: ICurrentUserStats
    priorPersonalStats: IPriorPersnalStats
    currentTierNo: number
    updateUserCurrentTierNo: () => Promise<void>
    updateTotalStats: () => Promise<void>
    updatePriorTotalStats: () => Promise<void>
    updateUserCurrentStats: () => Promise<void>
    updatePriorPersonalStats: () => Promise<void>
}

const FundStatsContext = React.createContext<Maybe<IFundStatsContext>>(null)

export const FundStatsProvider = ({ children = null as any }) => {
    const { account, library } = useEthers()
    const { slowRefresh } = useRefresh()
    const [totalStats, setTotalStats] = useState<ITotalStats>({ investedAmount: '--', investors: '--', ProfitToDate: '--' })
    const [priorTotalStats, setPriorTotalStats] = useState<IPriorTotalStats>({ investedAmount: '--', profit: '--', returned: '--' })
    const [userCurrentStats, setUserCurrentStats] = useState<ICurrentUserStats>({ investedAmount: '--', RoiToDate: '--' })
    const [priorPersonalStats, setPriorPersonalStats] = useState<IPriorPersnalStats>({ investedAmount: '--', profit: '--', returned: '--' })
    const [currentTierNo, setCurrentTierNo] = useState(0)
    const { userClaimedTier } = useLockActions()
    const connectedUserBalanceM31 = useTokenBalance(AppTokenAddress, account);
    const connectedUserBalanceOrbit = useTokenBalance(OrbtTokenAddress, account);

    useEffect(() => {
        updateTotalStats()
        updatePriorTotalStats()
        if (account) {
            updateUserCurrentStats()
            updatePriorPersonalStats()
        }
    }, [account, slowRefresh])

    useEffect(() => {
        if (account){
            updateUserCurrentTierNo()
        }
    }, [account, connectedUserBalanceM31, connectedUserBalanceOrbit])

    const updateUserCurrentTierNo = async () => {
        if (isUsingOldTier) {
            const formattedConnectedBalanceM31 = formatEtherCommon(connectedUserBalanceM31??BigNumber.from(0));
            const formattedConnectedBalanceOrbit = formatEtherCommon(connectedUserBalanceOrbit??BigNumber.from(0));
            let tierResult = await getTierValues(BigNumber.from(Math.trunc(Math.max(parseFloat(formattedConnectedBalanceM31), parseFloat(formattedConnectedBalanceOrbit)))))
            setCurrentTierNo(tierResult.tierNo)
        } else {
            setCurrentTierNo(userClaimedTier)
        }
    }

    const updateTotalStats = async () => {
        let invested = BigNumber.from(0), investors = BigNumber.from(0), ProfitToDate = '--'
        let totalFundAddresses = []

        CompletedFundAddresses.map(item => { totalFundAddresses.push(item) })
        CurrentFundAddresses.map(item => { totalFundAddresses.push(item) })

        await Promise.all(totalFundAddresses.map(async (address) => {
            const orbitFundContract = getContract(address, orbitFundAbi, RpcProviders[getChainIdFromName('bsc')], account ? account : undefined);
            try {
                let res = await orbitFundContract.totalInvestedAmount()
                if (res) invested = invested.add(res)
                res = await orbitFundContract.getTotalInvestors()
                if (res) investors = investors.add(res)
            } catch (err) { }
        }))
        await (fetch(`https://backend-api-pi.vercel.app/api/Fund`)
            .then((res: any) => res.json())
            .then((res) => {
                if (res)
                    ProfitToDate = Number(res.totalRoiToDate).toFixed(2)
                else
                    ProfitToDate = '0.00'
            })
            .catch(error => {
                console.error("Failed to get profitToDate: " + error)
                ProfitToDate = '0.00'
            }))
        setTotalStats({ investedAmount: formatEther(invested, 18, 2).toString(), investors: investors.toString(), ProfitToDate: ProfitToDate })
    }

    const updatePriorTotalStats = async () => {
        let invested = BigNumber.from(0), profit = '0.00', returned = '--'

        await Promise.all(LastFundAddresses.map(async (address) => {
            const orbitFundContract = getContract(address, orbitFundAbi, RpcProviders[getChainIdFromName('bsc')], account ? account : undefined);
            try {
                let res = await orbitFundContract.totalInvestedAmount()
                if (res) invested = invested.add(res)
            } catch (err) { }
        }))
        await (fetch("https://backend-api-pi.vercel.app/api/Fund/2")
            .then((res: any) => res.json())
            .then((res) => {
                if (res)
                    profit = (Math.round(Number(res.data.roiToDate)*100)/100).toString()
                else
                    profit = '0.00'
            })
            .catch(error => {
                console.error("Failed to get Prior Months's Total Profit to Investors: " + error)
                profit = '0.00'
            }))
        returned = (Math.round((Number(profit) + formatEther(invested, 18, 2))*100)/100).toString()
        setPriorTotalStats({ investedAmount: formatEther(invested, 18, 2).toString(), profit: profit.toString(), returned: returned.toString() })
    }

    const updateUserCurrentStats = async () => {
        let invested = BigNumber.from(0), RoiToDate = 0

        await Promise.all(CompletedFundAddresses.map(async (address) => {
            const orbitFundContract = getContract(address, orbitFundAbi, library, account ? account : undefined);
            try {
                let res = await orbitFundContract.depositInfos(account)
                if (res) {
                    RoiToDate = RoiToDate + formatEther(res.amount, 18, 5) * Number(tierInformation[res.tierValue].monthlyPercent) / 100
                }
            } catch (err) { }
        }))
        await Promise.all(CurrentFundAddresses.map(async (address) => {
            const orbitFundContract = getContract(address, orbitFundAbi, library, account ? account : undefined);
            try {
                let res = await orbitFundContract.depositInfos(account)
                if (res) {
                    invested = invested.add(res.amount)
                }
            } catch (err) { }
        }))
        setUserCurrentStats({ investedAmount: formatEther(invested, 18, 2).toString(), RoiToDate: (Math.round(RoiToDate*100)/100).toString() })
    }

    const updatePriorPersonalStats = async () => {
        let invested = BigNumber.from(0), profit = 0, returned = '--'

        await Promise.all(LastFundAddresses.map(async (address) => {
            const orbitFundContract = getContract(address, orbitFundAbi, library, account ? account : undefined);
            try {
                let res = await orbitFundContract.depositInfos(account)
                if (res) {
                    invested = invested.add(res.amount)
                    profit = profit + formatEther(res.amount, 18, 5) * Number(tierInformation[res.tierValue].monthlyPercent) / 100
                }
            } catch (err) { }
        }))
        returned = (Math.round((profit + formatEther(invested, 18, 2))*100)/100).toString()
        setPriorPersonalStats({ investedAmount: formatEther(invested, 18, 2).toString(), profit: profit.toString(), returned: returned.toString() })
    }

    return (
        <FundStatsContext.Provider
            value={{
                totalStats,
                priorTotalStats,
                userCurrentStats,
                priorPersonalStats,
                currentTierNo,
                updateUserCurrentTierNo,
                updateTotalStats,
                updatePriorTotalStats,
                updateUserCurrentStats,
                updatePriorPersonalStats
            }}
        >
            {children}
        </FundStatsContext.Provider>
    )
}

export const useFundStates = () => {
    const context = useContext(FundStatsContext)

    if (!context) {
        throw new Error('Component rendered outside the provider tree')
    }

    return context
}
