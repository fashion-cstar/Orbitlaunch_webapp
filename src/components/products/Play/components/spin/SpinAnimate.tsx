import React, { useMemo, useState, useEffect, useRef, useCallback, memo } from 'react'
import useInterval from 'src/state/useInterval'

const COLORS = ["rgba(255,0,0,0.8)", "rgba(255,255,0,0.8)", "rgba(0,255,0,0.8)", "rgba(0,0,255,0.8)"]
const SPIN_SECS = 1
function SpinAnimate({ isSpin, destiny }: { isSpin: boolean, destiny: number }) {
    const [list, setList] = useState<string[]>(["Red", "Yellow", "Green", "Blue"])
    const [radius, setRadius] = useState(45)
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
        ctx.lineWidth = rad * 2
        ctx.strokeStyle = color

        ctx.font = "17px Arial"
        ctx.fillStyle = "black"
        ctx.stroke()

        ctx.save()
        ctx.translate(
            baseSize + Math.cos(angle - arc / 2) * textRadius,
            baseSize + Math.sin(angle - arc / 2) * textRadius
        )
        ctx.rotate(angle - arc / 2 + Math.PI / 2)
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0)
        ctx.restore()
    }

    useEffect(() => {
        renderWheel()
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
            let rnd = 360 - (Math.random() * 90 + (destiny - 1) * 90)
            console.log(rotate, destiny, rnd)
            setRotate((d) => d + rnd)
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
        <div>
            <canvas
                id="wheel"
                width="300"
                height="300"
                style={{
                    WebkitTransform: `rotate(${rotate}deg)`,
                    WebkitTransition: `-webkit-transform ${easeOut}s ${spinMode}`
                }}
            />
        </div>
    )
}

export default memo(SpinAnimate)