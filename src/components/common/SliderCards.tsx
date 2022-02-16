import { useState } from "react";
import LeftArrow from "../products/Pad/components/LeftArrow";
import RightArrow from "../products/Pad/components/RightArrow";

interface UpcomingCardProps {
    cardInformationList: any
    firstCardIndex: number
}

const styleCircle = {
    // position: "static",
    width: "40px",
    height: "40px",
    left: "47px",
    top: "0px",
    borderRadius: "50%",
    display: "inline-block"
}

export default function UpcomingCard({ cardInformationList, firstCardIndex }: UpcomingCardProps) {
    const [cardIndex, setCardIndex] = useState(0);

    const handleLeftClick = () => {
        if (cardIndex > 0) {
            setCardIndex(cardIndex - 1)
        }
        else {
            setCardIndex(cardInformationList.length - 1)
        }
    }

    const handleRightClick = () => {
        if (cardIndex > 0) {
            setCardIndex(cardIndex - 1)
        }
        else {
            setCardIndex(cardInformationList.length - 1)
        }
    }

    return (
        <div className="inline-block" style={{ transform: `translateX(-${firstCardIndex * 100}%)`, transition: "transform 500ms ease 0s" }}>
            {cardInformationList?.map((info) => {
                return (
                    <div className="flex items-center rounded-2xl bg-[#06111C] p-5">
                        <div className="items-center text-center space-y-3 pt-4">
                            <div className="items-center text-l text-white mb-2">
                                Tier &nbsp;
                                <span style={styleCircle} className="items-center bg-[#c9e2fa] text-[#3984d5] text-bold">
                                    {info.tierNo}
                                </span>
                            </div>
                            <div className="items-center text-xs text-white mb-2">
                                Requires {info.requiredTokens} M31
                            </div>
                            <div className="items-center text-xs text-white mb-2">
                                Up to {info.monthlyPercent}% Monthly
                            </div>
                            <div className="items-center text-xs text-white mb-2">{/* text-slate-400 */}
                                Return on Investment
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className="flex flex-col space-x-2 items-center">
                <div className="flex flex-row space-x-2 mt-4">
                    <div className="flex-1">
                        <LeftArrow handleLeftClick={handleLeftClick} />
                    </div>
                    <div className="flex-1">
                        <RightArrow handleRightClick={handleRightClick} />
                    </div>
                </div>
            </div>
        </div>
    )
}