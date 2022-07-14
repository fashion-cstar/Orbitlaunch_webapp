import React, { useMemo, useState, useEffect } from 'react'
import SwapInput from '@app/components/common/SwapInput'
import SwapOutput from '@app/components/common/SwapOutput'
import { Button } from "@mui/material"
import SwapIcon from '../svgs/SwapIcon'
import QuestionMark from '../../Pad/components/svgs/QuestionMark'
import { useSnackbar } from "@app/lib/hooks/useSnackbar"
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import { useEthers } from "@usedapp/core";
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { getEtherscanLink, CHAIN_LABELS } from 'src/utils'
import UpHeadIcon from '../svgs/UpHeadIcon'
import swapTokens from '@app/shared/SwapTokens'
import SelectTokenModal from './SelectTokenModal'

export default function OrbitSwap() {
    const { library, account, chainId } = useEthers()
    const [inputAmount, setInputAmount] = useState(0)
    const [outputAmount, setOutputAmount] = useState(0)
    const [isApproved, setIsApproved] = useState(false)
    const [hash, setHash] = useState<string | undefined>()
    const snackbar = useSnackbar()
    const [attempting, setAttempting] = useState(false)
    const [inToken, setInToken] = useState<any>(swapTokens[0])
    const [outToken, setOutToken] = useState<any>(swapTokens[1])
    const [isOpenSelectToken, setIsOpenSelectToken] = useState(false)

    const onInputChange = (val: any) => {
        if (!isApproved) {
            if (Number(val) !== NaN) setInputAmount(Number(val))
            else setInputAmount(0)
        }
    }

    const onOutputChange = (val: any) => {
        if (!isApproved) {
            if (Number(val) !== NaN) setOutputAmount(Number(val))
            else setOutputAmount(0)
        }
    }

    const onSelectToken = () => {
        setIsOpenSelectToken(true)
    }

    const revertSwapDir = () => {
        let out = outToken
        setOutToken(inToken)
        setInToken(out)
    }

    const onCloseSelectToken = () => {
        setIsOpenSelectToken(false)
    }

    return (
        <>            
            <div className="rounded-2xl bg-[#001926] p-4">
                <SelectTokenModal isOpen={isOpenSelectToken} handleClose={onCloseSelectToken} inToken={inToken} outToken={outToken} />
                <div className="flex flex-row justify-between mt-2 items-center">
                    <div className='text-white text-[18px] md:text-[24px]'>
                        OrbitSwap
                    </div>
                </div>
                <div className='w-full flex flex-col gap-4 mt-6'>
                    <SwapInput name={inToken?.symbol} value={inputAmount} balance={"0.00"} onChange={(val: any) => onInputChange(val)} logoURI={inToken?.logoURI} onSelectToken={onSelectToken} />
                    <div className='flex justify-between items-center'>
                        {/* <div className='basis-1/3'>
                        <div className='flex gap-2 items-center'>
                            <div className='flex flex-col items-center gap-1'>
                                <div className='flex justify-center'>
                                    <UpHeadIcon />
                                </div>
                                <span className='text-[14px] text-white'>Slippage 12%</span>
                                <div className='rotate-180 flex justify-center'>
                                    <UpHeadIcon />
                                </div>
                            </div>
                            <QuestionMark />
                        </div>
                    </div> */}
                        {/* <div className='basis-1/3 flex justify-center items-center'> */}
                        <div className='w-full flex justify-center items-center'>
                            <div className='rounded-full bg-[#867EE8] p-2 cursor-pointer hover:bg-[#908Ef8]' onClick={revertSwapDir}>
                                <SwapIcon />
                            </div>
                        </div>
                        {/* <div className='basis-1/3'>
                        <div className='flex gap-2 items-center'>
                            <div className='flex flex-col items-center gap-1'>
                                <div className='flex justify-center'>
                                    <UpHeadIcon />
                                </div>
                                <span className='text-[14px] text-white'>Standard Gwei</span>
                                <div className='rotate-180 flex justify-center'>
                                    <UpHeadIcon />
                                </div>
                            </div>
                            <QuestionMark />
                        </div>
                    </div> */}
                    </div>
                    <SwapOutput name={outToken?.symbol} value={outputAmount} balance={"0.00"} onChange={(val: any) => onOutputChange(val)} logoURI={outToken?.logoURI} onSelectToken={onSelectToken} />
                    <div className='flex gap-4 mt-2'>
                        <Button
                            variant="contained"
                            sx={{ width: "100%", borderRadius: "12px" }}
                        // onClick={}
                        // disabled={}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="contained"
                            sx={{ width: "100%", borderRadius: "12px" }}
                        // onClick={}
                        // disabled={!isApproved}
                        >
                            Deposit
                        </Button>
                    </div>
                </div>
                {attempting && !hash && (
                    <div className="flex justify-center items-center flex-col gap-12 h-[200px]">
                        <Fade in={true} style={{ transitionDelay: '800ms' }} unmountOnExit>
                            <CircularProgress />
                        </Fade>
                        <div>
                            {`Migrating `}
                        </div>
                    </div>
                )}
                {hash && (
                    <div className='w-full'>
                        <div className='w-full flex justify-center py-4'>
                            <TaskAltIcon sx={{ fontSize: 120, color: '#00aa00' }} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='text-[16px] text-[#aaaaaa] text-center'>Transaction submitted</div>
                            <div className='text-[16px] text-[#aaaaaa] text-center'>{'Hash: ' + hash.slice(0, 10) + '...' + hash.slice(56, 65)}</div>
                            {chainId && (
                                <a className='text-[16px] mt-4 text-[#aaaaee] underline text-center' target="_blank" href={getEtherscanLink(chainId, hash, 'transaction')}>
                                    {chainId && `View on ${CHAIN_LABELS[chainId]}`}
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}