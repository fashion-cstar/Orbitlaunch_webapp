import React, { useMemo, useState, useEffect, useRef } from 'react'

export default function DiceAnimate({ isRoll, destiny }: { isRoll: boolean, destiny: number }) {
    const faces = 6;    
    const [intrvl, setIntrvl] = useState<any>();
    const [diceFace, setDiceFace] = useState(1);    
    const [rolling, setRolling] = useState(false)

    useEffect(() => {
        if (isRoll) {
            if (!rolling) {
                clearInterval(intrvl);
                const interval = setInterval(() => {
                    setDiceFace(Math.floor(Math.random() * faces) + 1)
                }, 400);
                setIntrvl(interval)
                setRolling(true)
            }
        }

    }, [isRoll])

    useEffect(() => {
        if (destiny>0){   
            setDiceFace(destiny)         
            clearInterval(intrvl)
            setRolling(false)
        }
    }, [destiny])
   
    const dice = (
        <div className="dice-container">
            <div className={`dice face-${diceFace}`}>
                <div className="face-1">
                    <div className="dot-container">
                        <div className="dot"></div>
                    </div>
                </div>
                <div className="face-3">
                    <div className="dot-container">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
                <div className="face-4">
                    <div className="dot-container">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
                <div className="face-2">
                    <div className="dot-container">
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
                <div className="face-5">
                    <div className="dot-container">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
                <div className="face-6">
                    <div className="dot-container">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="main-container">
            <div className="main-dice-container">
                {dice}
            </div>
        </div>
    )
}