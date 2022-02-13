interface UpcomingCardProps {
    status:string
    symbol:string
    project:string
    chainId:number
    totalRaise:number
    allocationMin:string
    allocationMax:string
    hero:string
    firstCardIndex:number
}

export default function UpcomingCard({status, symbol, project, chainId, totalRaise, allocationMin, allocationMax, hero, firstCardIndex}:UpcomingCardProps) {
    return (        
        <div className="pr-6 inline-block" style={{transform:`translateX(-${firstCardIndex*100}%)`, transition:"transform 500ms ease 0s"}}>
            <div className="rounded-md bg-[#001926] w-[450px] cursor-pointer hover:shadow-md hover:border-slate-400 hover:border">
                <img className="w-full rounded-t-md" src={hero} alt={project} />
                <div className="p-5">
                    <p className="text-gray-500 text-sm uppercase mt-2">${symbol}</p>
                    <p className="text-white text-[24px]">{project}</p>
                    <p className="text-gray-500 text-sm mt-5">Total Raise:{' '}
                        <span className="text-white text-base">${totalRaise.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-500 text-sm my-2">Allocations:{' '}
                        <span className="text-white text-base">{allocationMin==="TBD"?allocationMin:`$${allocationMin} - $${allocationMax}`}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}