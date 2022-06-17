import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import useInterval from 'src/state/useInterval'

export default function CoinFlipAnimate({ isRoll, destiny }: { isRoll: boolean, destiny: number }) {    
    const [rolling, setRolling] = useState(false)
    const [flipClassName, setFlipClassName] = useState("")

    useEffect(() => {
        if (isRoll) {
            if (!rolling) {
                setRolling(true)
            }
        } else {
            if (rolling) {
                setRolling(false)
            }
        }
    }, [isRoll])

    const updateCallback = useCallback(() => {
        if (destiny > 0) {            
            setRolling(false)
            if (destiny == 1) {
                if (flipClassName == "tails") setFlipClassName("heads")
            } else {
                if (flipClassName == "heads") setFlipClassName("tails")
            }                        
        } else {            
            if (flipClassName === "") {
                setFlipClassName("heads")
            } else {
                if (flipClassName === "heads") {
                    setFlipClassName("tails")
                } else {
                    setFlipClassName("heads")
                }
            }
        }
    }, [flipClassName, destiny])
    useInterval(updateCallback, rolling ? 400 : null)

    return (
        <div>
            <div id="coin" className={`${flipClassName}`} key={+new Date()}>
                <div className="flex justify-center items-center side-a">
                    <h2>TAIL</h2>
                </div>
                <div className="flex justify-center items-center side-b">
                    <h2>HEAD</h2>
                </div>
            </div>
        </div>
    )
}