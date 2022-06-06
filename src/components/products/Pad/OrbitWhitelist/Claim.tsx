import React, { useMemo, useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button';
import { useEthers, ChainId } from "@usedapp/core"
import {
    useClaimCallback,
    useGetAvailableTokens,
    uselaunchTokenDecimals,
    useDepositInfo
} from 'src/state/Pad/orbit_hooks'
import { useToken, useNativeTokenBalance } from 'src/state/hooks'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade';
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from 'src/utils'
import { BUSDTokenAddress } from "@app/shared/PadConstant";
import { parseEther } from 'src/utils'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { getEtherscanLink, CHAIN_LABELS, getNativeSymbol } from 'src/utils'
import { useSnackbar } from "@app/lib/hooks/useSnackbar"

interface ClaimModalProps {
    launchTokenPrice: number
    project: any
}

const gradientColor = {
    backgroundImage: 'linear-gradient(165deg, #161f35 -10%, #06111c 30%)'
}

export default function OrbitClaim({ launchTokenPrice, project }: ClaimModalProps) {
    const [hash, setHash] = useState<string | undefined>()
    const snackbar = useSnackbar()
    const [attempting, setAttempting] = useState(false)
    const { library, account, chainId } = useEthers()
    const userDepositedAmount = useDepositInfo(project.contractAddress, project.blockchain)
    const availableTokens = useGetAvailableTokens(project.contractAddress, project.blockchain)
    const [amountToClaim, setAmountToClaim] = useState(BigNumber.from(0))
    const { claimCallback } = useClaimCallback()
    const nativeBalance = useNativeTokenBalance(project.blockchain)
    const userDepositToken = useToken(BUSDTokenAddress[chainId], project.blockchain)
    const [ethBalance, setEthBalance] = useState(0)
    const [fundDecimals, setFundDecimals] = useState(18)
    const [depositedAmount, setDepositedAmount] = useState(BigNumber.from(0))
    const [launchTokenDecimals, setLaunchTokenDecimals] = useState(18)
    const launchDecimals = uselaunchTokenDecimals(project.blockchain)

    useEffect(() => {
        if (launchDecimals) {            
            if (launchDecimals.gt(0)) setLaunchTokenDecimals(launchDecimals.toNumber())
        }
    }, [launchDecimals])
    useEffect(() => {
        if (nativeBalance) {
            setEthBalance(formatEther(nativeBalance, 18, 5))
        }
    }, [nativeBalance])

    useEffect(() => {
        if (userDepositedAmount) {
            setDepositedAmount(userDepositedAmount)
        }
    }, [userDepositedAmount])

    useEffect(() => {
        try {
            if (userDepositToken) {
                if (userDepositToken?.decimals) setFundDecimals(userDepositToken?.decimals)
            }
        } catch (error) { }
    }, [userDepositToken])

    useEffect(() => {
        if (availableTokens) {
            setAmountToClaim(availableTokens)
        }
    }, [availableTokens])

    const successClaimed = () => {
        setAmountToClaim(BigNumber.from(0))
    }

    async function onClaim() {
        setAttempting(true)

        try {
            claimCallback(project.contractAddress, project.blockchain).then((hash: string) => {
                setHash(hash)
                successClaimed()
            }).catch(error => {
                setAttempting(false)
                console.log(error)
                let err: any = error
                snackbar.snackbar.show((err.data?.message || err?.message || err).toString(), "error") 
            })
        } catch (error) {
            setAttempting(false)
            console.log(error)
        }

        return null;
    }

    const getUserPurchasedLaunchTokens = () => {
        if (launchTokenPrice) {
            return Math.round(formatEther(depositedAmount, fundDecimals, 5) / launchTokenPrice) + ' ' + project.projectSymbol
        } else {
            return '0 ' + project.projectSymbol
        }
    }

    return (
        <div>
            <div className={`p-3 rounded-2xl shadow dark:bg-gray-700`} style={gradientColor}>
                <div className="flex flex-row justify-between mt-2">
                    <div className='text-white text-[24px] md:text-[32px] ml-6'>
                        Claim Tokens
                    </div>                   
                </div>
                <div className='m-4 md:m-6 w-[300px] md:w-[400px]'>
                    {!attempting && !hash && (
                        <div className='flex flex-col space-y-4 mt-6'>
                            <div className='text-white text-[18px] flex flex-col justify-center items-center gap-4'>
                                <div>Available To Claim</div>
                                <div>{`${amountToClaim ? formatEther(amountToClaim, launchTokenDecimals, 2) : 0} ${project.projectSymbol}`}</div>
                            </div>
                            <div className='text-white text-[14px] flex justify-between'>
                                <div>Tokens Purchased</div>
                                <div className='text-right'>{`$${formatEther(depositedAmount, fundDecimals, 2)} / ${getUserPurchasedLaunchTokens()}`}</div>
                            </div>
                            <div className='text-white text-[14px] flex justify-between'>
                                <div>Native Coin Balance</div>
                                <div className='text-right'>{`${ethBalance} ${getNativeSymbol(project.blockchain)}`}</div>
                            </div>
                            <div className='flex gap-4'>
                                <Button
                                    variant="contained"
                                    sx={{ width: "100%", borderRadius: "12px" }}
                                    onClick={onClaim}
                                    disabled={!amountToClaim || amountToClaim.lte(0)}
                                >
                                    Claim Tokens
                                </Button>
                            </div>
                        </div>
                    )}
                    {attempting && !hash && (
                        <div className="flex justify-center items-center flex-col gap-12 h-[200px]">
                            <Fade in={true} style={{ transitionDelay: '800ms' }} unmountOnExit>
                                <CircularProgress />
                            </Fade>
                            <div>
                                {`Claiming ${formatEther(amountToClaim, launchTokenDecimals, 2)} ${project.projectSymbol}`}
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
            </div>
        </div>
    );
}
