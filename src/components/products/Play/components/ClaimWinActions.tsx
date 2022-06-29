import React, { useMemo, useState, useEffect } from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import { BigNumber } from '@ethersproject/bignumber';
import { OrbitPlayContractAddress } from "@app/shared/PlayConstant"
import { useEthers } from "@usedapp/core"
import { useSnackbar } from "@app/lib/hooks/useSnackbar"
import { usePlay } from "@app/contexts"

interface DiceClaimActionProps {
    playType: number
    isClaiming: boolean
    setClaimSuccess: () => void
    setIsClaiming: (value: boolean) => void
}

export default function DiceBetAction({
    playType,
    isClaiming,
    setClaimSuccess,
    setIsClaiming }: DiceClaimActionProps) {

    const { library, account, chainId } = useEthers()
    const { claimDiceRollWinCallback, claimCoinFlipWinCallback, claimSpinWinCallback, claimRoshamboWinCallback } = usePlay()
    const snackbar = useSnackbar()

    const onDiceClaim = async () => {
        setIsClaiming(true)
        try {
            claimDiceRollWinCallback().then((res: any) => {
                setClaimSuccess()
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

    const onCoinFlipClaim = async () => {
        setIsClaiming(true)
        try {
            claimCoinFlipWinCallback().then((res: any) => {
                setClaimSuccess()
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

    const onSpinClaim = async () => {
        setIsClaiming(true)
        try {
            claimSpinWinCallback().then((res: any) => {
                setClaimSuccess()
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

    const onRoshamboClaim = async () => {
        setIsClaiming(true)
        try {
            claimRoshamboWinCallback().then((res: any) => {
                setClaimSuccess()
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

    const onClaim = () => {
        switch (playType) {
            case 1:
                onCoinFlipClaim()
                break;
            case 2:
                onDiceClaim()
                break;
            case 3:
                onSpinClaim()
                break;
            case 4:
                onRoshamboClaim()
                break;
        }
    }
    return (
        <div className='w-full flex gap-6 justify-between'>
            <LoadingButton
                variant="contained"
                sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                loading={isClaiming}
                loadingPosition="start"
                disabled={!account}
                onClick={onClaim}
            >
                {isClaiming ? 'Collecting...' : "Collect Your Win"}
            </LoadingButton>
        </div>
    );
}
