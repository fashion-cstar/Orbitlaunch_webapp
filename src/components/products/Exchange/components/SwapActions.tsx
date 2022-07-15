import React, { useMemo, useState, useEffect, useRef } from 'react'
import LoadingButton from '@mui/lab/LoadingButton';
import { useTokenAllowance, useApproveCallback } from 'src/state/hooks'
import { isNativeCoin, parseEther } from '@app/utils'
import { useEthers } from "@usedapp/core"
import { useSnackbar } from "@app/lib/hooks/useSnackbar"
import { debounce } from "lodash"
import { SwapContractAddress } from '@app/shared/AppConstant';
import { useSwapCallback } from '@app/state/exchange';

interface ActionProps {
    inputAmount: number
    inToken: any
    outToken: any
}

export default function DiceBetAction({
    inputAmount,
    inToken,
    outToken
}: ActionProps) {
    const { library, account, chainId } = useEthers()
    const { tokenAllowanceCallback } = useTokenAllowance()
    const { approveCallback } = useApproveCallback()
    const { swapExactETHForTokens, swapTokensForETH, swapTokensForTokens } = useSwapCallback()
    const snackbar = useSnackbar()
    const [isCheckingAllowance, setIsCheckingAllowance] = useState(false)
    const [isApproved, setIsApproved] = useState(false)
    const [isWalletApproving, setIsWalletApproving] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const checkUserApproved = useRef(
        debounce(async () => {
            setIsCheckingAllowance(true)
        }, 500)
    ).current;

    const checkAllowance = async (): Promise<boolean> => {
        try {
            let amount = parseEther(inputAmount, inToken?.decimals ?? 18)
            let res = await tokenAllowanceCallback(account, SwapContractAddress, inToken?.address, 'bsc')
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
    }, [inputAmount, account])

    const onApprove = async () => {
        setIsWalletApproving(true)
        let res = await checkAllowance()
        if (!res) {
            try {
                await approveCallback(SwapContractAddress, inToken?.address, inputAmount, 'bsc').then((hash: string) => {
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

    const onSwapExactETHForTokens = async () => {
        setIsLoading(true)
        try {
            swapExactETHForTokens(SwapContractAddress, outToken?.address, parseEther(inputAmount, inToken?.decimals ?? 18), account, 'bsc').then((hash: string) => {
                snackbar.snackbar.show("Transaction submitted!", "success")
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

    const onSwapTokensForETH = async () => {
        setIsLoading(true)
        try {
            swapTokensForETH(SwapContractAddress, inToken?.address, parseEther(inputAmount, inToken?.decimals ?? 18), account, 'bsc').then((hash: string) => {
                snackbar.snackbar.show("Transaction submitted!", "success")
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

    const onSwapTokensForTokens = async () => {
        setIsLoading(true)
        try {
            swapTokensForTokens(SwapContractAddress, inToken?.address, outToken?.address, parseEther(inputAmount, inToken?.decimals ?? 18), account, 'bsc').then((hash: string) => {
                snackbar.snackbar.show("Transaction submitted!", "success")
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

    const onSwap = () => {
        if (isNativeCoin('bsc', inToken?.symbol)) {
            onSwapExactETHForTokens()
        } else if (isNativeCoin('bsc', outToken?.symbol)) {
            onSwapTokensForETH()
        } else {
            onSwapTokensForTokens()
        }
    }

    return (
        <>
            <LoadingButton
                variant="contained"
                sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                loading={isWalletApproving}
                loadingPosition="start"
                onClick={onApprove}
                disabled={isApproved || isCheckingAllowance || !account || inputAmount<=0}
            >
                {isWalletApproving ? 'Approving ...' : isApproved ? "Approved" : "Approve"}
            </LoadingButton>
            <LoadingButton
                variant="contained"
                sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                loading={isLoading}
                loadingPosition="start"
                onClick={onSwap}
                disabled={!isApproved || !account || inputAmount<=0}
            >
                {isLoading ? 'Swapping ...' : "Swap"}
            </LoadingButton>
        </>
    );
}
