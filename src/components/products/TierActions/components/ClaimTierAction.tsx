import React, { useMemo, useState, useEffect } from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import { BigNumber } from '@ethersproject/bignumber';
import { useTokenAllowance, useApproveCallback } from 'src/state/hooks'
import { useLockContract } from 'src/state/LockActions'
import { TierTokenLockContractAddress } from "@app/shared/AppConstant"
import { formatEther } from '@app/utils'
import { useEthers } from "@usedapp/core"
import { useSnackbar } from "@app/lib/hooks/useSnackbar"
import { TransactionResponse } from '@ethersproject/providers'

interface ClaimTierActionProps {
    buttonText: string
    newLockingAmount: BigNumber
    orbitDecimals: number
    lockDays: number
    isLocking: boolean
    selectedTier: string
    userClaimedTier: number
    ORBIT_TOKEN: string
    setClaimTierSuccess: () => void
    setIsLocking: (value: boolean) => void
    setHash: (value: string) => void
}

export default function ClaimTierAction({
    buttonText,
    newLockingAmount,
    orbitDecimals,
    lockDays,
    isLocking,
    selectedTier,
    userClaimedTier,
    ORBIT_TOKEN,
    setClaimTierSuccess,
    setIsLocking,
    setHash }: ClaimTierActionProps) {

    const { library, account, chainId } = useEthers()
    const { tokenAllowanceCallback } = useTokenAllowance()
    const { approveCallback } = useApproveCallback()
    const { lockAndClaimTierCallback } = useLockContract(TierTokenLockContractAddress, 'bsc')
    const snackbar = useSnackbar()
    const [isWalletApproving, setIsWalletApproving] = useState(false)

    const checkUserApproved = async (): Promise<boolean> => {
        try {
            let res = await tokenAllowanceCallback(account, TierTokenLockContractAddress, ORBIT_TOKEN, 'bsc')
            if (res.gte(newLockingAmount)) {
                return true
            } else {
                return false
            }
        } catch (error) { return false }
    }

    const handleLockTier = async () => {
        let res = await checkUserApproved()
        setIsLocking(true)
        if (!res) {
            onApprove()
        } else {
            onTierLock()
        }
    }

    async function onApprove() {
        setIsWalletApproving(true)
        try {
            await approveCallback(TierTokenLockContractAddress, ORBIT_TOKEN, formatEther(newLockingAmount, orbitDecimals, 4), 'bsc').then((hash: string) => {
                setIsWalletApproving(false)
                onTierLock()
            }).catch((error: any) => {
                console.log(error)
                setIsLocking(false)
                setIsWalletApproving(false)
                let err: any = error
                if (err?.message) snackbar.snackbar.show(err?.message, "error")
                if (err?.error) {
                    if (err?.error?.message) snackbar.snackbar.show(err?.error?.message, "error");
                }
            })
        } catch (error) {
            console.log(error)
            setIsWalletApproving(false)
            setIsLocking(false)
        }
        return null;
    }

    async function onTierLock() {
        try {
            lockAndClaimTierCallback(newLockingAmount, lockDays).then((response: TransactionResponse) => {
                response.wait().then((_: any) => {
                    setHash(response.hash)
                    setClaimTierSuccess()
                    setIsLocking(false)
                })
            }).catch(error => {
                setIsLocking(false)
                console.log(error)
                console.debug("lockAndClaimTier Error: ", error)
                let err: any = error
                if (err?.message) snackbar.snackbar.show(err?.message, "error")
                if (err?.error) {
                    if (err?.error?.message) snackbar.snackbar.show(err?.error?.message, "error");
                }
            })
        } catch (error) {
            setIsLocking(false)
            console.log(error)
        }
        return null;
    }

    return (
        <div className='w-full'>
            <LoadingButton
                variant="contained"
                sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                loading={isLocking}
                loadingPosition="start"
                onClick={handleLockTier}
                disabled={Number(selectedTier) <= 0 || userClaimedTier === Number(selectedTier)}
            >
                {isLocking ? !isWalletApproving ? 'Claiming your tier...' : 'Approving your tokens...' : buttonText}
            </LoadingButton>
        </div>
    );
}
