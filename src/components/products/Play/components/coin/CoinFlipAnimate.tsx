import React, { useMemo, useState, useEffect, useRef, useCallback, memo } from 'react'
import useInterval from 'src/state/useInterval'

function CoinFlipAnimate({ isRoll, destiny }: { isRoll: boolean, destiny: number }) {
    const [rolling, setRolling] = useState(false)
    const [flipClassName, setFlipClassName] = useState("")

    useEffect(() => {
        if (isRoll) {
            if (!rolling) {
                setRolling(true)
            }
        }
    }, [isRoll])

    const setCoinFace = () => {
        if (destiny > 0) {
            if (destiny == 1) {
                if (flipClassName == "tails") setFlipClassName("heads")
            } else {
                if (flipClassName == "heads") setFlipClassName("tails")
            }
        }
    }

    const updateCallback = useCallback(() => {
        if (!isRoll && rolling) {
            setRolling(false)
            setCoinFace()
            return
        }
        if (destiny > 0) {
            setRolling(false)
            setCoinFace()
        } else {
            if (flipClassName === "") {
                setFlipClassName("tails")
            } else {
                if (flipClassName === "heads") {
                    setFlipClassName("tails")
                } else {
                    setFlipClassName("heads")
                }
            }
        }
    }, [flipClassName, destiny, isRoll])
    useInterval(updateCallback, rolling ? 400 : null)

    return (
        <div>
            <div id="coin" className={`${flipClassName}`} key={+new Date()}>
                <div className="flex justify-center items-center side-a">
                    <h2>HEAD</h2>
                </div>
                <div className="flex justify-center items-center side-b">
                    <h2>TAIL</h2>
                </div>
            </div>
        </div>
    )
}

export default memo(CoinFlipAnimate)