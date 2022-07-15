import React, { useMemo, useState, useEffect, useRef } from 'react'
import SwapInput from '@app/components/common/SwapInput'
import SwapOutput from '@app/components/common/SwapOutput'
import SwapIcon from '../svgs/SwapIcon'
import { useEthers } from "@usedapp/core";
import { getEtherscanLink, CHAIN_LABELS, formatEther, isNativeCoin } from 'src/utils'
import swapTokens from '@app/shared/SwapTokens'
import SelectTokenModal from './SelectTokenModal'
import { useTokenBalanceCallback } from 'src/state/hooks'
import { BigNumber } from 'ethers'
import SwapActions from './SwapActions'

export default function OrbitSwap() {
    const { library, account, chainId } = useEthers()
    const [inputAmount, setInputAmount] = useState(0)
    const [outputAmount, setOutputAmount] = useState(0)
    const [isApproved, setIsApproved] = useState(false)    
    const [inToken, setInToken] = useState<any>(swapTokens[0])
    const [outToken, setOutToken] = useState<any>(swapTokens[1])
    const [isOpenSelectToken, setIsOpenSelectToken] = useState(false)
    const [isInToken, setIsInToken] = useState(true)
    const { tokenBalanceCallback, nativeBalanceCallback } = useTokenBalanceCallback()
    const [inTokenBalance, setInTokenBalance] = useState(BigNumber.from(0))
    const [outTokenBalance, setOutTokenBalance] = useState(BigNumber.from(0))
    const [isLoadingInBalance, setIsLoadingInBalance] = useState(false)
    const [isLoadingOutBalance, setIsLoadingOutBalance] = useState(false)


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

    const onOpenSelectModal = (isIn: boolean) => {
        setIsInToken(isIn)
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

    const onSelectToken = (token: any, isInToken: boolean) => {
        if (isInToken) setInToken(token)
        else setOutToken(token)
        setIsOpenSelectToken(false)
    }

    return (
        <>
            <div className="rounded-2xl bg-[#001926] p-4">
                <SelectTokenModal isOpen={isOpenSelectToken} handleClose={onCloseSelectToken} inToken={inToken} outToken={outToken} isInToken={isInToken} onSelectToken={(token: any, isInToken: boolean) => onSelectToken(token, isInToken)} />
                <div className="flex flex-row justify-between mt-2 items-center">
                    <div className='text-white text-[18px] md:text-[24px]'>
                        OrbitSwap
                    </div>
                </div>
                <div className='w-full flex flex-col gap-4 mt-6'>
                    <SwapInput name={inToken?.symbol} value={inputAmount} balance={isLoadingInBalance ? "--" : formatEther(inTokenBalance, inToken?.decimals, 2).toString()} onChange={(val: any) => onInputChange(val)} logoURI={inToken?.logoURI} onOpenSelectModal={() => onOpenSelectModal(true)} />
                    <div className='flex justify-between items-center'>
                        <div className='w-full flex justify-center items-center'>
                            <div className='rounded-full bg-[#867EE8] p-2 cursor-pointer hover:bg-[#908Ef8]' onClick={revertSwapDir}>
                                <SwapIcon />
                            </div>
                        </div>
                    </div>
                    <SwapOutput name={outToken?.symbol} value={outputAmount} balance={isLoadingOutBalance ? "--" : formatEther(outTokenBalance, outToken?.decimals, 2).toString()} onChange={(val: any) => onOutputChange(val)} logoURI={outToken?.logoURI} onOpenSelectModal={() => onOpenSelectModal(false)} />
                    <div className='flex gap-4 mt-2'>
                        <SwapActions inputAmount={inputAmount} inToken={inToken} outToken={outToken} />
                    </div>
                </div>                
            </div>
        </>
    )
}