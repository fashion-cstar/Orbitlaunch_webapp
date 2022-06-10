import React, { useMemo, useState, useEffect } from 'react'
import { Button } from "@mui/material"
import { useEthers } from "@usedapp/core"
import Modal from 'src/components/common/Modal';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useToken, useTokenBalanceCallback } from 'src/state/hooks'
import { useLockActions } from "@app/contexts"
import { useRouter } from 'next/router'
import { BigNumber } from '@ethersproject/bignumber';
import { tierInformation } from 'src/shared/TierLevels'
import { getTierValues } from '@app/shared/TierLevels'
import { formatEther, parseEther } from '@app/utils'
import useRefresh from 'src/state/useRefresh'
import { DiceRoll_MaxBet, DiceRoll_MinBet } from '@app/shared/PlayConstant';

interface DiceRollModalProps {
    isOpen: boolean
    handleClose: () => void
}

export default function DiceRollModal({ isOpen, handleClose }: DiceRollModalProps) {
    const { library, account, chainId } = useEthers()
    const router = useRouter()
    const [hash, setHash] = useState<string | undefined>()
    const [userTotalOrbitAmount, setUserTotalOrbit] = useState<BigNumber>(BigNumber.from(0))

    const init = () => {

    }

    useEffect(() => {
        init()
    }, [account, isOpen])

    const closeModal = () => {
        // if (!(isLocking || isUnlocking)) {
        //     handleClose()
        // }
        handleClose()
    }

    return (
        <div>
            <Modal
                isOpen={isOpen}
                header={"Dice Roll"}
                handleClose={closeModal}
            >
                <div className='m-4 md:m-6 min-w-[300px]'>
                    <div className='flex flex-col lg:flex-row justify-center gap-6 lg: gap-8 items-stretch'>
                        <div className='flex flex-col w-full lg:w-[450px] max-w-[480px] gap-6'>
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full">
                                <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                    <span>Times played</span>
                                </div>
                                <div className="text-xl text-white">{Number('1502').toLocaleString()}</div>
                            </div>
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full">
                                <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                    <span>ORBIT paid out</span>
                                </div>
                                <div className="text-xl text-white">{Number('21374200').toLocaleString()}</div>
                            </div>
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full">
                                <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                    <span>ORBIT burnt</span>
                                </div>
                                <div className="text-xl text-white">{Number('75052').toLocaleString()}</div>
                            </div>
                        </div>
                        <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full lg:w-[460px] max-w-[480px] ">
                            <>
                                <div className='text-white text-[32px] mb-4'>Place your bet</div>
                                <div className='flex flex-col'>
                                    <div className='text-[15px] lg:text-[16px] text-white font-light'>
                                        Minimum Bet:{' '}<span className='text-app-primary font-normal'>{`${DiceRoll_MinBet.toLocaleString()} $ORBIT`}</span>
                                    </div>
                                    <div className='text-[15px] lg:text-[16px] text-white font-light'>
                                        Maximum Bet:{' '}<span className='text-app-primary font-normal'>{`${DiceRoll_MaxBet.toLocaleString()} $ORBIT`}</span>
                                    </div>
                                    <div className='text-[15px] lg:text-[16px] text-white font-light'>
                                        Returns:{' '}<span className='text-app-primary font-normal'>{`BET + 95% `}</span>{`(Bet 100 ORBIT win 195)`}
                                    </div>
                                </div>
                                <Button
                                    variant="contained"
                                    sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                                    // onClick={handleNextStep}
                                    // disabled={Number(selectedTier) <= 0 || userClaimedTier === Number(selectedTier)}
                                >
                                    Claim your tier
                                </Button>
                                {/* <div className='w-full flex flex-col gap-4'>
                                    <div className='text-white text-[16px] font-light whitespace-normal'>
                                        {userClaimedTier > 0 ? 'Your tier is currently locked but you can upgrade your tier. Please select the tier you wish to upgrade and claim your tier below.' :
                                            'Your tier is currently unallocated. Please select the tier you wish to claim and the amount of tokens will be locked for 14 days in order to access this utility.'}
                                    </div>
                                    <TierSelectBox
                                        onSelectTier={onSelectTier}
                                        selectedTier={selectedTier}
                                        userClaimedTier={userClaimedTier}
                                        maxAvailableTier={maxAvailableTier}
                                        balanceTier={balanceTier} />
                                    <Button
                                        variant="contained"
                                        sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                                        onClick={handleNextStep}
                                        disabled={Number(selectedTier) <= 0 || userClaimedTier === Number(selectedTier)}
                                    >
                                        Claim your tier
                                    </Button>
                                </div> */}
                            </>
                            {hash && <>
                                <div className='flex flex-col gap-6 justify-center items-center h-full w-full'>
                                    <div className='text-white text-[32px] mb-2'>
                                        Awesome!
                                    </div>
                                    <div className='text-white text-[15px] font-light whitespace-normal text-center'>
                                      
                                    </div>
                                    
                                </div>
                            </>}
                        </div>
                    </div>
                </div>
            </Modal >
        </div >
    );
}
