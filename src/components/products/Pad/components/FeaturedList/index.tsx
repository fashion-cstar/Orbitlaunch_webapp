import FeaturedCard from "./FeaturedCard"
export default function FeaturedList({IdoUpcomingFiltered, cardIndex, onDetail}:
    {IdoUpcomingFiltered:any, cardIndex:number, onDetail:(ido:any) => void}){
    return (
        <div className='overflow-hidden'>
            <div className="mt-4 block whitespace-nowrap overflow-visible relative w-1">
                {IdoUpcomingFiltered.map((item:any, index:number) => {                            
                    return (
                        <div key={index} className='inline-block'>
                            <FeaturedCard ido={item} firstCardIndex={cardIndex} onDetail={onDetail} />
                        </div>
                    )
                })}                    
            </div>
        </div>
    )
}