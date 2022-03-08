import moment from 'moment'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import ChainIcon from '../ChainIcon'
import { useTotalInvestedAmount, useGetTotalInvestors, useDepositInfo, useLaunchTokenPrice, uselaunchTokenDecimals } from 'src/state/Pad/hooks'
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from 'src/utils'
import { getChainIdFromName } from 'src/utils'

export default function EndedIdoRow({ ido }: { ido: any }) {
    const depositedAmount = useDepositInfo(ido.contractAddress, ido.blockchain)
    const investedAmount = useTotalInvestedAmount(ido.contractAddress, ido.blockchain)
    const totalInvestors = useGetTotalInvestors(ido.contractAddress, ido.blockchain)
    const [totalInvestedAmount, setTotalInvestedAmount] = useState(0)
    const [userDepositedAmount, setUserDepositedAmount] = useState(0)
    const [launchTokenPrice, setLaunchTokenPrice] = useState(0)
    const tokenPrice = useLaunchTokenPrice(ido.contractAddress, ido.blockchain)
    const tokenDecimals = uselaunchTokenDecimals(ido.contractAddress, ido.blockchain)

    useEffect(() => {
        if (tokenDecimals.toNumber()>0 && tokenPrice) setLaunchTokenPrice(formatEther(tokenPrice, tokenDecimals.toNumber(), 4))
    }, [tokenPrice, tokenDecimals])

    useEffect(() => {
        if (tokenDecimals.toNumber()>0 && investedAmount) setTotalInvestedAmount(formatEther(investedAmount, tokenDecimals.toNumber(), 2))
    }, [investedAmount, tokenDecimals])

    useEffect(() => {
        if (tokenDecimals.toNumber()>0 && depositedAmount) setUserDepositedAmount(formatEther(depositedAmount, tokenDecimals.toNumber(), 2))
    }, [depositedAmount, tokenDecimals])

    return (
        <div className="border-b last:border-0 border-[#112B40] flex py-6">
            <div className="min-w-[190px]" style={{ width: "19%" }}>
                <div className='flex items-center'>
                    <img src={ido.projectIcon} className='w-8 h-8 mr-4' />
                    <div>
                        <div className="text-white text-[16px] p-0">{ido.projectName}</div>
                        <div className="text-[#919699] text-[12px] uppercase p-0">${ido.projectSymbol}</div>
                    </div>
                </div>
            </div>
            <div className="min-w-[80px] justify-end text-[16px] flex items-center" style={{ width: "9%" }}>{userDepositedAmount ? `${userDepositedAmount.toLocaleString()}` : ''}</div>
            <div className="min-w-[70px] justify-end text-[16px] flex items-center" style={{ width: "7%" }}>{totalInvestors ? totalInvestors.toNumber().toLocaleString() : ''}</div>
            <div className="min-w-[130px] justify-end text-[16px] flex items-center" style={{ width: "13%" }}>
                {totalInvestedAmount ? `${totalInvestedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
            </div>
            <div className="min-w-[100px] justify-end text-[16px] flex items-center" style={{ width: "10%" }}>${launchTokenPrice}</div>
            <div className="min-w-[100px] justify-end text-[16px] flex items-center" style={{ width: "10%" }}>${launchTokenPrice}</div>
            <div className="min-w-[110px] justify-end flex items-center" style={{ width: "10%" }}>
                <div className='w-14 h-6 bg-[#00D98D] rounded text-black text-[12px] flex items-center justify-center font-normal'>
                    {}
                </div>
            </div>
            <div className="min-w-[140px] justify-end text-[16px] flex items-center" style={{ width: "15%" }}>{moment(ido.launchDate * 1000).format("MMM Do YY")}</div>
            <div className="min-w-[70px] justify-end flex items-center" style={{ width: "7%" }}><ChainIcon blockchain={ido.blockchain} /></div>
        </div>
    )
}