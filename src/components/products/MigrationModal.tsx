import React, { useMemo, useState, useEffect } from 'react'
import MigrateInput from '@app/components/common/MigrateInput'
import MigrateOutput from '@app/components/common/MigrateOutput'
import { Button } from "@mui/material"
import SwapIcon from './Exchange/svgs/SwapIcon'
import QuestionMark from './Pad/components/svgs/QuestionMark'
import { useSnackbar } from "@app/lib/hooks/useSnackbar"
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade'
import { useEthers } from "@usedapp/core"
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { getEtherscanLink, CHAIN_LABELS, getNativeSymbol, formatEther, parseEther } from 'src/utils'
import Modal from 'src/components/common/Modal'
import {
    AppTokenAddress,
    OrbtTokenAddress,
    MigrationOrbitAddress,
    M31TokenAddress
} from "@app/shared/AppConstant"
import { BigNumber } from '@ethersproject/bignumber'
import {
    useMigrationCallback
} from 'src/state/Migration/hooks'
import { useToken, useNativeTokenBalance, useTokenAllowance, useTokenBalance, useTokenBalanceCallback, useApproveCallback } from 'src/state/hooks'

interface MigrationModalProps {
    isOpen: boolean
    handleClose: () => void
}

export default function MigrationModal({ isOpen, handleClose }: MigrationModalProps) {
    const { library, account, chainId } = useEthers()
    const [inputAmount, setInputAmount] = useState(0)
    const [outputAmount, setOutputAmount] = useState(0)
    const [isApproved, setIsApproved] = useState(false)
    const [hash, setHash] = useState<string | undefined>()
    const snackbar = useSnackbar()
    const [attempting, setAttempting] = useState(false)
    const [isOverMax, setIsOverMax] = useState(false)
    const { tokenAllowanceCallback } = useTokenAllowance()
    const [isWalletApproving, setIsWalletApproving] = useState(false)
    const { migrationCallback } = useMigrationCallback()
    const { approveCallback } = useApproveCallback()
    const [isMigrated, setMigrated] = useState(false)
    const [userMaxMigration, setUserMaxMigration] = useState(0)
    const { tokenBalanceCallback } = useTokenBalanceCallback()
    const accountM31Balance = useTokenBalance(M31TokenAddress, 'bsc')
    const accountOrbtBalance = useTokenBalance(OrbtTokenAddress, 'bsc')
    const [userM31Balance, setUserM31Balance] = useState<BigNumber>(BigNumber.from(0))
    const [userOrbtBalance, setUserOrbtBalance] = useState<BigNumber>(BigNumber.from(0))
    const nativeBalance = useNativeTokenBalance('bsc')
    const [ethBalance, setEthBalance] = useState(0)
    const m31Token = useToken(M31TokenAddress, 'bsc')
    const [m31Decimals, setM31Decimals] = useState(18)

    useEffect(() => {
        if (nativeBalance) {
            setEthBalance(formatEther(nativeBalance, 18, 5))
        }
    }, [nativeBalance])

    useEffect(() => {
        if (isOpen) {
            if (account) {
                callUserOrbitCallback()
            } else {
                setUserM31Balance(BigNumber.from(0))
                setUserOrbtBalance(BigNumber.from(0))
            }
        }

        if (accountM31Balance) {
            setUserM31Balance(accountM31Balance)
        }

        const checkUserApproved = async () => {
            let res = await tokenAllowanceCallback(account, MigrationOrbitAddress, M31TokenAddress, 'bsc')

            if (accountM31Balance.isZero()) {
                setIsApproved(false);
            }
            else if (res.gte(accountM31Balance)) {
                setIsApproved(true);
            }
        }

        if (account && accountM31Balance) {
            checkUserApproved();
        }

    }, [account, isOpen, accountM31Balance])


    useEffect(() => {
        if (accountOrbtBalance) {
            setUserOrbtBalance(accountOrbtBalance)
        }
    }, [accountOrbtBalance])

    useEffect(() => {
        let max = formatEther(userM31Balance, m31Decimals, 2)
        setUserMaxMigration(max)
    }, [userM31Balance, m31Decimals])

    useEffect(() => {
        try {
            if (m31Token) {
                if (m31Token?.decimals) setM31Decimals(m31Token?.decimals)
            }
        } catch (error) { }
    }, [m31Token])

    async function onApprove() {
        setIsWalletApproving(true)
        try {
            approveCallback(MigrationOrbitAddress, AppTokenAddress, Math.round(inputAmount + 1), 'bsc').then((hash: string) => {
                setIsApproved(true)
                setIsWalletApproving(false)
            }).catch((error: any) => {
                setIsWalletApproving(false)
                console.log(error)
                let err: any = error
                if (err?.message) snackbar.snackbar.show(err?.message, "error")
                if (err?.error) {
                    if (err?.error?.message) snackbar.snackbar.show(err?.error?.message, "error");
                }
            })
        } catch (error) {
            setIsWalletApproving(false)
            console.log(error)
        }
        return null;
    }

    const callUserOrbitCallback = () => {
        try {
            tokenBalanceCallback(M31TokenAddress, 'bsc').then((res: BigNumber) => {
                setUserM31Balance(res)
            }).catch((error: any) => {
                console.log(error)
            })
        } catch (error) {
            console.debug('Failed to get ORBIT balance', error)
        }

        try {
            tokenBalanceCallback(OrbtTokenAddress, 'bsc').then((res: BigNumber) => {
                setUserOrbtBalance(res)
            }).catch((error: any) => {
                console.log(error)
            })
        } catch (error) {
            console.debug('Failed to get ORBT balance', error)
        }
    }

    const successMigrated = () => {
        callUserOrbitCallback()
    }

    async function onMigration() {
        setAttempting(true)
        let res = await tokenAllowanceCallback(account, MigrationOrbitAddress, AppTokenAddress, 'bsc')
        if (res) {
            try {
                if (res.gte(parseEther(inputAmount, m31Decimals))) {
                    console.log(res)
                    try {
                        migrationCallback(MigrationOrbitAddress, AppTokenAddress, inputAmount, 'bsc').then((hash: string) => {
                            setHash(hash)
                            successMigrated()
                        }).catch(error => {
                            setAttempting(false)
                            console.log(error)
                            let err: any = error
                            if (err?.message) snackbar.snackbar.show(err?.message, "error")
                            if (err?.error) {
                                if (err?.error?.message) snackbar.snackbar.show(err?.error?.message, "error");
                            }
                        })
                    } catch (error) {
                        setAttempting(false)
                        console.log(error)
                    }
                    return true
                } else {
                    onMigration()
                }
            } catch (ex) {
                onMigration()
            }
        }

        return null;
    }

    const getDepositAvailable = () => {
        let max = formatEther(userM31Balance, m31Decimals, 5) > userMaxMigration ? userMaxMigration : formatEther(userM31Balance, m31Decimals, 2)
        return max
    }

    const onMax = () => {
        let max = getDepositAvailable()
        setInputAmount(max)
        setOutputAmount(max)
    }

    const onclose = () => {
        setHash(undefined)
        setAttempting(false)
        setIsApproved(false)
        setIsWalletApproving(false)
        setMigrated(false)
        setInputAmount(0)
        setOutputAmount(0)
        handleClose()
    }

    const onInputChange = (val: any) => {
        if (!isApproved) {
            if (Number(val) !== NaN) setInputAmount(Number(val))
            else setInputAmount(0)
            if (Number(val) !== NaN) setOutputAmount(Number(val))
            else setOutputAmount(0)
            if (Number(val) > getDepositAvailable()) {
                setIsOverMax(true)
            } else {
                setIsOverMax(false)
            }
        }
    }

    const onOutputChange = (val: any) => {
        if (!isApproved) {
            if (Number(val) !== NaN) setOutputAmount(Number(val))
            else setOutputAmount(0)
            if (Number(val) !== NaN) setInputAmount(Number(val))
            else setInputAmount(0)
            if (Number(val) > getDepositAvailable()) {
                setIsOverMax(true)
            } else {
                setIsOverMax(false)
            }
        }
    }

    useEffect(() => {
        setInputAmount(formatEther(userM31Balance, m31Decimals, 2));
    }, [userM31Balance]);

    // console.log(inputAmount);
    // console.log(!account , isOverMax , ethBalance <= 0 , inputAmount === 0 , isApproved , isWalletApproving);

    return (
        <div>
            <Modal
                isOpen={isOpen}
                header="OrbitMigrate"
                handleClose={handleClose}
            >
                <div className='m-4 md:m-6 w-[300px] md:w-[400px]'>
                    {!attempting && !hash && (
                        <div className='w-full flex flex-col gap-4 mt-6'>
                            <MigrateInput name={"M31"} value={formatEther(userM31Balance, m31Decimals, 2)} balance={formatEther(userM31Balance, m31Decimals, 2).toString()} onChange={(val: any) => {}} />
                            <div className='flex justify-between items-center py-2'>
                                <div className='basis-1/3'>
                                    <div className='flex gap-2'>
                                        <span className='text-[14px] text-white'>1:1 Migration</span>
                                        <QuestionMark />
                                    </div>
                                </div>
                                <div className='basis-1/3 flex justify-center items-center'>
                                    <div className='rounded-full bg-[#867EE8] p-2'>
                                        <SwapIcon />
                                    </div>
                                </div>
                                <div className='basis-1/3'></div>
                            </div>
                            <MigrateOutput name={"ORBT"} value={formatEther(userM31Balance, m31Decimals, 2)} balance={formatEther(userM31Balance, m31Decimals, 2).toString()} onChange={(val: any) => onOutputChange(val)} />
                            <div className='text-white text-[14px] flex justify-between'>
                                <div>BNB Balance</div>
                                <div className='text-right'>{`${ethBalance} ${getNativeSymbol('bsc')}`}</div>
                            </div>
                            <div className='flex gap-4 mt-2'>                 
                                {!isApproved ?
                                    <Button
                                        variant="contained"
                                        sx={{ width: "100%", borderRadius: "12px" }}
                                        onClick={onApprove}
                                        disabled={!account || isOverMax || ethBalance <= 0 || inputAmount === 0 || isApproved || isWalletApproving}
                                    >
                                        Approve
                                    </Button> :
                                    <Button
                                        variant="contained"
                                        sx={{ width: "100%", borderRadius: "12px" }}
                                        onClick={onMigration}
                                        disabled={!isApproved}
                                    >
                                        Swap
                                    </Button>
                                }
                            </div>
                        </div>

                    )}
                    {attempting && !hash && (
                        <div className="flex justify-center items-center flex-col gap-12 h-[200px]">
                            <Fade in={true} style={{ transitionDelay: '800ms' }} unmountOnExit>
                                <CircularProgress />
                            </Fade>
                            <div>
                                {`Migrating `}
                            </div>
                        </div>
                    )}
                    {hash && (
                        <div className='w-full'>
                            <div className='w-full flex justify-center py-4'>
                                <TaskAltIcon sx={{ fontSize: 120, color: '#00aa00' }} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='text-[16px] text-[#aaaaaa] text-center'>Transaction submitted</div>
                                <div className='text-[16px] text-[#aaaaaa] text-center'>{'Hash: ' + hash.slice(0, 10) + '...' + hash.slice(56, 65)}</div>
                                {chainId && (
                                    <a className='text-[16px] mt-4 text-[#aaaaee] underline text-center' target="_blank" href={getEtherscanLink(chainId, hash, 'transaction')}>
                                        {chainId && `View on ${CHAIN_LABELS[chainId]}`}
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
