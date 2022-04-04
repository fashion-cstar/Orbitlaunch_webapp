import moment from 'moment'
import React, { useMemo, useState, useEffect, useRef } from 'react'
import ChainIcon from '../ChainIcon'
import { useTotalInvestedAmount, useGetTotalInvestors, useDepositInfo, useLaunchTokenPrice } from 'src/state/Pad/hooks'
import { useToken } from 'src/state/hooks'
import { BUSDTokenAddress } from "@app/shared/PadConstant";
import { formatEther } from 'src/utils'
import { getChainIdFromName } from 'src/utils'
import { useEthers, ChainId } from "@usedapp/core";
import { useRouter } from 'next/router'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function EndedIdoMobileRow({ ido, key }: { ido: any, key: number }) {
    const { library, account, chainId } = useEthers()
    const depositedAmount = useDepositInfo(ido.contractAddress, ido.blockchain)
    const investedAmount = useTotalInvestedAmount(ido.contractAddress, ido.blockchain)
    const totalInvestors = useGetTotalInvestors(ido.contractAddress, ido.blockchain)
    const [totalInvestedAmount, setTotalInvestedAmount] = useState(0)
    const [userDepositedAmount, setUserDepositedAmount] = useState(0)
    const [launchTokenPrice, setLaunchTokenPrice] = useState(0)
    const tokenPrice = useLaunchTokenPrice(ido.contractAddress, ido.blockchain)
    const userDepositToken = useToken(BUSDTokenAddress[chainId], ido.blockchain)
    const router = useRouter()

    useEffect(() => {
        setLaunchTokenPrice(formatEther(tokenPrice, 18, 5))
    }, [tokenPrice])

    useEffect(() => {
        if (userDepositToken) {
            if (userDepositToken?.decimals && investedAmount) setTotalInvestedAmount(formatEther(investedAmount, userDepositToken?.decimals, 2))
        }
    }, [investedAmount, userDepositToken])

    useEffect(() => {
        if (userDepositToken) {
            if (userDepositToken?.decimals && depositedAmount) setUserDepositedAmount(formatEther(depositedAmount, userDepositToken?.decimals, 2))
        }
    }, [depositedAmount, userDepositToken])

    const handleClickProject = () => {
        router.push({
            pathname: '/pad',
            query: { project: ido.projectName },
        })
    }

    return (
        <Accordion key={key}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ backgroundColor: '#001926' }}
            >
                <div className="flex justify-start w-full">
                    <div className='w-full max-w-[500px]'>
                        <div className='flex items-center justify-between gap-4 ml-4'>
                            <div className='flex gap-4 items-center'>
                                <img src={ido.projectIcon} className='w-8 h-8 mr-4' />
                                <div className="text-white text-[16px] p-0">{ido.projectName}</div>
                            </div>
                            <div className="text-[#919699] text-[12px] uppercase p-0">${ido.projectSymbol}</div>
                        </div>
                    </div>
                </div>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#001926' }}>
                <div className="px-4 flex justify-center w-full">
                    <table className="w-full max-w-[700px] border-collapse border border-slate-600 cursor-pointer hover:shadow-xl hover:scale-[1.01] hover:border-2 hover:border-slate-500" onClick={handleClickProject}>
                        <tr>
                            <td className="border-collapse border border-slate-600 p-2 text-center">Your Investment</td>
                            <td className="border-collapse border border-slate-600 p-2 text-center">{userDepositedAmount ? `${userDepositedAmount.toLocaleString()} ${userDepositToken ? userDepositToken.symbol : ''} ` : ''}</td>
                        </tr>
                        <tr>
                            <td className="border-collapse border border-slate-600 p-2 text-center">Participants</td>
                            <td className="border-collapse border border-slate-600 p-2 text-center">{totalInvestors ? totalInvestors.toNumber().toLocaleString() : ''}</td>
                        </tr>
                        <tr>
                            <td className="border-collapse border border-slate-600 p-2 text-center">Total Raised</td>
                            <td className="border-collapse border border-slate-600 p-2 text-center">
                                {totalInvestedAmount ? `${totalInvestedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                            </td>
                        </tr>
                        <tr>
                            <td className="border-collapse border border-slate-600 p-2 text-center">Whitelist Price</td>
                            <td className="border-collapse border border-slate-600 p-2 text-center">${launchTokenPrice}</td>
                        </tr>
                        <tr>
                            <td className="border-collapse border border-slate-600 p-2 text-center">ATH Since Launch</td>
                            <td className="border-collapse border border-slate-600 p-2 text-center">{`${ido?.allTimeHigh ? '$' + ido?.allTimeHigh : ''}`}</td>
                        </tr>
                        <tr>
                            <td className="border-collapse border border-slate-600 p-2 text-center">ROI</td>
                            <td className="border-collapse border border-slate-600 p-2 flex justify-center items-center">
                                <div className='w-14 h-6 bg-[#00D98D] rounded text-black text-[12px] flex items-center justify-center font-normal'>
                                    {ido?.returnOnInvestment ? ido?.returnOnInvestment + "%" : ''}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="border-collapse border border-slate-600 p-2 text-center">Presale Completed</td>
                            <td className="border-collapse border border-slate-600 p-2 text-center">{moment(ido.launchEndDate * 1000).format("MMM Do YY")}</td>
                        </tr>
                        <tr>
                            <td className="border-collapse border border-slate-600 p-2 text-center">Networks</td>
                            <td className="border-collapse border border-slate-600 p-2 text-center flex justify-center items-center"><ChainIcon blockchain={ido.blockchain} /></td>
                        </tr>
                    </table>
                </div>
            </AccordionDetails>
        </Accordion>
    )
}