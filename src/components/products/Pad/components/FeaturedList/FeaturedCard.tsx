import ChainIcon from "../ChainIcon"
import Link from "next/link";

interface UpcomingCardProps {
    ido: any
    firstCardIndex: number
    onDetail: (ido: any) => void
    options: any
}

export default function FeaturedCard({ ido, firstCardIndex, onDetail, options }: UpcomingCardProps) {

    let bgColor = (!!options && !!options.bgCard) ? options.bgCard : '#001926';
    let width = (!!options && !!options.width) ? options.width : '450px';
    let titleFontSize = (!!options && !!options.titleFontSize) ? options.titleFontSize : '24px';
    let descFontSize = (!!options && !!options.descFontSize) ? options.descFontSize : '16px';

    const styling = {
        backgroundColor: bgColor,
        width
    }

    const titleSize = {
        fontSize: titleFontSize
    }

    const descSize = {
        fontSize: descFontSize
    }

    return (
        // <Link href={{
        //     pathname: '/pad',
        //     query: { id: "1" },
        //   }}>        
        <div className="pr-6" style={{ transform: `translateX(-${firstCardIndex * 100}%)`, transition: "transform 500ms ease 0s" }} onClick={() => onDetail(ido)}>
            <div className="rounded-2xl cursor-pointer hover:shadow-md hover:border-slate-400 hover:border" style={styling}>
                <img className="w-full rounded-t-2xl" src={ido.hero} alt={ido.project} />
                <div className="p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase mt-2">${ido.tokenSymbol}</p>
                            <p className="text-white" style={titleSize}>{ido.project}</p>
                        </div>
                        <div>
                            <ChainIcon chainId={ido.chainId} />
                        </div>
                    </div>
                    <p className="text-gray-500 mt-5" style={descSize}>Total Raise:{' '}
                        <span className="text-white">${ido.totalRaise.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-500 my-2" style={descSize}>Allocations:{' '}
                        <span className="text-white">{ido.allocationMin === "TBD" ? ido.allocationMin : `$${ido.allocationMin} - $${ido.allocationMax}`}</span>
                    </p>
                </div>
            </div>
        </div>
        // </Link>
    )
}