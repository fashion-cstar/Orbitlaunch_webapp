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

interface DiceBetActionProps {
    amount: BigNumber
    diceNumber: number
    isLoading: boolean
    ORBIT_TOKEN: string
    isOpen: boolean
    isValidAmount: boolean
    setPlaceDiceBetSuccess: (destiny: number, returning: BigNumber) => void
    setIsLoading: (value: boolean) => void
}

export default function DiceBetAction({
    amount,
    diceNumber,
    isLoading,
    ORBIT_TOKEN,
    isOpen,
    isValidAmount,
    setPlaceDiceBetSuccess,
    setIsLoading }: DiceBetActionProps) {

    const { library, account, chainId } = useEthers()
    const { tokenAllowanceCallback } = useTokenAllowance()
    const { approveCallback } = useApproveCallback()
    const { placeDiceRollBetCallback } = usePlayActions(OrbitPlayContractAddress, 'bsc')
    const snackbar = useSnackbar()
    const [isWalletApproving, setIsWalletApproving] = useState(false)
    const [isApproved, setIsApproved] = useState(false)
    const [isCheckingAllowance, setIsCheckingAllowance] = useState(false)

    const checkUserApproved = async (): Promise<boolean> => {
        try {
            setIsCheckingAllowance(true)
            let res = await tokenAllowanceCallback(account, OrbitPlayContractAddress, ORBIT_TOKEN, 'bsc')
            setIsCheckingAllowance(false)
            if (res.gte(amount) && amount.gt(0)) {
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
    }, [amount, account, isOpen])

    async function onApprove() {
        setIsWalletApproving(true)
        let res = await checkUserApproved()
        if (!res) {
            try {
                await approveCallback(OrbitPlayContractAddress, ORBIT_TOKEN, maxUserPlayAmount, 'bsc').then((hash: string) => {
                    setIsWalletApproving(false)
                    setIsApproved(true)
                    snackbar.snackbar.show("Approved!", "success");
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
            snackbar.snackbar.show("Approved!", "success");
            setIsApproved(true)
        }
        return null;
    }

    async function onPlaceDiceBet() {
        setIsLoading(true)
        try {
            placeDiceRollBetCallback(amount, diceNumber).then((res: any) => {                   
                setPlaceDiceBetSuccess(Number(res.args.winNumber), res.args.returned)
                setIsLoading(false)
            }).catch(error => {
                setIsLoading(false)
                console.log(error)
                let err: any = error
                snackbar.snackbar.show((err.data?.message || err?.message || err).toString(), "error")
            })
        } catch (error) {
            setIsLoading(false)
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
                    disabled={isApproved || isCheckingAllowance || diceNumber<=0 || !isValidAmount || !account}
                >
                    {isWalletApproving ? 'Approving ...' : isApproved ? "Approved" : "Approve"}
                </LoadingButton> : <LoadingButton
                    variant="contained"
                    sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                    loading={isLoading}
                    loadingPosition="start"
                    onClick={onPlaceDiceBet}
                    disabled={!isApproved || diceNumber<=0 || !isValidAmount || !account}
                >
                    {isLoading ? 'Placing ...' : "Place DiceRoll"}
                </LoadingButton>}
        </div>
    );
}
