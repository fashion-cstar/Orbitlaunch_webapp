export default function LeftArrow({handleLeftClick}:{handleLeftClick:()=>void}) {
    return (
        <div className="cursor-pointer" onClick={handleLeftClick}>
            <img className="rotate-180 w-6" src="/images/launchpad/svg/RightArrow.svg" />            
        </div>
    )
}