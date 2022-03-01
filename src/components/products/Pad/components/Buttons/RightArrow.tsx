import RightArrowIcon from "../svgs/RightArrowIcon"
export default function RightArrow({handleRightClick}:{handleRightClick:() => void}) {
    return (
        <div className="cursor-pointer w-6" onClick={handleRightClick}>
            <RightArrowIcon />            
        </div>
    )
}