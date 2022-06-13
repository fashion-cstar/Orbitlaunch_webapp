import React, { useMemo, useState, useEffect } from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import { BigNumber } from '@ethersproject/bignumber';
import { useTokenAllowance, useApproveCallback } from 'src/state/hooks'
import { OrbitPlayContractAddress } from "@app/shared/PlayConstant"
import { formatEther, maxUserPlayAmount, parseEther } from '@app/utils'
import { useEthers } from "@usedapp/core"
import { useSnackbar } from "@app/lib/hooks/useSnackbar"
import { TransactionResponse } from '@ethersproject/providers'
import { usePlayActions } from "src/state/Play"

interface DiceClaimActionProps {    
    isClaiming: boolean    
    setDiceClaimSuccess: () => void
    setIsClaiming: (value: boolean) => void
}

export default function DiceBetAction({    
    isClaiming,    
    setDiceClaimSuccess,
    setIsClaiming }: DiceClaimActionProps) {

    const { library, account, chainId } = useEthers()
    const { tokenAllowanceCallback } = useTokenAllowance()
    const { approveCallback } = useApproveCallback()
    const { claimDiceRollWinCallback } = usePlayActions(OrbitPlayContractAddress, 'bsc')
    const snackbar = useSnackbar()

    async function onDiceClaim() {
        setIsClaiming(true)
        try {
            claimDiceRollWinCallback().then((res: any) => {
                setDiceClaimSuccess()
                setIsClaiming(false)
            }).catch(error => {
                setIsClaiming(false)
                console.log(error)
                let err: any = error
                snackbar.snackbar.show((err.data?.message || err?.message || err).toString(), "error")
            })
        } catch (error) {
            setIsClaiming(false)
            console.log(error)
        }
        return null;
    }

    return (
        <div className='w-full flex gap-6 justify-between'>
            <LoadingButton
                variant="contained"
                sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                loading={isClaiming}
                loadingPosition="start"
                disabled={!account}
                onClick={onDiceClaim}                
            >
                {isClaiming ? 'Collecting...' : "Collect Your Win"}
            </LoadingButton>
        </div>
    );
}
