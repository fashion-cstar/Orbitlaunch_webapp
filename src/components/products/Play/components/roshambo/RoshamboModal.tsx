import React, { useMemo, useState, useEffect } from 'react'
import { Button } from "@mui/material"
import { useEthers } from "@usedapp/core"
import Modal from 'src/components/common/Modal'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, parseEther } from '@app/utils'
import { Roshambo_MaxBet, Roshambo_MinBet } from '@app/shared/PlayConstant'
import BetAmountInput from '../BetAmountInput'
import BetSelectBox from '../RoshamboBetSelectBox'
import Roshambo from './RoshamboAnimate'
import PlaceActions from '../PlaceBetActions'
import { usePlay } from '@app/contexts'
// import {
//     OrbtTokenAddress,
// } from "@app/shared/AppConstant"
import {
    OrbtTokenAddress,
} from "@app/shared/PlayConstant"
import WinInBetIcon from '../svgs/WinInBetIcon'
import LossInBetIcon from '../svgs/LossInBetIcon'
import ClaimActions from '../ClaimWinActions'

interface RoshamboModalProps {
    isOpen: boolean
    orbitDecimals: number
    handleClose: () => void
}

export default function RoshamboModal({ isOpen, orbitDecimals, handleClose }: RoshamboModalProps) {
    const { library, account, chainId } = useEthers()
    const { roshamboInfo, updateOrbitPlayStats } = usePlay()
    const [betAmount, setBetAmount] = useState(0)
    const [isValidAmount, setIsValidAmount] = useState(false)
    const [selectedBet, setSelectBet] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isClaiming, setIsClaiming] = useState(false)
    const [isClaimed, setIsClaimed] = useState(false)
    const [isWin, setIsWin] = useState(false)
    const [destiny, setDestiny] = useState(0)
    const [returningAmount, setReturningAmount] = useState(BigNumber.from(0))
    const [burnAmount, setBurnAmount] = useState(BigNumber.from(0))
    const [isEndedBet, setIsEndedBet] = useState(false)
    const [isShowingResult, setIsShowingResult] = useState(false)
    const init = () => {
        setIsValidAmount(false)
        setBetAmount(0)
        setIsWin(false)
        setIsLoading(false)
        setIsClaiming(false)
        setIsClaimed(false)
        setSelectBet('')
        setIsValidAmount(false)
        setDestiny(0)
        setIsEndedBet(false)
        setIsShowingResult(false)
        setReturningAmount(BigNumber.from(0))
    }

    useEffect(() => {
        init()
    }, [account, isOpen])

    const closeModal = () => {
        if (!isLoading) {
            handleClose()
        }
    }

    const checkRoshambo = (result:number, userBet:number) => {
        if (result === 1 && userBet === 2 || result === 2 && userBet === 3 || result === 3 && userBet === 1) return true
        return false
    }

    const setPlaceRoshamboBetSuccess = (destiny: number, returning: BigNumber, burnt: BigNumber) => {
        setDestiny(destiny)
        setReturningAmount(returning)
        setBurnAmount(burnt)
        setIsShowingResult(true)
        updateOrbitPlayStats()
        console.log(destiny, returning, Number(selectedBet), burnt)
        if (checkRoshambo(destiny, Number(selectedBet))) {
            setIsWin(true)
        } else {
            setIsWin(false)
        }
        setTimeout(() => {
            setIsShowingResult(false)
            setIsEndedBet(true)
        }, 4000)
    }

    const setRoshamboClaimSuccess = () => {
        setIsClaimed(true)
    }

    const onBetAmountInputChange = (val: any) => {
        if (Number(val) !== NaN) setBetAmount(Number(val))
        else setBetAmount(0)
        if (Number(val) !== NaN) setBetAmount(Number(val))
        else setBetAmount(0)
        if (Number(val) >= Roshambo_MinBet && Number(val) <= Roshambo_MaxBet) {
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
                header={"Rock, Paper, Scissors"}
                handleClose={closeModal}
            >
                <div className='m-4 md:m-6 min-w-[300px]'>
                    <div className='flex flex-col lg:flex-row justify-center gap-6 lg: gap-8 items-stretch'>
                        <div className='flex flex-col w-full lg:w-[450px] max-w-[480px] gap-6'>
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full">
                                <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                    <span>Times played</span>
                                </div>
                                <div className="text-xl text-white">{roshamboInfo?.timesPlayed.toLocaleString()}</div>
                            </div>
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full">
                                <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                    <span>ORBIT paid out</span>
                                </div>
                                <div className="text-xl text-white">{formatEther(roshamboInfo?.paidOut, orbitDecimals, 2)}</div>
                            </div>
                            <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full">
                                <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                    <span>ORBIT burnt</span>
                                </div>
                                <div className="text-xl text-white">{formatEther(roshamboInfo?.burnt, orbitDecimals, 2)}</div>
                            </div>
                        </div>
                        <div className="flex-1 rounded-2xl bg-[#001926] p-4 w-full lg:w-[460px] max-w-[480px] ">
                            {!isEndedBet && !isLoading && !isShowingResult && <>
                                <div className='text-white text-[32px] mb-4'>Place your bet</div>
                                <div className='flex flex-col'>
                                    <div className='text-[15px] lg:text-[16px] text-white font-light'>
                                        Minimum Bet:{' '}<span className='text-app-primary font-normal'>{`${Roshambo_MinBet.toLocaleString()} ORBIT`}</span>
                                    </div>
                                    <div className='text-[15px] lg:text-[16px] text-white font-light'>
                                        Maximum Bet:{' '}<span className='text-app-primary font-normal'>{`${Roshambo_MaxBet.toLocaleString()} ORBIT`}</span>
                                    </div>
                                    <div className='text-[15px] lg:text-[16px] text-white font-light'>
                                        Returns:{' '}<span className='text-app-primary font-normal'>{`BET + 200% `}</span>{`(Bet 100 ORBIT win 300)`}
                                    </div>
                                </div>
                                <div className="flex gap-4 my-3 w-full">
                                    <div className="basis-1/2">
                                        <BetAmountInput onChange={onBetAmountInputChange} />
                                    </div>
                                    <div className="basis-1/2">
                                        <BetSelectBox selectedBet={selectedBet}
                                            betlist={[{ label: 'Rock', value: 1 }, { label: 'Paper', value: 2 }, { label: 'Scissors', value: 3 }]}
                                            placeholder="Select your gesture"
                                            onSelectBet={onSelectBet}
                                        />
                                    </div>
                                </div>
                                <PlaceActions
                                    playType={4}
                                    amount={parseEther(betAmount, orbitDecimals)}
                                    betNumber={Number(selectedBet)}
                                    isLoading={isLoading}
                                    ORBIT_TOKEN={OrbtTokenAddress}
                                    isOpen={isOpen}
                                    isValidAmount={isValidAmount}
                                    placeString={"Place RockPaperScissors"}
                                    setPlaceBetSuccess={setPlaceRoshamboBetSuccess}
                                    setIsLoading={setIsLoading}
                                />
                            </>}                            
                            {!isEndedBet && (isLoading || isShowingResult) &&
                                <div className='flex flex-col gap-6 justify-center items-center h-full w-full'>
                                    <div className='text-white text-[26px] md:text-[32px] text-center'>
                                        Picking gesture
                                    </div>
                                    <Roshambo destiny={destiny} isSpin={isLoading} />
                                    <div className='text-white text-[15px] font-light whitespace-normal text-center'>
                                        Gesture will be switching until the blockchain <br />confirms your transaction...
                                    </div>
                                </div>}
                            {isEndedBet && isWin && <>
                                <div className='flex flex-col gap-6 justify-center items-center h-full w-full'>
                                    <WinInBetIcon />
                                    <div className='text-white text-[28px] lg:text-[32px]'>
                                        Winner!
                                    </div>
                                    {isClaimed ? <>
                                        <div className='text-white text-[15px] font-light whitespace-normal text-center'>
                                            {`You have been collected ${formatEther(returningAmount, orbitDecimals, 2)} ORBIT`}
                                        </div>
                                        <Button
                                            variant="contained"
                                            sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                                            onClick={init}
                                        >
                                            Play Again
                                        </Button>
                                    </> : <>
                                        <div className='text-white text-[15px] font-light whitespace-normal text-center'>
                                            {`Congratulations, you won ${formatEther(returningAmount, orbitDecimals, 2)} ORBIT`}
                                        </div>
                                        <ClaimActions
                                            playType={4}
                                            isClaiming={isClaiming}
                                            setClaimSuccess={setRoshamboClaimSuccess}
                                            setIsClaiming={setIsClaiming}
                                        />
                                    </>}

                                </div>
                            </>}
                            {isEndedBet && !isWin && <>
                                <div className='flex flex-col gap-6 justify-center items-center h-full w-full'>
                                    <LossInBetIcon />
                                    <div className='text-white text-[28px] lg:text-[32px]'>
                                        Better luck next time
                                    </div>
                                    <div className='text-white text-[15px] font-light whitespace-normal text-center'>
                                        {`You lost your bet of ${betAmount} ORBIT.`}<br />
                                        {`${formatEther(burnAmount, orbitDecimals, 2)} ORBIT has been burnt.`}
                                    </div>
                                    <Button
                                        variant="contained"
                                        sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                                        onClick={init}
                                    >
                                        Play Again
                                    </Button>
                                </div>
                            </>}
                        </div>
                    </div>
                </div>
            </Modal >
        </div >
    )
}
