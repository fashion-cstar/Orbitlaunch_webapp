import React, { useMemo, useState, useEffect, useRef, useCallback, memo } from 'react'
import useInterval from 'src/state/useInterval'

function SpinAnimate({ isSpin, destiny }: { isSpin: boolean, destiny: number }) {
    const faces = 6;
    const [diceFace, setDiceFace] = useState(1);
    const [rolling, setRolling] = useState(false)
    const [prevFace, setPrevFace] = useState(0)
    const [list, setList] = useState<string[]>(["$100", "$500", "$9,999", "$1"])
    const [radius, setRadius] = useState(75)
    const [rotate, setRotate] = useState(0)
    const [easeOut, setEaseOut] = useState(0)
    const [angle, setAngle] = useState(0)
    const [top, setTop] = useState(null)
    const [offset, setOffset] = useState(null)
    const [net, setNet] = useState(null)
    const [result, setResult] = useState(null)
    const [spinning, setSpinning] = useState(false)
    
    const renderWheel = () => {
        // determine number/size of sectors that need to created
        let numOptions = list.length;
        let arcSize = (2 * Math.PI) / numOptions;
        this.setState({
            angle: arcSize
        });

        // get index of starting position of selector
        this.topPosition(numOptions, arcSize);

        // dynamically generate sectors from state list
        let angle = 0;
        for (let i = 0; i < numOptions; i++) {
            let text = list[i];
            this.renderSector(i + 1, text, angle, arcSize, this.getColor());
            angle += arcSize;
        }
    }

    const topPosition = (num, angle) => {
        // set starting index and angle offset based on list length
        // works upto 9 options
        let topSpot = null;
        let degreesOff = null;
        if (num === 9) {
            topSpot = 7;
            degreesOff = Math.PI / 2 - angle * 2;
        } else if (num === 8) {
            topSpot = 6;
            degreesOff = 0;
        } else if (num <= 7 && num > 4) {
            topSpot = num - 1;
            degreesOff = Math.PI / 2 - angle;
        } else if (num === 4) {
            topSpot = num - 1;
            degreesOff = 0;
        } else if (num <= 3) {
            topSpot = num;
            degreesOff = Math.PI / 2;
        }

        this.setState({
            top: topSpot - 1,
            offset: degreesOff
        });
    };

    const renderSector = (index, text, start, arc, color) => {
        // create canvas arc for each list element
        let canvas: any = document.getElementById("wheel");
        let ctx = canvas.getContext("2d");
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let rad = radius;
        let startAngle = start;
        let endAngle = start + arc;
        let angle = index * arc;
        let baseSize = rad * 3.33;
        let textRadius = baseSize - 150;

        ctx.beginPath();
        ctx.arc(x, y, rad, startAngle, endAngle, false);
        ctx.lineWidth = rad * 2;
        ctx.strokeStyle = color;

        ctx.font = "17px Arial";
        ctx.fillStyle = "black";
        ctx.stroke();

        ctx.save();
        ctx.translate(
            baseSize + Math.cos(angle - arc / 2) * textRadius,
            baseSize + Math.sin(angle - arc / 2) * textRadius
        );
        ctx.rotate(angle - arc / 2 + Math.PI / 2);
        ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
        ctx.restore();
    }

    const getColor = () => {
        // randomly generate rbg values for wheel sectors
        let r = Math.floor(Math.random() * 255);
        let g = Math.floor(Math.random() * 255);
        let b = Math.floor(Math.random() * 255);
        return `rgba(${r},${g},${b},0.4)`;
    }

    const spin = () => {
        // set random spin degree and ease out time
        // set state variables to initiate animation
        // let randomSpin = Math.floor(Math.random() * 900) + 500;
        let randomSpin = 360;
        this.setState({
            rotate: randomSpin,
            easeOut: 2,
            spinning: true
        });

        // calcalute result after wheel stops spinning
        setTimeout(() => {
            this.getResult(randomSpin);
        }, 2000);
    };

    const getResult = (spin) => {
        // find net rotation and add to offset angle
        // repeat substraction of inner angle amount from total distance traversed
        // use count as an index to find value of result from state list
        const { angle, top, offset, list } = this.state;
        let netRotation = ((spin % 360) * Math.PI) / 180; // RADIANS
        let travel = netRotation + offset;
        let count = top + 1;
        while (travel > 0) {
            travel = travel - angle;
            count--;
        }
        let result;
        if (count >= 0) {
            result = count;
        } else {
            result = list.length + count;
        }

        // set state variable to display result
        this.setState({
            net: netRotation,
            result: result
        });
    };

    const reset = () => {
        // reset wheel and result
        this.setState({
            rotate: 0,
            easeOut: 0,
            result: null,
            spinning: false
        });
    };

    useEffect(() => {
        if (isSpin) {
            if (!rolling) {
                setRolling(true)
            }
        } else {
            if (rolling) {
                setRolling(false)
                setDiceStat()
            }
        }
    }, [isSpin])

    const setDiceStat = () => {
        if (destiny > 0) {
            setDiceFace(destiny)
        }
    }
    const updateCallback = useCallback(() => {
        if (destiny > 0) {
            setRolling(false)
            setDiceStat()
        } else {
            let num = 0
            while (true) {
                num = Math.floor(Math.random() * faces) + 1
                if (num != prevFace) break
            }
            setDiceFace(num)
            setPrevFace(num)
        }
    }, [destiny])
    useInterval(updateCallback, rolling ? 400 : null)

    return (
        <div>
            <canvas
                id="wheel"
                width="500"
                height="500"
                style={{
                    WebkitTransform: `rotate(${rotate}deg)`,
                    WebkitTransition: `-webkit-transform ${easeOut}s ease-out`
                }}
            />
        </div>
    )
}

export default memo(SpinAnimate)