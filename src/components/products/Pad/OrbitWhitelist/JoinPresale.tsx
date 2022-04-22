import React, { useMemo, useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button'
import FundTokenInput from '../components/Common/FundTokenInput'
import ProjectTokenInput from '../components/Common/ProjectTokenInput'
import { useEthers, ChainId } from "@usedapp/core"
import {
    useJoinPresaleCallback,
    usePadApproveCallback,
    useTotalInvestedAmount,
    useInvestCap,
    useDepositInfo
} from 'src/state/Pad/orbit_hooks'
import { useToken, useNativeTokenBalance, useTokenAllowance, useTokenBalance, useTokenBalanceCallback } from 'src/state/hooks'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade'
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from 'src/utils'
import { BUSDTokenAddress } from "@app/shared/PadConstant";
import { parseEther } from 'src/utils'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { getEtherscanLink, CHAIN_LABELS, getNativeSymbol, PROJECT_STATUS } from 'src/utils'
import { useSnackbar } from "@app/lib/hooks/useSnackbar"

const gradientColor = {
    backgroundImage: 'linear-gradient(165deg, #161f35 -10%, #06111c 30%)'
}

interface PresaleModalProps {
    launchTokenPrice: number
    currentTierNo: number
    project: any
    projectStatus: number
}

export default function OrbitJoinPresale({ launchTokenPrice, currentTierNo, project, projectStatus }: PresaleModalProps) {
    const [hash, setHash] = useState<string | undefined>()
    const snackbar = useSnackbar()
    const [attempting, setAttempting] = useState(false)
    const { library, account, chainId } = useEthers()
    const [fundTokenAmount, setFundTokenAmount] = useState(0)
    const [projectTokenAmount, setProjectTokenAmount] = useState(0)
    const { joinPresaleCallback } = useJoinPresaleCallback()
    const { padApproveCallback } = usePadApproveCallback()
    const [isApproved, setIsApproved] = useState(false)
    const [isDeposited, setDeposited] = useState(false)
    const [userMaxAllocation, setUserMaxAllocation] = useState(0)
    const userDepositedAmount = useDepositInfo(project.contractAddress, project.blockchain)
    const userDepositToken = useToken(BUSDTokenAddress[chainId], project.blockchain)
    const { tokenBalanceCallback } = useTokenBalanceCallback()
    const accountBUSDBalance = useTokenBalance(BUSDTokenAddress[chainId], project.blockchain)
    const [userBUSDBalance, setUserBUSDBalance] = useState<BigNumber>(BigNumber.from(0))
    const nativeBalance = useNativeTokenBalance(project.blockchain)
    const [ethBalance, setEthBalance] = useState(0)
    const [fundDecimals, setFundDecimals] = useState(18)
    const [depositedAmount, setDepositedAmount] = useState(BigNumber.from(0))
    const [isOverMax, setIsOverMax] = useState(false)
    const { tokenAllowanceCallback } = useTokenAllowance()
    const [isWalletApproving, setIsWalletApproving] = useState(false)
    const totalInvestedAmount = useTotalInvestedAmount(project.contractAddress, project.blockchain)
    const investCap = useInvestCap(project.contractAddress, project.blockchain)

    useEffect(() => {
        if (nativeBalance) {
            setEthBalance(formatEther(nativeBalance, 18, 5))
        }
    }, [nativeBalance])

    useEffect(() => {
        if (account) {
            callUserBUSDCallback()
        } else {
            setUserBUSDBalance(BigNumber.from(0))
        }
    }, [account])

    useEffect(() => {
        if (accountBUSDBalance) {
            setUserBUSDBalance(accountBUSDBalance)
        }
    }, [accountBUSDBalance])

    useEffect(() => {
        if (userDepositedAmount) {            
            setDepositedAmount(userDepositedAmount)
        }
    }, [userDepositedAmount])

    useEffect(() => {
        // let max = currentTierNo ? Number(project[`tierAllocation${currentTierNo}`]) : 0
        let max = 10000000000
        if (max > 0) max = (max - formatEther(depositedAmount, fundDecimals, 5))
        if (max < 0) max = 0
        if (investCap.gt(BigNumber.from(0))) {
            let temp: BigNumber = investCap.sub(totalInvestedAmount)
            let restCap = formatEther(temp, fundDecimals, 5)            
            if (max > restCap) max = restCap
        }
        if (max < 0) max = 0        
        setUserMaxAllocation(max)
    }, [depositedAmount, fundDecimals, investCap, totalInvestedAmount])

    useEffect(() => {
        try {
            if (userDepositToken) {
                if (userDepositToken?.decimals) setFundDecimals(userDepositToken?.decimals)
            }
        } catch (error) { }
    }, [userDepositToken])

    const callUserBUSDCallback = () => {
        try {
            tokenBalanceCallback(BUSDTokenAddress[chainId], project.blockchain).then((res: BigNumber) => {
                setUserBUSDBalance(res)
            }).catch((error: any) => {
                console.log(error)
            })
        } catch (error) {
            console.debug('Failed to get BUSD balance', error)
        }
    }
    async function onApprove() {
        setIsWalletApproving(true)
        try {
            padApproveCallback(project.contractAddress, BUSDTokenAddress[chainId], Math.round(fundTokenAmount + 1), project.blockchain).then((hash: string) => {
                setIsApproved(true)
                setIsWalletApproving(false)
            }).catch((error: any) => {
                setIsWalletApproving(false)
                console.log(error)
                let err: any = error
                if (err?.message) snackbar.snackbar.show(err?.message, "error")
                if (err?.error) {
                    if (err?.error?.message) snackbar.snackbar.show(err?.error?.message, "error");
                }
            })
        } catch (error) {
            setIsWalletApproving(false)
            console.log(error)
        }
        return null;
    }

    const successDeposited = () => {
        setDepositedAmount(depositedAmount.add(parseEther(fundTokenAmount, fundDecimals)))
        callUserBUSDCallback()
    }

    async function onDeposit() {
        setAttempting(true)
        let res = await tokenAllowanceCallback(account, project.contractAddress, BUSDTokenAddress[chainId], project.blockchain)
        if (res) {
            try {
                if (res.gte(parseEther(fundTokenAmount, fundDecimals))) {
                    console.log(res)
                    try {
                        joinPresaleCallback(project.contractAddress, BUSDTokenAddress[chainId], fundTokenAmount, project.blockchain).then((hash: string) => {
                            setHash(hash)
                            successDeposited()
                        }).catch(error => {
                            setAttempting(false)
                            console.log(error)
                            let err: any = error
                            if (err?.message) snackbar.snackbar.show(err?.message, "error")
                            if (err?.error) {
                                if (err?.error?.message) snackbar.snackbar.show(err?.error?.message, "error");
                            }
                        })
                    } catch (error) {
                        setAttempting(false)
                        console.log(error)
                    }
                    return true
                } else {
                    onDeposit()
                }
            } catch (ex) {
                onDeposit()
            }
        }

        return null;
    }

    const onFundTokenChange = (val: any) => {
        if (!isApproved) {
            if (Number(val) !== NaN) setFundTokenAmount(Number(val))
            else setFundTokenAmount(0)
            if (launchTokenPrice) {
                setProjectTokenAmount(Math.round(Number(val) / launchTokenPrice * 1000) / 1000)
            }
            if (Number(val) > getDepositAvailable()) {
                setIsOverMax(true)
            } else {
                setIsOverMax(false)
            }
        }
    }

    const onProjectTokenChange = (val: any) => {
        if (!isApproved) {
            if (Number(val) !== NaN) setProjectTokenAmount(Number(val))
            else setFundTokenAmount(0)
            if (launchTokenPrice) {
                setFundTokenAmount(Math.round(Number(val) * launchTokenPrice * 100) / 100)
            }
            if ((Number(val) * launchTokenPrice) > getDepositAvailable()) {
                setIsOverMax(true)
            } else {
                setIsOverMax(false)
            }
        }
    }

    const getDepositAvailable = () => {
        let max = formatEther(userBUSDBalance, fundDecimals, 5) > userMaxAllocation ? userMaxAllocation : formatEther(userBUSDBalance, fundDecimals, 2)
        return max
    }

    const onMax = () => {
        let max = getDepositAvailable()
        setFundTokenAmount(max)
        if (launchTokenPrice) {
            setProjectTokenAmount(max / launchTokenPrice)
        }
    }

    const getAvailableSupply = () => {
        if (investCap && totalInvestedAmount) {
            if (investCap.gt(BigNumber.from(0))) {
                let temp: BigNumber = investCap.sub(totalInvestedAmount)
                let res: number = 0
                temp = temp.mul(BigNumber.from(10000)).div(investCap)
                if (temp.lte(BigNumber.from(10000))) res = temp.toNumber() / 100
                return res + '%'
            }
        }
        return ''
    }

    const getAllowedLaunchTokens = () => {
        let res: string
        if (launchTokenPrice) {
            return Math.round(userMaxAllocation / launchTokenPrice) + ' ' + project.projectSymbol
        } else {
            return '0 ' + project.projectSymbol
        }
    }

    const getUserPurchasedLaunchTokens = () => {
        if (launchTokenPrice) {
            return Math.round(formatEther(depositedAmount, fundDecimals, 5) / launchTokenPrice) + ' ' + project.projectSymbol
        } else {
            return '0 ' + project.projectSymbol
        }
    }

    return (
        <div className="px-4 w-full w-auto h-full md:h-auto mt-8">
            <div className={`p-3 rounded-2xl shadow dark:bg-gray-700`} style={gradientColor}>
                <div className="flex flex-row justify-between mt-2">
                    <div className='text-white text-[24px] md:text-[32px] ml-6'>
                        Join Presale Now
                    </div>
                </div>
                <div className='m-4 md:m-6 w-[300px] md:w-[400px]'>
                    {!attempting && !hash && (
                        <div className='flex flex-col space-y-4 mt-6'>
                            <FundTokenInput onChange={(val: any) => onFundTokenChange(val)}
                                value={fundTokenAmount} name="BUSD" icon="./images/launchpad/TokenIcons/busd.svg" />
                            <ProjectTokenInput onChange={(val: any) => onProjectTokenChange(val)} onMax={onMax}
                                value={projectTokenAmount} name={project.projectSymbol} icon={project.projectIcon} />
                            {/* <div className='text-white text-[14px] flex justify-between'>
                                <div>Max Allocation Allowed</div>
                                <div className='text-right'>{`$${userMaxAllocation} / ${getAllowedLaunchTokens()}`}</div>
                            </div> */}
                            <div className='text-white text-[14px] flex justify-between'>
                                <div>Tokens Purchased</div>
                                <div className='text-right'>{`$${formatEther(depositedAmount, fundDecimals, 2)} / ${getUserPurchasedLaunchTokens()}`}</div>
                            </div>
                            <div className='text-white text-[14px] flex justify-between'>
                                <div>Current Available Supply</div>
                                <div className='text-right'>{`${getAvailableSupply()} ${project.projectSymbol} For Purchase `}</div>
                            </div>
                            <div className='text-white text-[14px] flex justify-between'>
                                <div>BUSD Balance</div>
                                <div className='text-right'>{`${formatEther(userBUSDBalance, fundDecimals, 2)} BUSD`}</div>
                            </div>
                            <div className='text-white text-[14px] flex justify-between'>
                                <div>Native Coin Balance</div>
                                <div className='text-right'>{`${ethBalance} ${getNativeSymbol(project.blockchain)}`}</div>
                            </div>
                            <div className='flex gap-4'>
                                <Button
                                    variant="contained"
                                    sx={{ width: "100%", borderRadius: "12px" }}
                                    onClick={onApprove}
                                    disabled={!account || !launchTokenPrice || isOverMax || ethBalance <= 0 || fundTokenAmount === 0 || isApproved || isWalletApproving || !(projectStatus === PROJECT_STATUS.PresaleOpen || projectStatus === PROJECT_STATUS.PublicPresaleOpen)}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={{ width: "100%", borderRadius: "12px" }}
                                    onClick={onDeposit}
                                    disabled={!isApproved}
                                >
                                    Deposit
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
                                {`Depositing ${fundTokenAmount} ${userDepositToken?.symbol ?? ''}`}
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
