import React, { useMemo, useState, useEffect, useRef, useCallback, memo } from 'react'
import useInterval from 'src/state/useInterval'

function RoshamboAnimate({ isSpin, destiny }: { isSpin: boolean, destiny: number }) {
    const [spinning, setSpinning] = useState(false)
    const [roshamboId, setRoshamboId] = useState(0)

    useEffect(() => {
        if (isSpin) {
            if (!spinning) {
                setSpinning(true)
            }
        }
    }, [isSpin])

    const setSpinPlace = () => {
        if (destiny > 0) {
            setRoshamboId(destiny - 1)
            setSpinning(false)
        }
    }

    const updateCallback = useCallback(() => {
        if (!isSpin && spinning) {
            setSpinPlace()
            return
        }
        if (destiny > 0) {
            setSpinPlace()
        } else {
            setRoshamboId((id: number) => {
                return (id + 1) > 2 ? 0 : id + 1
            })
        }
    }, [destiny, isSpin])
    useInterval(updateCallback, spinning ? 500 : null)

    return (
        <div className='flex justify-center items-center gap-6'>
            <div className='relative'>
                <img className={`grayscale ${roshamboId == 0 ? 'invisible' : 'visible'}`} src="./images/play/rock.png" width="64px" />
                <div className={`absolute left-[-5px] top-[-5px] ${roshamboId == 0 ? 'visible' : 'invisible'}`}>
                    <img src="./images/play/rock.png" width="84px" />
                </div>
            </div>
            <div className='relative'>
                <img className={`grayscale ${roshamboId == 1 ? 'invisible' : 'visible'}`} src="./images/play/paper.png" width="64px" />
                <div className={`absolute left-[-5px] top-[-5px] ${roshamboId == 1 ? 'visible' : 'invisible'}`}>
                    <img src="./images/play/paper.png" width="84px" />
                </div>
            </div>
            <div className='relative'>
                <img className={`grayscale ${roshamboId == 2 ? 'invisible' : 'visible'}`} src="./images/play/scissors.png" width="64px" />
                <div className={`absolute left-[-5px] top-[-5px] ${roshamboId == 2 ? 'visible' : 'invisible'}`}>
                    <img src="./images/play/scissors.png" width="84px" />
                </div>
            </div>
        </div>
    )
}

export default memo(RoshamboAnimate)