export default function TabButton({ isSelected, name, chainName, handleTabClick }: { isSelected: boolean, name: string, chainName: string, handleTabClick: (chainName: string) => void }) {
    return (
        <>
            {isSelected ? (
                <div className="flex text-center text-white items-center bg-black rounded-md text-[16px] h-8 px-4">{name}</div>) : (
                <div className="flex text-center text-[#919699] items-center text-[16px] cursor-pointer h-8 px-4" onClick={() => handleTabClick(chainName)}>{name}</div>)}
        </>
    )
}