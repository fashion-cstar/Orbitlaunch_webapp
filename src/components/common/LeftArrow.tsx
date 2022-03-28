import RightArrowIcon from "../svgs/RightArrowIcon"
export default function LeftArrow({ handleLeftClick }: { handleLeftClick: () => void }) {
    return (
        <div className="cursor-pointer w-6" onClick={handleLeftClick}>
            <div className="rotate-180"><RightArrowIcon /></div>
        </div>
    )
}