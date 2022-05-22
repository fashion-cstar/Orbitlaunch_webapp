import React, { useMemo, useState, useEffect } from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import { useLockContract } from 'src/state/LockActions'
import { TierTokenLockContractAddress } from "@app/shared/AppConstant"
import { useSnackbar } from "@app/lib/hooks/useSnackbar"

interface ExtendLockTimeActionProps {
    lockDays: number
    isLocking: boolean
    setClaimTierSuccess: () => void
    setIsLocking: (value: boolean) => void
    setHash: (value: string) => void
}

export default function ExtendLockTimeAction({
    lockDays,
    isLocking,
    setClaimTierSuccess,
    setIsLocking,
    setHash }: ExtendLockTimeActionProps) {

    const { extendLockTimeCallback } = useLockContract(TierTokenLockContractAddress, 'bsc')    
    const snackbar = useSnackbar()

    const handleExtendTier = async () => {
        onExtendLockTime()
    }

    async function onExtendLockTime() {
        try {
            extendLockTimeCallback(lockDays).then((hash: string) => {
                setHash(hash)
                setClaimTierSuccess()
                setIsLocking(false)
            }).catch(error => {
                setIsLocking(false)
                console.log(error)
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
                onClick={handleExtendTier}
            >
                {isLocking ? 'Extending your tier...' : "Extend your tier"}
            </LoadingButton>
        </div>
    );
}
