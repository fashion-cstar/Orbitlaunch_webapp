import React, { useMemo, useState, useEffect } from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import { BigNumber } from '@ethersproject/bignumber';
import { useTokenAllowance, useApproveCallback } from 'src/state/hooks'
import { useLockActions } from "@app/contexts"
import { TierTokenLockContractAddress } from "@app/shared/AppConstant"
import { maxUserLockAmount } from '@app/utils'
import { useEthers } from "@usedapp/core"
import { useSnackbar } from "@app/lib/hooks/useSnackbar"
import { TransactionResponse } from '@ethersproject/providers'

interface IncreaseTierActionProps {
    newLockingAmount: BigNumber
    orbitDecimals: number
    isLocking: boolean
    selectedTier: string
    userClaimedTier: number
    ORBIT_TOKEN: string
    setClaimTierSuccess: () => void
    setIsLocking: (value: boolean) => void
    setHash: (value: string) => void
}

export default function IncreaseTierAction({
    newLockingAmount,
    orbitDecimals,
    isLocking,
    selectedTier,
    userClaimedTier,
    ORBIT_TOKEN,
    setClaimTierSuccess,
    setIsLocking,
    setHash }: IncreaseTierActionProps) {

    const { library, account, chainId } = useEthers()
    const { tokenAllowanceCallback } = useTokenAllowance()
    const { approveCallback } = useApproveCallback()
    const { increaseTierCallback } = useLockActions()
    const [isWalletApproving, setIsWalletApproving] = useState(false)
    const snackbar = useSnackbar()
    const [isApproved, setIsApproved] = useState(false)
    const [isCheckingAllowance, setIsCheckingAllowance] = useState(false)

    const checkUserApproved = async (): Promise<boolean> => {
        try {
            setIsCheckingAllowance(true)
            let res = await tokenAllowanceCallback(account, TierTokenLockContractAddress, ORBIT_TOKEN, 'bsc')
            setIsCheckingAllowance(false)
            if (res.gte(newLockingAmount)) {
                return true
            } else {
                return false
            }
        } catch (error) {
            setIsCheckingAllowance(false)
            return false 
        }
    }

    useEffect(() => {
        const fetch = async () => {
            let res = await checkUserApproved()
            if (res) setIsApproved(true)
        }
        fetch()
    }, [newLockingAmount])

    async function onApprove() {
        setIsWalletApproving(true)
        let res = await checkUserApproved()
        if (!res) {
            try {
                approveCallback(TierTokenLockContractAddress, ORBIT_TOKEN, maxUserLockAmount, 'bsc').then((hash: string) => {
                    setIsWalletApproving(false)
                    setIsApproved(true)
                }).catch((error: any) => {
                    console.log(error)
                    setIsWalletApproving(false)
                    let err: any = error
                    snackbar.snackbar.show((err.data?.message || err?.message || err).toString(), "error")
                })
            } catch (error) {
                console.log(error)
                setIsWalletApproving(false)
            }
        } else {
            setIsApproved(true)
        }
        return null;
    }

    async function onTierLock() {
        setIsLocking(true)
        try {
            increaseTierCallback(newLockingAmount).then((response: TransactionResponse) => {
                response.wait().then((_: any) => {
                    setHash(response.hash)
                    setClaimTierSuccess()
                    setIsLocking(false)
                })
            }).catch(error => {
                setIsLocking(false)
                console.log(error)
                let err: any = error
                snackbar.snackbar.show((err.data?.message || err?.message || err).toString(), "error")
            })
        } catch (error) {
            setIsLocking(false)
            console.log(error)
        }
        return null;
    }

    return (
        <div className='w-full flex gap-6 justify-between'>
            {!isApproved ?
                <LoadingButton
                    variant="contained"
                    sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                    loading={isWalletApproving}
                    loadingPosition="start"
                    onClick={onApprove}
                    disabled={Number(selectedTier) <= 0 || userClaimedTier === Number(selectedTier) || isApproved || isCheckingAllowance}
                >
                    {isWalletApproving ? 'Approving ...' : isApproved ? "Approved" : "Approve"}
                </LoadingButton> : <LoadingButton
                    variant="contained"
                    sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                    loading={isLocking}
                    loadingPosition="start"
                    onClick={onTierLock}
                    disabled={Number(selectedTier) <= 0 || userClaimedTier === Number(selectedTier) || !isApproved}
                >
                    {isLocking ? 'Upgrading ...' : "Upgrade your tier"}
                </LoadingButton>}
        </div>
    );
}
