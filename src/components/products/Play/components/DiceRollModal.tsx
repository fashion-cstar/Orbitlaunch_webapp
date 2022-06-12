import React, { useMemo, useState, useEffect } from 'react'
import { Button } from "@mui/material"
import { useEthers } from "@usedapp/core"
import Modal from 'src/components/common/Modal';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useRouter } from 'next/router'
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther, parseEther } from '@app/utils'
import useRefresh from 'src/state/useRefresh'
import { DiceRoll_MaxBet, DiceRoll_MinBet } from '@app/shared/PlayConstant';
import BetAmountInput from './BetAmountInput';
import BetSelectBox from './BetSelectBox';
import Dice from './Dice';
import DicePlaceActions from './DicePlaceActions';
import { useToken } from 'src/state/hooks'
// import {
//     OrbtTokenAddress,
// } from "@app/shared/AppConstant"
import {
    OrbtTokenAddress,
} from "@app/shared/PlayConstant"

interface DiceRollModalProps {
    isOpen: boolean
    handleClose: () => void
}

export default function DiceRollModal({ isOpen, handleClose }: DiceRollModalProps) {
    const { library, account, chainId } = useEthers()
    const router = useRouter()    
    const [betAmount, setBetAmount] = useState(0)
    const [isValidAmount, setIsValidAmount] = useState(false)
    const [selectedBet, setSelectBet] = useState('')
    const [orbitDecimals, setOrbitDecimals] = useState(18)
    const userOrbitToken = useToken(OrbtTokenAddress, 'bsc')
    const [isLoading, setIsLoading] = useState(false)
    const [isWin, setIsWin] = useState(false)
    const [destiny, setDestiny] = useState(0)
    const [isEndedBet, setIsEndedBet] = useState(false)

    const init = () => {
        setIsValidAmount(false)
        setBetAmount(0)
        setIsWin(false)
        setIsLoading(false)
        setSelectBet('')
        setIsValidAmount(false)
        setDestiny(0)
        setIsEndedBet(false)
    }

    useEffect(() => {
        init()
    }, [account, isOpen])

    useEffect(() => {
        try {
            if (userOrbitToken) {
                if (userOrbitToken?.decimals) setOrbitDecimals(userOrbitToken?.decimals)
            }
        } catch (error) { }
    }, [userOrbitToken])

    const closeModal = () => {
        if (!isLoading) {
            handleClose()
        }
    }

    const setPlaceDiceBetSuccess = (destiny: number) => {
        setDestiny(destiny)
        setIsEndedBet(true)
        if (Number(selectedBet) == destiny) {
            setIsWin(true)
        } else {
            setIsWin(false)
        }
    }

    const onBetAmountInputChange = (val: any) => {
        if (Number(val) !== NaN) setBetAmount(Number(val))
        else setBetAmount(0)
        if (Number(val) !== NaN) setBetAmount(Number(val))
        else setBetAmount(0)
        if (Number(val) >= DiceRoll_MinBet && Number(val) <= DiceRoll_MaxBet) {
            setIsValidAmount(true)
        } else {
            setIsValidAmount(false)
        }
    }

    const onSelectBet = (event: SelectChangeEvent) => {
        setSelectBet(event.target.value as string)
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
                                <div className="flex gap-4 my-3 w-full">
                                    <div className="basis-1/2">
                                        <BetAmountInput value={betAmount} onChange={onBetAmountInputChange} />
                                    </div>
                                    <div className="basis-1/2">
                                        <BetSelectBox selectedBet={selectedBet}
                                            betlist={[{ label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }, { label: '6', value: 6 }]}
                                            placeholder="Select dice number"
                                            onSelectBet={onSelectBet}
                                        />
                                    </div>
                                </div>
                                <DicePlaceActions
                                    amount={parseEther(betAmount, orbitDecimals)}
                                    diceNumber={Number(selectedBet)}
                                    isLoading={isLoading}
                                    ORBIT_TOKEN={OrbtTokenAddress}
                                    isOpen={isOpen}
                                    isValidAmount={isValidAmount}
                                    setPlaceDiceBetSuccess={setPlaceDiceBetSuccess}
                                    setIsLoading={setIsLoading}
                                />
                                {isLoading && <Dice destiny={destiny} isRoll={isLoading} />}
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
