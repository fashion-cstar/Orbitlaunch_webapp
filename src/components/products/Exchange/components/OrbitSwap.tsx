import React, { useMemo, useState, useEffect, useRef } from 'react'
import SwapInput from '@app/components/common/SwapInput'
import SwapOutput from '@app/components/common/SwapOutput'
import SwapIcon from '../svgs/SwapIcon'
import { useEthers } from "@usedapp/core";
import { getEtherscanLink, CHAIN_LABELS, formatEther, isNativeCoin, getNativeSymbol, parseEther } from 'src/utils'
import swapTokens from '@app/shared/SwapTokens'
import SelectTokenModal from './SelectTokenModal'
import { useNativeTokenBalance, useTokenBalanceCallback } from 'src/state/hooks'
import { BigNumber } from 'ethers'
import SwapActions from './SwapActions'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { useSwapCallback } from '@app/state/exchange';
import { SwapContractAddress } from '@app/shared/AppConstant';
import { debounce } from 'lodash';

export default function OrbitSwap() {
    const { library, account, chainId } = useEthers()
    const [inputAmount, setInputAmount] = useState(0)
    const [outputAmount, setOutputAmount] = useState(0)
    const [inToken, setInToken] = useState<any>(swapTokens[0])
    const [outToken, setOutToken] = useState<any>(swapTokens[1])
    const [isOpenSelectToken, setIsOpenSelectToken] = useState(false)
    const [isInToken, setIsInToken] = useState(true)
    const { tokenBalanceCallback, nativeBalanceCallback } = useTokenBalanceCallback()
    const [inTokenBalance, setInTokenBalance] = useState(BigNumber.from(0))
    const [outTokenBalance, setOutTokenBalance] = useState(BigNumber.from(0))
    const [isLoadingInBalance, setIsLoadingInBalance] = useState(false)
    const [isLoadingOutBalance, setIsLoadingOutBalance] = useState(false)
    const [hash, setHash] = useState('')
    const [ethBalance, setEthBalance] = useState(0)
    const nativeBalance = useNativeTokenBalance('bsc')
    const [estimatedGas, setEstimatedGas] = useState('--')
    const { estimatedGasForSwap } = useSwapCallback()
    const [isEstimatingGas, setIsEstimatingGas] = useState(false)
    const [isApproved, setIsApproved] = useState(false)

    useEffect(() => {
        if (inToken) {
            callInTokenBalanceCallback()
        }
    }, [inToken, account])

    useEffect(() => {
        if (outToken) {
            callOutTokenBalanceCallback()
        }
    }, [outToken, account])

    useEffect(() => {
        if (nativeBalance) {
            setEthBalance(formatEther(nativeBalance, 18, 5))
        }
    }, [nativeBalance])

    useEffect(() => {
        calcEstimatedGasForSwap()
    }, [inToken, outToken, account, inputAmount, isApproved])

    const calcEstimatedGasForSwap = useRef(
        debounce(async () => {
            setIsEstimatingGas(true)
        }, 100)
    ).current;

    useEffect(() => {
        const fetch = async () => {
            await callEstimatedGasCallback()
            setIsEstimatingGas(false)
        }
        if (isEstimatingGas) {
            fetch()
        }
    }, [isEstimatingGas])

    const callEstimatedGasCallback = async () => {
        try {
            let res = await estimatedGasForSwap(SwapContractAddress, inToken, outToken, parseEther(inputAmount, inToken?.decimals ?? 18), account, 'bsc')            
            if (res) setEstimatedGas(formatEther(res, 18, 5).toString())
            else setEstimatedGas('--')
        } catch (error) {
            setEstimatedGas('--')
            console.debug('Failed to get balance', error)
        }
    }

    const callNativeBalanceCallback = async () => {
        try {
            let res = await nativeBalanceCallback('bsc')
            setEthBalance(formatEther(res, 18, 5))
        } catch (error) {
            setEthBalance(0)
            console.debug('Failed to get balance', error)
        }
    }

    const callInTokenBalanceCallback = async () => {
        setIsLoadingInBalance(true)
        try {
            let res = BigNumber.from(0)
            if (isNativeCoin('bsc', inToken?.symbol)) {
                res = await nativeBalanceCallback('bsc')
            } else {
                res = await tokenBalanceCallback(inToken?.address, 'bsc')
            }
            setInTokenBalance(res)
        } catch (error) {
            setInTokenBalance(BigNumber.from(0))
            console.debug('Failed to get balance', error)
        }
        setIsLoadingInBalance(false)
    }

    const callOutTokenBalanceCallback = async () => {
        setIsLoadingOutBalance(true)
        try {
            let res = BigNumber.from(0)
            if (outToken?.symbol.toLowerCase().indexOf('bnb') > 0) {
                res = await nativeBalanceCallback('bsc')
            } else {
                res = await tokenBalanceCallback(outToken?.address, 'bsc')
            }
            setOutTokenBalance(res)
        } catch (error) {
            setOutTokenBalance(BigNumber.from(0))
            console.debug('Failed to get balance', error)
        }
        setIsLoadingOutBalance(false)
    }

    const onInputChange = (val: any) => {
        if (Number(val) !== NaN) setInputAmount(Number(val))
        else setInputAmount(0)
    }

    const onOutputChange = (val: any) => {
        if (Number(val) !== NaN) setOutputAmount(Number(val))
        else setOutputAmount(0)
    }

    const onOpenSelectModal = (isIn: boolean) => {
        setIsInToken(isIn)
        setIsOpenSelectToken(true)
    }

    const revertSwapDir = () => {
        let out = outToken
        setOutToken(inToken)
        setInToken(out)
        setInputAmount(0)
        setOutputAmount(0)
    }

    const onCloseSelectToken = () => {
        setIsOpenSelectToken(false)
    }

    const onSelectToken = (token: any, isInToken: boolean) => {
        if (isInToken) setInToken(token)
        else setOutToken(token)
        setIsOpenSelectToken(false)
    }

    const setSwapSuccess = (hash: string) => {
        setHash(hash)
        setInputAmount(0)
        callNativeBalanceCallback()
        callInTokenBalanceCallback()
        callOutTokenBalanceCallback()
    }

    return (
        <>
            <div className="rounded-2xl bg-[#001926] p-4">
                {!hash && (<>
                    <SelectTokenModal isOpen={isOpenSelectToken} handleClose={onCloseSelectToken} inToken={inToken} outToken={outToken} isInToken={isInToken} onSelectToken={(token: any, isInToken: boolean) => onSelectToken(token, isInToken)} />
                    <div className="flex flex-row justify-between mt-2 items-center">
                        <div className='text-white text-[18px] md:text-[24px]'>
                            OrbitSwap
                        </div>
                    </div>
                    <div className='w-full flex flex-col gap-4 mt-6'>
                        <SwapInput value={inputAmount} name={inToken?.symbol} balance={isLoadingInBalance ? "--" : formatEther(inTokenBalance, inToken?.decimals, 3).toString()} onChange={(val: any) => onInputChange(val)} logoURI={inToken?.logoURI} onOpenSelectModal={() => onOpenSelectModal(true)} />
                        <div className='flex justify-between items-center'>
                            <div className='w-full flex justify-center items-center'>
                                <div className='rounded-full bg-[#867EE8] p-2 cursor-pointer hover:bg-[#908Ef8]' onClick={revertSwapDir}>
                                    <SwapIcon />
                                </div>
                            </div>
                        </div>
                        <SwapOutput value={outputAmount} name={outToken?.symbol} balance={isLoadingOutBalance ? "--" : formatEther(outTokenBalance, outToken?.decimals, 3).toString()} onChange={(val: any) => onOutputChange(val)} logoURI={outToken?.logoURI} onOpenSelectModal={() => onOpenSelectModal(false)} />
                        <div className='text-white text-[14px] flex justify-between mx-1'>
                            <div>Native Coin Balance</div>
                            <div className='text-right'>{`${ethBalance} ${getNativeSymbol('bsc')}`}</div>
                        </div>
                        {isApproved && (<div className='text-white text-[14px] flex justify-between mx-1'>
                            <div>Estimated Gas</div>
                            <div className='text-right'>{`${estimatedGas} ${getNativeSymbol('bsc')}`}</div>
                        </div>)}
                        <div className='flex gap-4 mt-2'>
                            <SwapActions
                                inputAmount={inputAmount}
                                inToken={inToken}
                                outToken={outToken}
                                inTokenBalance={inTokenBalance}
                                isApproved={isApproved}
                                setSwapSuccess={setSwapSuccess}
                                setIsApproved={setIsApproved}
                            />
                        </div>
                    </div>
                </>)}
                {hash && (
                    <div className='w-full'>
                        <div className='w-full flex justify-center pb-4 pt-8'>
                            <TaskAltIcon sx={{ fontSize: 120, color: '#00aa00' }} />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <div className='text-[16px] text-[#aaaaaa] text-center'>Swap confirmed!</div>
                            <div className='text-[16px] text-[#aaaaaa] text-center'>{'Hash: ' + hash.slice(0, 10) + '...' + hash.slice(56, 65)}</div>
                            {chainId && (
                                <a className='text-[16px] mt-4 text-[#aaaaee] underline text-center' target="_blank" href={getEtherscanLink(chainId, hash, 'transaction')}>
                                    {chainId && `View on ${CHAIN_LABELS[chainId]}`}
                                </a>
                            )}
                        </div>
                        <div className='w-full text-center text-white text-[14px] font-thin cursor-pointer my-8 underline' onClick={() => setHash('')} >
                            {"Back to swap"}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}