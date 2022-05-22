import React, { useMemo, useState, useEffect } from 'react'
import { useEthers } from "@usedapp/core"
import Modal from 'src/components/common/Modal';
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
import TierSelectBox from "./components/TierSelectBox"
import ClaimTierAction from './components/ClaimTierAction';
import IncreaseTierAction from './components/IncreateTierAction';
import ExtendLockTimeAction from './components/ExtendLockTimeAction';
import { useSnackbar } from "@app/lib/hooks/useSnackbar"

interface TierModalProps {
    isOpen: boolean
    handleClose: () => void
}

export default function TierActionsModal({ isOpen, handleClose }: TierModalProps) {
    // const ORBIT_TOKEN = OrbtTokenAddress
    const ORBIT_TOKEN = "0x8401e6e7ba1a1ec011bdf34cd59fb11545fae523"
    const { library, account, chainId } = useEthers()
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
    const [newLockingAmount, setLockingAmount] = useState(BigNumber.from(0))
    const [lockDays, setLockDays] = useState(14)
    const [isLocking, setIsLocking] = useState(false)
    const snackbar = useSnackbar()

    const init = () => {
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
        let tierInfo = tierlist.find(item => item.value === Number(selectedTier))
        if (tierInfo) setLockingAmount(parseEther(tierInfo.requiredTokens.toNumber(), orbitDecimals).sub(lockedAmount))
    }, [selectedTier])

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

    const setClaimTierSuccess = () => {
        snackbar.snackbar.show("Your tier has been upgraded!", "success");
        setSelectTier('')
        callUserOrbitCallback()
        updateTierAndUnlockTime()
        handleClose()
    }

    const onSelectTier = (event: SelectChangeEvent) => {
        if (!(isLocking)) {
            setSelectTier(event.target.value as string)
        }
    }

    const closeModal = () => {
        if (!isLocking) {
            handleClose()
        }
    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                header={userClaimedTier > 0 ? "Your tier is about to expire" : "You need to claim your tier"}
                handleClose={closeModal}
            >
                <div className='m-4 md:m-6 min-w-[300px]'>
                    <div className='flex flex-col w-full lg:w-[450px] max-w-[480px] gap-6'>
                        <div className='text-white text-[16px] font-light whitespace-normal'>
                            {userClaimedTier > 0 ? <>
                                {`Your tier is currently locked for ${Math.floor(unlockTimes / 86400)} days. To use Orbit Fund you require to extend your lock to 28 days.`}
                            </> : <>
                                You have not yet claimed your tier. In order to deposit into OrbitFund you must select a tier and lock your tokens for 28 days.
                            </>
                            }
                        </div>
                        <TierSelectBox
                            onSelectTier={onSelectTier}
                            selectedTier={selectedTier}
                            userClaimedTier={userClaimedTier}
                            maxAvailableTier={maxAvailableTier}
                            balanceTier={balanceTier} />
                        {userClaimedTier > 0 ?
                            <>
                                {userClaimedTier !== Number(selectedTier) ? <>
                                    <IncreaseTierAction
                                        newLockingAmount={newLockingAmount}
                                        orbitDecimals={orbitDecimals}
                                        isLocking={isLocking}
                                        selectedTier={selectedTier}
                                        userClaimedTier={userClaimedTier}
                                        ORBIT_TOKEN={ORBIT_TOKEN}
                                        setClaimTierSuccess={setClaimTierSuccess}
                                        setIsLocking={(value: boolean) => setIsLocking(value)}
                                        setHash={(value: string) => setHash(value)}
                                    />
                                </> : <>
                                    <ExtendLockTimeAction
                                        lockDays={lockDays}
                                        isLocking={isLocking}                                        
                                        setClaimTierSuccess={setClaimTierSuccess}
                                        setIsLocking={(value: boolean) => setIsLocking(value)}
                                        setHash={(value: string) => setHash(value)}
                                    />
                                </>}
                            </> : <>
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
                            </>}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
