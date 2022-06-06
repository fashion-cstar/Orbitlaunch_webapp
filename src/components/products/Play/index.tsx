import React, { useMemo, useState, useEffect, useRef } from 'react'
import BuyButton from "src/components/common/BuyButton"
import { Button } from "@mui/material"
import Indicators from './components/Indicators'
import CoinFlipIcon from './components/svgs/CoinFlipIcon'
import DiceRollIcon from './components/svgs/DiceRollIcon'
import RockScissorsIcon from './components/svgs/RockScissorsIcon'
import DrawStrawIcon from './components/svgs/DrawStrawIcon'

export default function Play() {

    return (
        <>
            <div className="w-full">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    <h1 className="text-[35px] md:text-[40px] font-medium">OrbitPlay</h1>
                    <BuyButton />
                </div>
                <div className="flex flex-col gap-6 mt-8">
                    <Indicators />
                    <div className="flex flex-col gap-6">
                        <div className='flex flex-col lg:flex-row justify-center gap-6 items-stretch'>
                            <div className='lg:basis-1/2 w-full rounded-2xl bg-[#001926] p-6'>
                                <div className='w-full flex flex-col gap-4 lg:gap-5'>
                                    <CoinFlipIcon />
                                    <div className='text-[22px] lg:text-[24px] text-white'>Coin Flip</div>
                                    <hr style={{ borderColor: "#112B40" }} />
                                    <div className='flex flex-col'>
                                        <div className='text-[16px] lg:text-[18px] text-white font-light'>
                                            Minimum Bet:{' '}<span className='text-app-primary font-normal'>{`${Number('250').toLocaleString()} $ORBIT`}</span>
                                        </div>
                                        <div className='text-[16px] lg:text-[18px] text-white font-light'>
                                            Maximum Bet:{' '}<span className='text-app-primary font-normal'>{`${Number('100000').toLocaleString()} $ORBIT`}</span>
                                        </div>
                                        <div className='text-[16px] text-[#BAB8CC] my-3 font-light'>Payout: 1:1</div>
                                    </div>
                                </div>
                                <div className='my-2'>
                                    <Button
                                        variant="contained"
                                        sx={{ borderRadius: "12px" }}
                                        onClick={() => { }}
                                    >
                                        <span className="text-[16px]">Play Coin Flip</span>
                                    </Button>
                                </div>
                            </div>
                            <div className='lg:basis-1/2 w-full rounded-2xl bg-[#001926] p-6'>
                                <DiceRollIcon />
                            </div>
                        </div>
                        <div className='flex flex-col lg:flex-row justify-center gap-6 items-stretch'>
                            <div className='lg:basis-1/2 w-full rounded-2xl bg-[#001926] p-6'>
                                <RockScissorsIcon />
                            </div>
                            <div className='lg:basis-1/2 w-full rounded-2xl bg-[#001926] p-6'>
                                <DrawStrawIcon />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}