import React, { useMemo, useState, useEffect } from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import { BigNumber } from '@ethersproject/bignumber';
import { useToken, useTokenBalanceCallback, useTokenAllowance, useApproveCallback } from 'src/state/hooks'
import { useLockContract, useTierAndUnlockTime } from 'src/state/LockActions'
import { TierTokenLockContractAddress } from "@app/shared/AppConstant"
import { formatEther, parseEther } from '@app/utils'
import { useEthers } from "@usedapp/core"
import { useSnackbar } from "@app/lib/hooks/useSnackbar"

interface ClaimTierActionProps {
    lockedAmount: BigNumber    
    isUnlocking: boolean
    unlockTimes: number
    setIsUnlocking: (value: boolean) => void
    setUnlockSuccess: () => void
}

export default function UnlockTierAction({
    lockedAmount,
    isUnlocking,
    unlockTimes,
    setIsUnlocking,
    setUnlockSuccess
}: ClaimTierActionProps) {

    const { unlockTokenCallback } = useLockContract(TierTokenLockContractAddress, 'bsc')
    const snackbar = useSnackbar()

    const handleUnlock = () => {
        setIsUnlocking(true)
        try {
            unlockTokenCallback().then((res) => {
                setIsUnlocking(false)
                setUnlockSuccess()
                snackbar.snackbar.show("Unlocked successfully!", "success");
            }).catch((error: any) => {
                setIsUnlocking(false)
                console.log(error)
                let err: any = error
                if (err?.message) snackbar.snackbar.show(err?.message, "error")
                if (err?.error) {
                    if (err?.error?.message) snackbar.snackbar.show(err?.error?.message, "error");
                }
            })
        } catch (error) {
            setIsUnlocking(false)
            console.debug('Failed to unlock your tokens', error)
        }
    }

    return (
        <div className='w-full'>
            <LoadingButton
                variant="outlined"
                sx={{ width: "100%", borderRadius: "12px" }}
                loading={isUnlocking}
                loadingPosition="start"
                onClick={handleUnlock}
                disabled={lockedAmount.eq(0) || unlockTimes > 0}
            >
                {isUnlocking ? 'Unlocking your tokens...' : (lockedAmount.eq(0) || unlockTimes > 0) ? 'Unlock unavailable' : 'Unlock your tokens'}
            </LoadingButton>
        </div>
    );
}
