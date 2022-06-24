import React, { useMemo, useState, useEffect, useRef } from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import { BigNumber } from '@ethersproject/bignumber';
import { useTokenAllowance, useApproveCallback } from 'src/state/hooks'
import { OrbitPlayContractAddress } from "@app/shared/PlayConstant"
import { formatEther, maxUserPlayAmount, parseEther } from '@app/utils'
import { useEthers } from "@usedapp/core"
import { useSnackbar } from "@app/lib/hooks/useSnackbar"
import { TransactionResponse } from '@ethersproject/providers'
import { usePlay } from "@app/contexts"
import { debounce } from "lodash"

interface DiceBetActionProps {
    playType: number
    amount: BigNumber
    betNumber: number
    isLoading: boolean
    ORBIT_TOKEN: string
    isOpen: boolean
    isValidAmount: boolean
    setPlaceBetSuccess: (destiny: number, returning: BigNumber, burnt: BigNumber) => void
    setIsLoading: (value: boolean) => void
}

export default function DiceBetAction({
    playType,
    amount,
    betNumber,
    isLoading,
    ORBIT_TOKEN,
    isOpen,
    isValidAmount,
    setPlaceBetSuccess,
    setIsLoading }: DiceBetActionProps) {

    const { library, account, chainId } = useEthers()
    const { tokenAllowanceCallback } = useTokenAllowance()
    const { approveCallback } = useApproveCallback()
    const { placeDiceRollBetCallback, placeCoinFlipBetCallback, placeSpinBetCallback } = usePlay()
    const snackbar = useSnackbar()
    const [isWalletApproving, setIsWalletApproving] = useState(false)
    const [isApproved, setIsApproved] = useState(false)
    const [isCheckingAllowance, setIsCheckingAllowance] = useState(false)

    const checkUserApproved = useRef(
        debounce(async () => {
            setIsCheckingAllowance(true)
        }, 500)
    ).current;

    const checkAllowance = async (): Promise<boolean> => {
        try {
            let res = await tokenAllowanceCallback(account, OrbitPlayContractAddress, ORBIT_TOKEN, 'bsc')
            if (res.gte(amount) && amount.gt(0)) {
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }

    useEffect(() => {
        const fetch = async () => {
            let res = await checkAllowance()
            if (res) setIsApproved(true)
            setIsCheckingAllowance(false)
        }
        if (isCheckingAllowance) {
            fetch()
        }
    }, [isCheckingAllowance])

    useEffect(() => {
        checkUserApproved()
    }, [amount, account, isOpen])

    const onApprove = async () => {
        setIsWalletApproving(true)
        let res = await checkAllowance()
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

    const onPlaceDiceBet = async () => {
        setIsLoading(true)
        try {
            placeDiceRollBetCallback(amount, betNumber).then((res: any) => {
                setPlaceBetSuccess(Number(res.args.result), res.args.returned, res.args.burnt)
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

    const onPlaceCoinFlipBet = async () => {
        setIsLoading(true)
        try {
            placeCoinFlipBetCallback(amount, betNumber).then((res: any) => {
                let result = 0
                result = res.args.result.toLowerCase() == "heads" ? 1 : 2
                setPlaceBetSuccess(result, res.args.returned, res.args.burnt)
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

    const getSpinPlaceFromName = (name: string) => {
        if (name === "red") return 1
        if (name === "yellow") return 2
        if (name === "green") return 3
        if (name === "blue") return 4
        return 1
    }

    const onPlaceSpinBet = async () => {
        setIsLoading(true)
        try {
            placeSpinBetCallback(amount, betNumber).then((res: any) => {
                let result = 0
                result = getSpinPlaceFromName(res.args.result.toLowerCase())
                setPlaceBetSuccess(result, res.args.returned, res.args.burnt)
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

    const onPlace = () => {
        switch (playType) {
            case 1:
                onPlaceCoinFlipBet()
                break;
            case 2:
                onPlaceDiceBet()
                break;
            case 3:
                onPlaceSpinBet()
                break;
        }
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
                    disabled={isApproved || isCheckingAllowance || betNumber <= 0 || !isValidAmount || !account}
                >
                    {isWalletApproving ? 'Approving ...' : isApproved ? "Approved" : "Approve"}
                </LoadingButton> : <LoadingButton
                    variant="contained"
                    sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                    loading={isLoading}
                    loadingPosition="start"
                    onClick={onPlace}
                    disabled={!isApproved || betNumber <= 0 || !isValidAmount || !account}
                >
                    {isLoading ? 'Placing ...' : "Place DiceRoll"}
                </LoadingButton>}
        </div>
    );
}
