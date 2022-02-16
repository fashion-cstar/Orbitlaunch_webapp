import GoBackIcon from "@app/components/products/Pad/components/svgs/GoBackIcon"
export default function GoBack({handleClick}:{handleClick:()=>void}) {
    return (
        <div className="cursor-pointer flex" onClick={handleClick}>
            <div className="w-6"><GoBackIcon /></div>
            <p className="text-[#919699] text-[16px]">Go Back</p>
        </div>
    )
}