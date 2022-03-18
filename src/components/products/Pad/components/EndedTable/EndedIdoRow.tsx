import moment from 'moment'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import ChainIcon from '../ChainIcon'
import { useTotalInvestedAmount, useGetTotalInvestors, useDepositInfo, useLaunchTokenPrice, useToken } from 'src/state/Pad/hooks'
import { BUSDTokenAddress } from "@app/shared/PadConstant";
import { formatEther } from 'src/utils'
import { getChainIdFromName } from 'src/utils'
import { useEthers, ChainId } from "@usedapp/core";

export default function EndedIdoRow({ ido }: { ido: any }) {
    const { library, account, chainId } = useEthers()
    const depositedAmount = useDepositInfo(ido.contractAddress, ido.blockchain)
    const investedAmount = useTotalInvestedAmount(ido.contractAddress, ido.blockchain)
    const totalInvestors = useGetTotalInvestors(ido.contractAddress, ido.blockchain)
    const [totalInvestedAmount, setTotalInvestedAmount] = useState(0)
    const [userDepositedAmount, setUserDepositedAmount] = useState(0)
    const [launchTokenPrice, setLaunchTokenPrice] = useState(0)
    const tokenPrice = useLaunchTokenPrice(ido.contractAddress, ido.blockchain)
    const userDepositToken = useToken(BUSDTokenAddress[chainId], ido.blockchain)

    useEffect(() => {
       setLaunchTokenPrice(formatEther(tokenPrice, 18, 5))
    }, [tokenPrice])

    useEffect(() => {        
        if (userDepositToken){            
            if (userDepositToken?.decimals && investedAmount) setTotalInvestedAmount(formatEther(investedAmount, userDepositToken?.decimals, 2))            
        }
    }, [investedAmount, userDepositToken])

    useEffect(() => {
        if (userDepositToken){
            if (userDepositToken?.decimals && depositedAmount) setUserDepositedAmount(formatEther(depositedAmount, userDepositToken?.decimals, 2))
        }
    }, [depositedAmount, userDepositToken])

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
            <div className="min-w-[140px] justify-end text-[16px] flex items-center" style={{ width: "15%" }}>{moment(ido.launchEndDate * 1000).format("MMM Do YY")}</div>
            <div className="min-w-[70px] justify-end flex items-center" style={{ width: "7%" }}><ChainIcon blockchain={ido.blockchain} /></div>
        </div>
    )
}