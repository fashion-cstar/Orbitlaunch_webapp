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
    const { increaseTierCallback } = useLockContract(TierTokenLockContractAddress, 'bsc')
    const [isWalletApproving, setIsWalletApproving] = useState(false)
    const snackbar = useSnackbar()

    const checkUserApproved = async (): Promise<boolean> => {
        try {
            let res = await tokenAllowanceCallback(account, TierTokenLockContractAddress, ORBIT_TOKEN, 'bsc')
            if (res.gte(newLockingAmount)) {
                return true
            }else{
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
            approveCallback(TierTokenLockContractAddress, ORBIT_TOKEN, formatEther(newLockingAmount, orbitDecimals, 4), 'bsc').then((hash: string) => {
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
            setIsLocking(false)
            setIsWalletApproving(false)
        }
        return null;
    }

    async function onTierLock() {        
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
                {isLocking ? !isWalletApproving ? 'Claiming your tier...' : 'Approving your tokens...' : "Upgrade and extend your tier"}
            </LoadingButton>
        </div>
    );
}
