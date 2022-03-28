import { useEffect, useState } from "react";
import RightArrow from './RightArrow';
import LeftArrow from './LeftArrow';
import { ethers } from "ethers";

interface SliderCardsProps {
    cardInformationList: {
        tierNo:number,
        requiredTokens:ethers.BigNumber,
        shownRequiredTokens:string,
        monthlyPercent:string
    }[]
    selectedCardIndex: number
}

const styleCircle = {
    width: "40px",
    height: "40px",
    left: "47px",
    top: "0px",
    borderRadius: "50%"
}

export default function SliderCards({ cardInformationList, selectedCardIndex }: SliderCardsProps) {
    const [cardIndex, setCardIndex] = useState(selectedCardIndex ?? 0);

    const handleLeftClick = () => {
        if (cardIndex === 0) {
            return;
        }

        setCardIndex(cardIndex - 1);
    }

    const handleRightClick = () => {
        if (cardIndex === cardInformationList.length - 1) {
            return;
        }

        setCardIndex(cardIndex + 1);
    }

    useEffect(() => {
        const currentSelectedCardIndex = selectedCardIndex < 0 ? 0 : selectedCardIndex;
        setCardIndex(currentSelectedCardIndex);
    }, [selectedCardIndex])

    return (
        <>
            <div className='overflow-hidden'>
                <div className="mt-4 block whitespace-nowrap overflow-visible relative w-1">
                    {cardInformationList?.map((info: any, index: number) => {
                        return (
                            <div key={index} className='inline-block'>
                                <div className="pr-4 inline-block" style={{ transform: `translateX(-${cardIndex * 100}%)`, transition: "transform 500ms ease 0s" }}>
                                    <div
                                        className='rounded-2xl bg-[#001926] w-[320px] h-[200px] flex-col justify-center items-start'
                                        style={{
                                            border: `${selectedCardIndex === index ? '1px solid #867EE8' : 'none'}`,
                                            background: `${selectedCardIndex === index ? 'linear-gradient(90deg, rgba(134, 126, 232, 0.156) 0%, rgba(134, 126, 232, 0) 100%), linear-gradient(0deg, #06111C, #06111C)' : '#06111C'}`
                                        }}
                                    >
                                        <div className={'flex-1 items-center rounded-2xl p-10'}>
                                            <div className="space-y-2">
                                                <div className="flex items-center text-l text-white mb-4">
                                                    <span>Tier &nbsp;</span>
                                                    <div style={styleCircle} className="flex items-center justify-center bg-[#c9e2fa] text-[#3984d5] text-xl text-bold">
                                                        {info.tierNo}
                                                    </div>
                                                </div>
                                                <div className="items-center text-xs text-white mb-2">
                                                    Requires {info.shownRequiredTokens} M31
                                                </div>
                                                <div className="items-center text-xs text-white mb-2">
                                                    Up to {info.monthlyPercent}% Monthly
                                                </div>
                                                <div className="items-center text-xs text-white mb-2">{/* text-slate-400 */}
                                                    Return on Investment
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className='flex justify-center mt-4'>
                <div className="flex flex-row gap-4">
                    <LeftArrow handleLeftClick={handleLeftClick} />
                    <RightArrow handleRightClick={handleRightClick} />
                </div>
            </div>
        </>
    )
}