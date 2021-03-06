import React, { useMemo, useState, useEffect } from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import { useLockActions } from "@app/contexts"
import { useSnackbar } from "@app/lib/hooks/useSnackbar"
import { TransactionResponse } from '@ethersproject/providers'

interface ExtendLockTimeActionProps {
    lockDays: number
    isLocking: boolean
    remainDays: number
    setClaimTierSuccess: () => void
    setIsLocking: (value: boolean) => void
    setHash: (value: string) => void
}

export default function ExtendLockTimeAction({
    lockDays,
    isLocking,
    remainDays,
    setClaimTierSuccess,
    setIsLocking,
    setHash }: ExtendLockTimeActionProps) {

    const { extendLockTimeCallback } = useLockActions()
    const snackbar = useSnackbar()

    const handleExtendTier = async () => {
        onExtendLockTime()
    }

    async function onExtendLockTime() {
        setIsLocking(true)
        try {
            // let additionalDays = Math.max(lockDays - remainDays, FOURTEEN_DAYS)
            extendLockTimeCallback(lockDays).then((response: TransactionResponse) => {
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
        <div className='w-full'>
            <LoadingButton
                variant="contained"
                sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                loading={isLocking}
                loadingPosition="start"
                disabled={isLocking}
                onClick={handleExtendTier}
            >
                {isLocking ? 'Extending your lock...' : "Extend your lock"}
            </LoadingButton>
        </div>
    );
}
