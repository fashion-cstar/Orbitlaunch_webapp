import React, { useMemo, useState, useEffect, useRef, useCallback, memo } from 'react'
import useInterval from 'src/state/useInterval'

const COLORS = ["rgba(255,0,0,0.8)", "rgba(255,255,0,0.8)", "rgba(0,255,0,0.8)", "rgba(0,0,255,0.8)"]
const SPIN_SECS = 1
const CAN_WIDTH = 150
function SpinAnimate({ isSpin, destiny }: { isSpin: boolean, destiny: number }) {
    const [list, setList] = useState<string[]>(["Red", "Yellow", "Green", "Blue"])
    const [radius, setRadius] = useState(Math.round(CAN_WIDTH * 0.15))
    const [rotate, setRotate] = useState(0)
    const [spinMode, setSpinMode] = useState("linear")
    const [angle, setAngle] = useState(0)
    const [top, setTop] = useState(null)
    const [offset, setOffset] = useState(null)
    const [spinning, setSpinning] = useState(false)
    const [easeOut, setEaseOut] = useState(1)

    const renderWheel = () => {
        // determine number/size of sectors that need to created
        let numOptions = list.length
        let arcSize = (2 * Math.PI) / numOptions
        setAngle(arcSize)

        // get index of starting position of selector
        topPosition(numOptions, arcSize)

        // dynamically generate sectors from state list
        let angle = 0
        for (let i = 0; i < numOptions; i++) {
            let text = list[i]
            renderSector(i + 1, text, angle, arcSize, COLORS[i])
            angle += arcSize
        }
    }

    const topPosition = (num, angle) => {
        // set starting index and angle offset based on list length
        // works upto 9 options
        let topSpot = null
        let degreesOff = null
        if (num === 9) {
            topSpot = 7
            degreesOff = Math.PI / 2 - angle * 2
        } else if (num === 8) {
            topSpot = 6
            degreesOff = 0
        } else if (num <= 7 && num > 4) {
            topSpot = num - 1
            degreesOff = Math.PI / 2 - angle
        } else if (num === 4) {
            topSpot = num - 1
            degreesOff = 0
        } else if (num <= 3) {
            topSpot = num
            degreesOff = Math.PI / 2
        }

        setTop(topSpot - 1)
        setOffset(degreesOff)
    }

    const renderSector = (index, text, start, arc, color) => {
        // create canvas arc for each list element
        let canvas: any = document.getElementById("wheel")
        let ctx = canvas.getContext("2d")
        let x = canvas.width / 2
        let y = canvas.height / 2
        let rad = radius
        let startAngle = start
        let endAngle = start + arc
        let angle = index * arc
        let baseSize = rad * 3.33
        let textRadius = baseSize - 90

        ctx.beginPath()
        ctx.arc(x, y, rad, startAngle, endAngle, false)
        ctx.lineWidth = 1
        ctx.strokeStyle = color

        ctx.font = "12px Arial"
        ctx.fillStyle = "black"
        ctx.stroke()

        ctx.save()
        ctx.translate(
            baseSize + Math.cos(angle - arc / 2) * textRadius,
            baseSize + Math.sin(angle - arc / 2) * textRadius
        )
        ctx.rotate(angle - arc / 2 + Math.PI / 2)
        ctx.fillText(text, -ctx.measureText(text).width / 2, -40)
        ctx.restore()
    }

    useEffect(() => {
        // renderWheel()
    })
    useEffect(() => {
        if (isSpin) {
            if (!spinning) {
                setSpinning(true)
            }
        }
    }, [isSpin])

    const setSpinPlace = () => {
        if (destiny > 0) {
            let rnd = Math.round(360 - (Math.random() * 90 + (destiny - 1) * 90))
            if (rnd < 10) rnd = 10
            if (rnd > 350) rnd = 350            
            setRotate((d) => d + Math.round(rnd))
            // setSpinMode("ease-out")
            setEaseOut(Math.round(SPIN_SECS * rnd / 360 * 100) / 100)
        }
    }

    const updateCallback = useCallback(() => {
        if (!isSpin && spinning) {
            setSpinning(false)
            setSpinPlace()
            return
        }
        if (destiny > 0) {
            setSpinning(false)
            setSpinPlace()
        } else {
            setRotate((d) => d + 360)
            setSpinMode("linear")
            setEaseOut(SPIN_SECS)
        }
    }, [destiny, isSpin])
    useInterval(updateCallback, spinning ? SPIN_SECS * 1000 : null)

    return (
        <div className='flex justify-center items-center'>
            <div
                style={{
                    WebkitTransform: `rotate(${rotate}deg)`,
                    WebkitTransition: `-webkit-transform ${easeOut}s ${spinMode}`
                }}
            >
                <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="100" fill="#001926" />
                    <path d="M100 200C113.132 200 126.136 197.413 138.268 192.388C150.401 187.362 161.425 179.997 170.711 170.711C179.997 161.425 187.362 150.401 192.388 138.268C197.413 126.136 200 113.132 200 100L120 100C120 102.626 119.483 105.227 118.478 107.654C117.472 110.08 115.999 112.285 114.142 114.142C112.285 115.999 110.08 117.472 107.654 118.478C105.227 119.483 102.626 120 100 120V200Z" fill="#E91E63" />
                    <path d="M4.37114e-06 100C3.79711e-06 113.132 2.58658 126.136 7.61205 138.268C12.6375 150.401 20.0035 161.425 29.2893 170.711C38.5752 179.997 49.5991 187.362 61.7317 192.388C73.8642 197.413 86.8678 200 100 200L100 120C97.3736 120 94.7728 119.483 92.3463 118.478C89.9198 117.472 87.715 115.999 85.8579 114.142C84.0007 112.285 82.5275 110.08 81.5224 107.654C80.5173 105.227 80 102.626 80 100L4.37114e-06 100Z" fill="#FFC107" />
                    <path d="M100 8.74228e-06C86.8678 7.59423e-06 73.8642 2.58658 61.7317 7.61205C49.5991 12.6375 38.5752 20.0035 29.2893 29.2893C20.0035 38.5752 12.6375 49.5991 7.61206 61.7317C2.58659 73.8642 9.3163e-06 86.8678 8.74228e-06 100L80 100C80 97.3736 80.5173 94.7729 81.5224 92.3463C82.5275 89.9198 84.0007 87.715 85.8579 85.8579C87.715 84.0007 89.9198 82.5275 92.3463 81.5224C94.7729 80.5173 97.3736 80 100 80L100 8.74228e-06Z" fill="#8BC34A" />
                    <path d="M200 100C200 86.8678 197.413 73.8642 192.388 61.7316C187.362 49.5991 179.997 38.5752 170.711 29.2893C161.425 20.0035 150.401 12.6375 138.268 7.61204C126.136 2.58657 113.132 -5.51919e-06 100 -4.37114e-06L100 80C102.626 80 105.227 80.5173 107.654 81.5224C110.08 82.5275 112.285 84.0007 114.142 85.8579C115.999 87.715 117.473 89.9198 118.478 92.3463C119.483 94.7728 120 97.3736 120 100L200 100Z" fill="#03A9F4" />
                </svg>
            </div>
            <div>&#9664;</div>
        </div>
    )
}

export default memo(SpinAnimate)