import ChainIcon from "../ChainIcon"
import Link from "next/link";

interface UpcomingCardProps {    
    ido:any
    firstCardIndex:number
    onDetail: (ido:any) => void
}

export default function FeaturedCard({ido, firstCardIndex, onDetail}:UpcomingCardProps) {       
    return (        
        // <Link href={{
        //     pathname: '/pad',
        //     query: { id: "1" },
        //   }}>        
        <div className="pr-6" style={{transform:`translateX(-${firstCardIndex*100}%)`, transition:"transform 500ms ease 0s"}} onClick={()=>onDetail(ido)}>
            <div className="rounded-2xl bg-[#001926] w-[450px] cursor-pointer hover:shadow-md hover:border-slate-400 hover:border">
                <img className="w-full rounded-t-2xl" src={ido.hero} alt={ido.project} />
                <div className="p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase mt-2">${ido.tokenSymbol}</p>
                            <p className="text-white text-[24px]">{ido.project}</p>
                        </div>
                        <div>
                            <ChainIcon chainId={ido.chainId} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-5">Total Raise:{' '}
                        <span className="text-white text-base">${ido.totalRaise.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-500 text-sm my-2">Allocations:{' '}
                        <span className="text-white text-base">{ido.allocationMin==="TBD"?ido.allocationMin:`$${ido.allocationMin} - $${ido.allocationMax}`}</span>
                    </p>
                </div>
            </div>
        </div>
        // </Link>
    )
}