export default function RightArrow({handleRightClick}:{handleRightClick:() => void}) {
    return (
        <div className="cursor-pointer w-6" onClick={handleRightClick}>
            <img src="/images/launchpad/svg/RightArrow.svg" />            
        </div>
    )
}