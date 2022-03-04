import React, { useMemo, useState, useEffect, useRef } from 'react'
import Button from '@mui/material/Button';
import Modal from '../Common/Modal';
import InputBox from '../Common/InputBox';
import FundTokenInput from '../Common/FundTokenInput'
import ProjectTokenInput from '../Common/ProjectTokenInput'
import { useEthers, useToken, ChainId } from "@usedapp/core";
import { useJoinPresaleCallback, usePadApproveCallback } from 'src/state/Pad/hooks'
import { AddressZero } from '@ethersproject/constants'
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from 'src/utils'
import { BUSDTokenAddress } from "@app/shared/PadConstant";
import { useDepositInfo, useTokenBalance } from 'src/state/Pad/hooks'
import { parseEther } from 'src/utils'

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
    let userDepositedAmount = useDepositInfo(project.contractAddress)
    const userBUSDBalance = useTokenBalance(BUSDTokenAddress[chainId])

    useEffect(() => {
        let max = currentTierNo ? Number(project[`tierAllocation${currentTierNo}`]) : 0
        if (max > 0) max = (max - formatEther(userDepositedAmount, 18, 5))
        if (max < 0) max = 0
        setUserMaxAllocation(max)
    }, [userDepositedAmount])

    async function onApprove() {
        try {
            padApproveCallback(project.contractAddress, BUSDTokenAddress[chainId], fundTokenAmount).then((hash: string) => {
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
        userDepositedAmount = userDepositedAmount.add(parseEther(fundTokenAmount, 18))
    }

    async function onDeposit() {
        try {
            setAttempting(true)
            joinPresaleCallback(project.contractAddress, BUSDTokenAddress[chainId], fundTokenAmount).then((hash: string) => {
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
        if (Number(val) !== NaN) setFundTokenAmount(Number(val))
        else setFundTokenAmount(0)
        if (launchTokenPrice) {
            setProjectTokenAmount(Number(val) / launchTokenPrice)
        }
    }

    const onProjectTokenChange = (val: any) => {
        if (Number(val) !== NaN) setProjectTokenAmount(Number(val))
        else setFundTokenAmount(0)
        if (launchTokenPrice) {
            setFundTokenAmount(Number(val) * launchTokenPrice)
        }
    }

    const getDepositAvailable = () => {
        let max = formatEther(userBUSDBalance, 18, 5) > userMaxAllocation ? userMaxAllocation : formatEther(userBUSDBalance, 18, 2)
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
                {!attempting && !hash && (<div className='m-4 md:m-6 w-[300px] md:w-[400px]'>
                    {/* <div className='text-white text-[32px] mt-6'>
                        Join Presale Now
                    </div> */}
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
                            <div>{`${formatEther(userBUSDBalance, 18, 2)} BUSD`}</div>
                        </div>
                        <div className='flex gap-4'>
                            {/* <Button
                                variant="contained"
                                sx={{ width: "100%", borderRadius: "12px" }}
                                onClick={onApprove}
                                disabled={!account || !launchTokenPrice || !getDepositAvailable()}
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
                            </Button> */}
                            <Button
                                variant="contained"
                                sx={{ width: "100%", borderRadius: "12px" }}
                                onClick={onApprove}
                                disabled={true}
                            >
                                Reserve Your Tokens Now
                            </Button>
                        </div>
                    </div>
                </div>)}
                {attempting && !hash && (
                    <div className="flex justify-center items-center h-[300px]">
                        <Fade in={true} style={{ transitionDelay: '800ms' }} unmountOnExit>
                            <CircularProgress />
                        </Fade>
                    </div>
                )}
                {hash && (
                    <div className='flex flex-col gap-8'>
                        <div className='text-white text-[14px]'>
                            {hash}
                        </div>
                        <div className='text-white text-[14px]'>
                            Deposited {fundTokenAmount}{' '}{project.projectSymbol}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
