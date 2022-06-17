import React, { useMemo, useState, useEffect, useRef, useCallback, memo } from 'react'
import useInterval from 'src/state/useInterval'

function DiceAnimate({ isRoll, destiny }: { isRoll: boolean, destiny: number }) {
    const faces = 6;
    const [diceFace, setDiceFace] = useState(1);
    const [rolling, setRolling] = useState(false)
    const [prevFace, setPrevFace] = useState(0)

    useEffect(() => {
        if (isRoll) {
            if (!rolling) {
                setRolling(true)
            }
        } else {
            if (rolling) {
                setRolling(false)
                setDiceStat()
            }
        }
    }, [isRoll])

    const setDiceStat = () => {
        if (destiny>0){
            setDiceFace(destiny)                        
        }
    }
    const updateCallback = useCallback(() => {        
        if (destiny > 0) {
            setRolling(false)
            setDiceStat()
        } else {
            let num = 0
            while(true){
                num=Math.floor(Math.random() * faces) + 1
                if (num!=prevFace) break
            }
            setDiceFace(num)
            setPrevFace(num)
        }
    }, [destiny])
    useInterval(updateCallback, rolling ? 400 : null)

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

export default memo(DiceAnimate)