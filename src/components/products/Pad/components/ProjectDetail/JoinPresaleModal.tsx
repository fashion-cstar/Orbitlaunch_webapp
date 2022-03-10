import React, { useMemo, useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button';
import Modal from '../Common/Modal';
import InputBox from '../Common/InputBox';
import FundTokenInput from '../Common/FundTokenInput'
import ProjectTokenInput from '../Common/ProjectTokenInput'
import { useEthers, ChainId } from "@usedapp/core";
import { useJoinPresaleCallback, usePadApproveCallback, uselaunchTokenDecimals, useToken, useNativeTokenBalance } from 'src/state/Pad/hooks'
import { AddressZero } from '@ethersproject/constants'
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from 'src/utils'
import { BUSDTokenAddress } from "@app/shared/PadConstant";
import { useDepositInfo, useTokenBalance } from 'src/state/Pad/hooks'
import { parseEther } from 'src/utils'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { getEtherscanLink, CHAIN_LABELS, getNativeSymbol } from 'src/utils'

interface PresaleModalProps {
    isOpen: boolean
    launchTokenPrice: number
    currentTierNo: number
    handleClose: () => void
    project: any
}

export default function JoinPresaleModal({ isOpen, launchTokenPrice, currentTierNo, handleClose, project }: PresaleModalProps) {
    const [hash, setHash] = useState<string | undefined>()
    const [attempting, setAttempting] = useState(false)
    const { library, account, chainId } = useEthers()
    const [fundTokenAmount, setFundTokenAmount] = useState(0)
    const [projectTokenAmount, setProjectTokenAmount] = useState(0)
    const { joinPresaleCallback } = useJoinPresaleCallback()
    const { padApproveCallback } = usePadApproveCallback()
    const [isApproved, setIsApproved] = useState(false)
    const [isDeposited, setDeposited] = useState(false)
    const [userMaxAllocation, setUserMaxAllocation] = useState(0)
    let userDepositedAmount = useDepositInfo(project.contractAddress, project.blockchain)
    const tokenDecimals = uselaunchTokenDecimals(project.contractAddress, project.blockchain)
    const userDepositToken = useToken(BUSDTokenAddress[chainId], project.blockchain)
    const userBUSDBalance = useTokenBalance(BUSDTokenAddress[chainId], project.blockchain)
    const nativeBalance = useNativeTokenBalance(project.blockchain)
    const [ethBalance, setEthBalance] = useState(0)
    const [fundDecimals, setFundDecimals] = useState(18)
    const [depositedAmount, setDepositedAmount] = useState(BigNumber.from(0))
    const [isOverMax, setIsOverMax] = useState(false)

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
        let max = currentTierNo ? Number(project[`tierAllocation${currentTierNo}`]) : 0
        if (max > 0) max = (max - formatEther(depositedAmount, fundDecimals, 5))
        if (max < 0) max = 0
        setUserMaxAllocation(max)
    }, [depositedAmount])

    useEffect(() => {
        if (tokenDecimals) {
            setFundDecimals(tokenDecimals.toNumber())
        }
    }, [tokenDecimals])
    async function onApprove() {
        try {
            padApproveCallback(project.contractAddress, BUSDTokenAddress[chainId], fundTokenAmount, project.blockchain).then((hash: string) => {
                setIsApproved(true)
            }).catch((error: any) => {
                console.log(error)
            })
        } catch (error) {
            console.log(error)
        }
        return null;
    }

    const successDeposited = () => {
        setDepositedAmount(depositedAmount.add(parseEther(fundTokenAmount, fundDecimals)))
    }

    async function onDeposit() {
        try {
            setAttempting(true)
            joinPresaleCallback(project.contractAddress, BUSDTokenAddress[chainId], fundTokenAmount, project.blockchain).then((hash: string) => {
                setHash(hash)
                successDeposited()
            }).catch(error => {
                setAttempting(false)
                console.log(error)
            })
        } catch (error) {
            setAttempting(false)
            console.log(error)
        }
        return null;
    }

    const onFundTokenChange = (val: any) => {
        if (!isApproved) {
            if (Number(val) !== NaN) setFundTokenAmount(Number(val))
            else setFundTokenAmount(0)
            if (launchTokenPrice) {
                setProjectTokenAmount(Number(val) / launchTokenPrice)
            }
            if (Number(val)>getDepositAvailable()){
                setIsOverMax(true)
            }else{
                setIsOverMax(false)
            }
        }
    }

    const onProjectTokenChange = (val: any) => {
        if (!isApproved) {
            if (Number(val) !== NaN) setProjectTokenAmount(Number(val))
            else setFundTokenAmount(0)
            if (launchTokenPrice) {
                setFundTokenAmount(Number(val) * launchTokenPrice)
            }
            if ((Number(val) * launchTokenPrice)>getDepositAvailable()){
                setIsOverMax(true)
            }else{
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

    const onclose = () => {
        setHash(undefined)
        setAttempting(false)
        setIsApproved(false)
        setDeposited(false)
        handleClose()
    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                header="Join Presale Now"
                handleClose={onclose}
            >
                <div className='m-4 md:m-6 w-[300px] md:w-[400px]'>
                    {!attempting && !hash && (
                        <div className='flex flex-col space-y-4 mt-6'>
                            <FundTokenInput onChange={(val: any) => onFundTokenChange(val)}
                                value={fundTokenAmount} name="BUSD" icon="./images/launchpad/TokenIcons/busd.svg" />
                            <ProjectTokenInput onChange={(val: any) => onProjectTokenChange(val)} onMax={onMax}
                                value={projectTokenAmount} name={project.projectSymbol} icon={project.projectIcon} />
                            <div className='text-white text-[14px] flex justify-between'>
                                <div>Max Allocation</div>
                                <div>${userMaxAllocation}</div>
                            </div>
                            <div className='text-white text-[14px] flex justify-between'>
                                <div>BUSD Balance</div>
                                <div>{`${formatEther(userBUSDBalance, fundDecimals, 2)} BUSD`}</div>
                            </div>
                            <div className='text-white text-[14px] flex justify-between'>
                                <div>Native Coin Balance</div>
                                <div>{`${ethBalance} ${getNativeSymbol(project.blockchain)}`}</div>
                            </div>
                            <div className='flex gap-4'>
                                <Button
                                    variant="contained"
                                    sx={{ width: "100%", borderRadius: "12px" }}
                                    onClick={onApprove}
                                    disabled={!account || !launchTokenPrice || isOverMax || ethBalance <= 0 || fundTokenAmount === 0}
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
                                {/* <Button
                                    variant="contained"
                                    sx={{ width: "100%", borderRadius: "12px" }}
                                    onClick={onApprove}
                                    disabled={true}
                                >
                                    Reserve Your Tokens Now
                                </Button> */}
                            </div>
                        </div>
                    )}
                    {attempting && !hash && (
                        <div className="flex justify-center items-center flex-col gap-12 h-[200px]">
                            <Fade in={true} style={{ transitionDelay: '800ms' }} unmountOnExit>
                                <CircularProgress />
                            </Fade>
                            <div>
                                {`Depositing ${fundTokenAmount} ${userDepositToken?.symbol}`}
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
                                    <a className='text-[16px] mt-4 text-[#aaaaee] underline text-center' href={getEtherscanLink(chainId, hash, 'transaction')}>
                                        {chainId && `View on ${CHAIN_LABELS[chainId]}`}
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
