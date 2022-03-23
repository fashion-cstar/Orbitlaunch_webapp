export default function TabButton({ isSelected, name, tabIndex, handleTabClick }: { isSelected: boolean, name: string, tabIndex: number, handleTabClick: (tabIndex: number) => void }) {
    return (
        <>
            {isSelected ? (
                <div className="flex text-center text-[#00D98D] items-center bg-[#00D98D]/[.16] rounded-md text-[16px] h-8 px-4">{name}</div>) : (
                <div className="flex text-center text-[#00D98D] items-center text-[16px] cursor-pointer h-8 px-4" onClick={() => handleTabClick(tabIndex)}>{name}</div>)}
        </>
    )
}