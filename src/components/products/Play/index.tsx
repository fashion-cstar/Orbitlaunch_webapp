import React, { useMemo, useState, useEffect, useRef } from 'react'
import BuyButton from "src/components/common/BuyButton"
import { Button } from "@mui/material"
import Indicators from './components/Indicators'
import CoinFlipIcon from './components/svgs/CoinFlipIcon'
import DiceRollIcon from './components/svgs/DiceRollIcon'
import RockScissorsIcon from './components/svgs/RockScissorsIcon'
import SpinWheelIcon from './components/svgs/SpinWheelIcon'
import {
    CoinFlip_MinBet,
    CoinFlip_MaxBet,
    DiceRoll_MinBet,
    DiceRoll_MaxBet,
    RockScissors_MinBet,
    RockScissors_MaxBet,
    SpinWheel_MinBet,
    SpinWheel_MaxBet,
} from '@app/shared/PlayConstant';
import DiceRollModal from './components/dice/DiceRollModal'
import CoinFlipModal from './components/coin/CoinFlipModal'
// import {
//     OrbtTokenAddress,
// } from "@app/shared/AppConstant"
import {
    OrbtTokenAddress,
} from "@app/shared/PlayConstant"
import { useToken } from 'src/state/hooks'
import SpinWheelModal from './components/spin/SpinWheelModal'

export default function Play() {
    const [isOpenCoinFlip, setIsOpenCoinFlip] = useState(false)
    const [isOpenDiceRoll, setIsOpenDiceRoll] = useState(false)
    const [isOpenRockScissors, setIsOpenRockScissors] = useState(false)
    const [isOpenSpinWheel, setIsOpenSpinWheel] = useState(false)
    const [orbitDecimals, setOrbitDecimals] = useState(18)
    const userOrbitToken = useToken(OrbtTokenAddress, 'bsc')

    useEffect(() => {
        try {
            if (userOrbitToken) {
                if (userOrbitToken?.decimals) setOrbitDecimals(userOrbitToken?.decimals)
            }
        } catch (error) { }
    }, [userOrbitToken])

    const handelCloseCoin = () => {
        setIsOpenCoinFlip(false)
    }

    const handelCloseDice = () => {
        setIsOpenDiceRoll(false)
    }

    const handelCloseRock = () => {
        setIsOpenRockScissors(false)
    }

    const handelCloseSpin = () => {
        setIsOpenSpinWheel(false)
    }

    return (
        <>
            <DiceRollModal isOpen={isOpenDiceRoll} orbitDecimals={orbitDecimals} handleClose={handelCloseDice} />
            <CoinFlipModal isOpen={isOpenCoinFlip} orbitDecimals={orbitDecimals} handleClose={handelCloseCoin} />
            <SpinWheelModal isOpen={isOpenSpinWheel} orbitDecimals={orbitDecimals} handleClose={handelCloseSpin} />
            <div className="w-full">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <h1 className="text-[35px] md:text-[40px] font-medium">OrbitPlay</h1>
                    <BuyButton />
                </div>
                <div className="flex flex-col gap-6 mt-8">
                    <Indicators orbitDecimals={orbitDecimals} />
                    <div className="flex flex-col gap-6">
                        <div className='flex flex-col lg:flex-row justify-center gap-6 items-stretch'>
                            <div className='lg:basis-1/2 w-full rounded-2xl bg-[#001926] p-6'>
                                <div className='w-full flex flex-col gap-4 lg:gap-5'>
                                    <CoinFlipIcon />
                                    <div className='text-[22px] lg:text-[24px] text-white'>Coin Flip</div>
                                    <hr style={{ borderColor: "#112B40" }} />
                                    <div className='flex flex-col'>
                                        <div className='text-[16px] lg:text-[18px] text-white font-light'>
                                            Minimum Bet:{' '}<span className='text-app-primary font-normal'>{`${CoinFlip_MinBet.toLocaleString()} ORBIT`}</span>
                                        </div>
                                        <div className='text-[16px] lg:text-[18px] text-white font-light'>
                                            Maximum Bet:{' '}<span className='text-app-primary font-normal'>{`${CoinFlip_MaxBet.toLocaleString()} ORBIT`}</span>
                                        </div>
                                        <div className='text-[16px] text-[#BAB8CC] my-3 font-light'>Payout: 1:1</div>
                                    </div>
                                </div>
                                <div className='my-2'>
                                    <Button
                                        variant="contained"
                                        sx={{ borderRadius: "12px" }}
                                        onClick={() => setIsOpenCoinFlip(true)}
                                    >
                                        <span className="text-[16px]">Play Coin Flip</span>
                                    </Button>
                                </div>
                            </div>
                            <div className='lg:basis-1/2 w-full rounded-2xl bg-[#001926] p-6'>
                                <div className='w-full flex flex-col gap-4 lg:gap-5'>
                                    <DiceRollIcon />
                                    <div className='text-[22px] lg:text-[24px] text-white'>Coin Flip</div>
                                    <hr style={{ borderColor: "#112B40" }} />
                                    <div className='flex flex-col'>
                                        <div className='text-[16px] lg:text-[18px] text-white font-light'>
                                            Minimum Bet:{' '}<span className='text-app-primary font-normal'>{`${DiceRoll_MinBet.toLocaleString()} ORBIT`}</span>
                                        </div>
                                        <div className='text-[16px] lg:text-[18px] text-white font-light'>
                                            Maximum Bet:{' '}<span className='text-app-primary font-normal'>{`${DiceRoll_MaxBet.toLocaleString()} ORBIT`}</span>
                                        </div>
                                        <div className='text-[16px] text-[#BAB8CC] my-3 font-light'>Payout: 6:1</div>
                                    </div>
                                </div>
                                <div className='my-2'>
                                    <Button
                                        variant="contained"
                                        sx={{ borderRadius: "12px" }}
                                        onClick={() => setIsOpenDiceRoll(true)}
                                    >
                                        <span className="text-[16px]">Play Coin Flip</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col lg:flex-row justify-center gap-6 items-stretch'>
                            <div className='lg:basis-1/2 w-full rounded-2xl bg-[#001926] p-6'>
                                <RockScissorsIcon />
                            </div>
                            <div className='lg:basis-1/2 w-full rounded-2xl bg-[#001926] p-6'>
                                <div className='w-full flex flex-col gap-4 lg:gap-5'>
                                    <SpinWheelIcon />
                                    <div className='text-[22px] lg:text-[24px] text-white'>Spin the wheel</div>
                                    <hr style={{ borderColor: "#112B40" }} />
                                    <div className='flex flex-col'>
                                        <div className='text-[16px] lg:text-[18px] text-white font-light'>
                                            Minimum Bet:{' '}<span className='text-app-primary font-normal'>{`${SpinWheel_MinBet.toLocaleString()} ORBIT`}</span>
                                        </div>
                                        <div className='text-[16px] lg:text-[18px] text-white font-light'>
                                            Maximum Bet:{' '}<span className='text-app-primary font-normal'>{`${SpinWheel_MaxBet.toLocaleString()} ORBIT`}</span>
                                        </div>
                                        <div className='text-[16px] text-[#BAB8CC] my-3 font-light'>Payout: 4:1</div>
                                    </div>
                                </div>
                                <div className='my-2'>
                                    <Button
                                        variant="contained"
                                        sx={{ borderRadius: "12px" }}
                                        onClick={() => setIsOpenSpinWheel(true)}
                                    >
                                        <span className="text-[16px]">Play Spin the wheel</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}