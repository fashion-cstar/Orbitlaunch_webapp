import React, { useMemo, useState, useEffect, useRef } from 'react'
import QuestionMark from "../svgs/QuestionMark";
import TwitterIcon from "@app/components/svgs/socials/TwitterIcon";
import TelegramIcon from "@app/components/svgs/socials/TelegramIcon";
import MediumIcon from "@app/components/svgs/socials/MediumIcon";
import PickTierCard from "../PickTierCard";
import { Web3ModalButton } from "@app/components/WalletConnect/Web3Modal";
import { Button } from "@mui/material";
import { useEthers } from "@usedapp/core";

export default function Indicators({ ido, launchTokenPrice, currentTierNo, hideTierCard }:
    { ido: any, launchTokenPrice: number, currentTierNo: number, hideTierCard: any }) {

    const activateProvider = Web3ModalButton();
    const { account } = useEthers();
    const [TierCardDisplay, SetShowTierCard] = useState('none')
    const [tier, setTier] = useState(0)
    const [maxAllocation, setMaxAllocation] = useState(0)

    useEffect(() => {
        hideTierCard.current = HideTierCard;
        setTier(currentTierNo)
    }, [currentTierNo])

    useEffect(() => {
        if (launchTokenPrice && account) {
            if (currentTierNo > 0) {
                let max = Number(ido[`tierAllocation${currentTierNo}`]) / launchTokenPrice
                setMaxAllocation(max)
            }
        }
    }, [currentTierNo, account, launchTokenPrice])

    const ShowTierCard = () => {
        if (TierCardDisplay === 'block') {
            SetShowTierCard('none')
        } else {
            SetShowTierCard('block')
        }
    }

    const HideTierCard = () => {
        if (TierCardDisplay === 'block') {
            SetShowTierCard('none')
        }
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col gap-4 xl:flex-row">
                <div className="flex gap-4 flex-col md:flex-row basis-1/2">
                    <div className='flex basis-1/2'>
                        <div className="flex rounded-2xl items-center justify-between bg-[#001926] gap-2 p-4 w-full">

                            {!!account
                                ? (<>
                                    <div className="flex-1 rounded-2xl bg-[#001926]">
                                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                                            <span>{`Tier ${currentTierNo}`}</span>
                                        </div>
                                        <div className="flex w-full justify-between">
                                            <div className="text-xl text-white mr-1">
                                                Max
                                            </div>
                                            <div className="text-xl text-white">
                                                {` ${maxAllocation} ${ido.projectSymbol}`}
                                            </div>
                                        </div>
                                    </div>
                                </>)
                                : (
                                    <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary">
                                        <Button
                                            variant="outlined"
                                            onClick={activateProvider}
                                            className="relative"
                                            sx={{ borderRadius: "12px"}}
                                        >
                                            Connect to view your tier
                                        </Button>
                                    </div>
                                )
                            }
                            <div className="w-6 cursor-pointer" onClick={ShowTierCard}><QuestionMark /></div>
                        </div>
                        <div className="relative hidden sm:block"><PickTierCard ido={ido} launchTokenPrice={launchTokenPrice} display={TierCardDisplay} handleClose={HideTierCard} /></div>
                    </div>
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4 basis-1/2 w-full">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>Website</span>
                        </div>
                        <a href={ido.website} target="_blank" className="text-xl text-white underline break-all">Click Here</a>
                    </div>
                </div>
                <div className="flex gap-4 flex-col md:flex-row  basis-1/2">
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4 basis-1/2 w-full">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>Documents</span>
                        </div>
                        <a href={ido.whitepaper} target="_blank" className="text-xl text-white underline">Whitepaper</a>
                    </div>
                    <div className="flex-1 rounded-2xl bg-[#001926] p-4 basis-1/2 w-full">
                        <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-2">
                            <span>Social media</span>
                        </div>
                        <div className="flex space-x-4 items-center">
                            <a className="w-6" href={ido.twitter} target="_blank"><TwitterIcon /></a>
                            <a className="w-6" href={ido.telegram} target="_blank"><TelegramIcon /></a>
                            <a className="w-6" href={ido.medium} target="_blank"><MediumIcon /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}