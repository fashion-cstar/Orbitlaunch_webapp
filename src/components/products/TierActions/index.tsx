import React, { useMemo, useState, useEffect } from 'react'
import { Button } from "@mui/material"
import { useEthers } from "@usedapp/core"
import Modal from './components/Modal'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useToken, useTokenBalanceCallback } from 'src/state/hooks'
import { useTierAndUnlockTime } from 'src/state/LockActions'
import { useRouter } from 'next/router'
import {
    OrbtTokenAddress,
    TierTokenLockContractAddress
} from "@app/shared/AppConstant"
import { BigNumber } from '@ethersproject/bignumber';
import { tierInformation } from 'src/shared/TierLevels'
import { getTierValues } from '@app/shared/TierLevels'
import { formatEther, parseEther } from '@app/utils'
import BuyButton from "src/components/common/BuyButton"
import TierSelectBox from "./components/TierSelectBox"
import LockDaysSelector from "./components/LockDaysSelector"
import ClaimTierAction from './components/ClaimTierAction';
import UnlockTierAction from './components/UnlockTierAction';

interface TierModalProps {
    isOpen: boolean
    handleClose: () => void
}

export default function TierActionsModal({ isOpen, handleClose }: TierModalProps) {
    // const ORBIT_TOKEN = OrbtTokenAddress
    const ORBIT_TOKEN = "0x8401e6e7ba1a1ec011bdf34cd59fb11545fae523"
    const { library, account, chainId } = useEthers()
    const router = useRouter()    
    const [hash, setHash] = useState<string | undefined>()
    const [selectedTier, setSelectTier] = useState('')
    const userOrbitToken = useToken(ORBIT_TOKEN, 'bsc')
    const { tokenBalanceCallback } = useTokenBalanceCallback()
    const [userOrbitBalance, setUserOrbitBalance] = useState<BigNumber>(BigNumber.from(0))
    const [orbitDecimals, setOrbitDecimals] = useState(18)
    const tierlist = tierInformation.map(item => ({ 'label': 'Tier ' + item.tierNo, value: item.tierNo, requiredTokens: item.requiredTokens, shownRequiredTokens: item.shownRequiredTokens }))
    const [balanceTier, setBalanceTier] = useState(0)
    const { userClaimedTier, unlockTimes, lockedAmount, updateTierAndUnlockTime } = useTierAndUnlockTime(TierTokenLockContractAddress, 'bsc', isOpen)
    const [userTotalOrbitAmount, setUserTotalOrbit] = useState<BigNumber>(BigNumber.from(0))
    const [maxAvailableTier, setMaxAvailableTier] = useState(0)
    const [lockStep, setLockStep] = useState(0)
    const [newLockingAmount, setLockingAmount] = useState(BigNumber.from(0))
    const [lockDays, setLockDays] = useState(28)
    const [isLocking, setIsLocking] = useState(false)
    const [isUnlocking, setIsUnlocking] = useState(false)    

    const init = () => {
        setLockStep(0)
        if (userClaimedTier > 0) {
            setSelectTier(userClaimedTier.toString())
        }else{
            setSelectTier('')
        }
        setHash(undefined)
        setLockDays(14)
    }

    useEffect(() => {
        if (isOpen) {
            if (account) {
                callUserOrbitCallback()
            } else {
                setUserOrbitBalance(BigNumber.from(0))
            }
        }
        init()
    }, [account, isOpen])

    useEffect(() => {
        setUserTotalOrbit(lockedAmount.add(userOrbitBalance))
    }, [userOrbitBalance, lockedAmount])

    useEffect(() => {
        const fetch = async () => {
            let bal = formatEther(userTotalOrbitAmount, orbitDecimals, 4)
            let tierResult = await getTierValues(BigNumber.from(Math.trunc(parseFloat(bal.toString()))))
            setMaxAvailableTier(tierResult.tierNo)
        }
        fetch()
    }, [userTotalOrbitAmount])

    useEffect(() => {
        if (!selectedTier && userClaimedTier > 0) {
            setSelectTier(userClaimedTier.toString())
        }
    }, [userClaimedTier])

    useEffect(() => {
        try {
            if (userOrbitToken) {
                if (userOrbitToken?.decimals) setOrbitDecimals(userOrbitToken?.decimals)
            }
        } catch (error) { }
    }, [userOrbitToken])

    useEffect(() => {
        const fetch = async () => {
            let bal = formatEther(userOrbitBalance, orbitDecimals, 4)
            let tierResult = await getTierValues(BigNumber.from(Math.trunc(parseFloat(bal.toString()))))
            setBalanceTier(tierResult.tierNo)
        }
        fetch()
    }, [userOrbitBalance])

    const callUserOrbitCallback = () => {
        try {
            tokenBalanceCallback(ORBIT_TOKEN, 'bsc').then((res: BigNumber) => {
                setUserOrbitBalance(res)
            }).catch((error: any) => {
                console.log(error)
            })
        } catch (error) {
            console.debug('Failed to get Orbit balance', error)
        }
    }

    const onSelectTier = (event: SelectChangeEvent) => {
        setSelectTier(event.target.value as string)
    }

    const getUnlockTimesString = () => {
        let times = Math.max(0, unlockTimes)
        let days = Math.floor(times / 86400)
        let hours = Math.floor((times - days * 86400) / 3600)
        let minutes = Math.floor((times - days * 86400 - hours * 3600) / 60)
        return days + " Days " + hours + " Hours " + minutes + " Minutes"
    }

    const handleNextStep = () => {
        let tierInfo = tierlist.find(item => item.value === Number(selectedTier))
        setLockingAmount(parseEther(tierInfo.requiredTokens.toNumber(), orbitDecimals).sub(lockedAmount))
        setLockStep(1)
    }

    const handleGoDashboard = async () => {
        await router.push('/')
        handleClose()
    }

    const setClaimTierSuccess = () => {
        setSelectTier('')
        callUserOrbitCallback()
        updateTierAndUnlockTime()
    }

    const setUnlockSuccess = () => {
        setSelectTier('')
        callUserOrbitCallback()
        updateTierAndUnlockTime()     
    }

    const closeModal = () => {
        if (!(isLocking || isUnlocking)){
            handleClose()
        }
    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                handleClose={closeModal}
            >
                <div className='m-4 md:m-6 min-w-[300px]'>
                    <div className="w-full flex flex-row justify-between mt-2 mb-2 lg:mb-4">
                        <div className='text-white text-[24px] md:text-[32px] ml-6'>
                            Your Tier
                        </div>
                        <div className='flex gap-4 justify-center items-center'>
                            <div className='hidden lg:flex gap-4 justify-center items-center'>
                                <BuyButton />
                                <UnlockTierAction
                                    lockedAmount={lockedAmount}
                                    isUnlocking={isUnlocking}
                                    unlockTimes={unlockTimes}
                                    setIsUnlocking={(value: boolean) => setIsUnlocking(value)}
                                    setUnlockSuccess={setUnlockSuccess}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-black-400 hover:text-gray-500 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                    onClick={handleClose}>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='flex lg:hidden gap-4 justify-between items-center w-full mb-4'>
                        <BuyButton />
                        <UnlockTierAction
                            lockedAmount={lockedAmount}
                            isUnlocking={isUnlocking}
                            unlockTimes={unlockTimes}
                            setIsUnlocking={(value: boolean) => setIsUnlocking(value)}
                            setUnlockSuccess={setUnlockSuccess}
                        />
                    </div>
                    <div className='flex flex-col lg:flex-row justify-center gap-6 lg: gap-8 items-stretch'>
                        <div className='flex flex-col w-full lg:w-[450px] max-w-[480px] gap-6'>
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full">
                                <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                    <span>Current tier</span>
                                </div>
                                <div className="text-xl text-white">{userClaimedTier > 0 ? 'Tier ' + userClaimedTier : 'No tier claimed'}</div>
                            </div>
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full">
                                <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                    <span>orbt balance (holding + locked)</span>
                                </div>
                                <div className="text-xl text-white">{`${formatEther(userTotalOrbitAmount, orbitDecimals, 4).toLocaleString()} ORBIT`}</div>
                            </div>
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full">
                                <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                    <span>Time to unlock</span>
                                </div>
                                <div className="text-xl text-white">{userClaimedTier > 0 ? getUnlockTimesString() : 'No tokens locked'}</div>
                            </div>
                        </div>
                        <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full lg:w-[460px] max-w-[480px] ">
                            {lockStep === 0 && <>
                                <div className='text-white text-[32px] mb-4'>Your tier</div>
                                <div className='w-full flex flex-col gap-4'>
                                    <div className='text-white text-[16px] font-light whitespace-normal'>
                                        Your tier is currently unallocated. Please select the tier you wish to claim and the amount of tokens will be locked for 14 days in order to access this utility.
                                    </div>
                                    <TierSelectBox
                                        onSelectTier={onSelectTier}
                                        selectedTier={selectedTier}
                                        userClaimedTier={userClaimedTier}
                                        maxAvailableTier={maxAvailableTier}
                                        balanceTier={balanceTier} />
                                    <Button
                                        variant="contained"
                                        sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                                        onClick={handleNextStep}
                                        disabled={Number(selectedTier) <= 0 || userClaimedTier === Number(selectedTier)}
                                    >
                                        Claim your tier
                                    </Button>
                                </div>
                            </>}
                            {lockStep === 1 && <>
                                {!hash && <>
                                    <div className='text-white text-[32px] mb-4'>{`Tier ${selectedTier} selected`}</div>
                                    <div className='flex flex-col gap-4'>
                                        <div className='text-white text-[15px] font-light whitespace-normal'>
                                            {`You are locking ${formatEther(newLockingAmount, orbitDecimals, 0).toLocaleString()} tokens. Please select your lock period.`}
                                        </div>
                                        <LockDaysSelector lockDays={lockDays} setLockDays={(value: number) => {if (!isLocking) setLockDays(value)}} />
                                        <ClaimTierAction
                                            buttonText={'Lock your tier'}
                                            newLockingAmount={newLockingAmount}
                                            orbitDecimals={orbitDecimals}
                                            lockDays={lockDays}
                                            isLocking={isLocking}
                                            selectedTier={selectedTier}
                                            userClaimedTier={userClaimedTier}
                                            ORBIT_TOKEN={ORBIT_TOKEN}
                                            setClaimTierSuccess={setClaimTierSuccess}
                                            setIsLocking={(value: boolean) => setIsLocking(value)}
                                            setHash={(value: string) => setHash(value)}
                                        />
                                    </div>
                                </>}
                                {hash && <>
                                    <div className='flex flex-col gap-6 justify-center items-center h-full w-full'>
                                        <div className='text-white text-[32px] mb-2'>
                                            Awesome!
                                        </div>
                                        <div className='text-white text-[15px] font-light whitespace-normal text-center'>
                                            You successufully locked your tier 3 for<br />
                                            {`${formatEther(newLockingAmount, orbitDecimals, 0).toLocaleString()} ORBIT tokens`}
                                        </div>
                                        <Button
                                            variant="contained"
                                            sx={{ width: "280px", borderRadius: "12px", height: '45px' }}
                                            onClick={handleGoDashboard}
                                        >
                                            Go back to the dashboard
                                        </Button>
                                    </div>
                                </>}
                            </>
                            }
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
