export default function PickTierCard({ido, display, onSelectTier}:
    {ido:any, display:string, onSelectTier:(tier:number) => void}){
    const getAllocPercent = (index: number) => {
        return Math.round(Number(ido[`tierAllocation${(index+1)}`])/Number(ido[`tierAllocation1`])*1000)/10
    }
    return (        
        <div className="absolute" style={{display:`${display}`}}>            
            <div className="flex flex-col rounded-2xl items-center justify-between w-[360px] h-[240px] border border-[#112B40] bg-[#001926] p-4 z-10">
                {
                    [0,1,2,3,4,5,6].map((index) => {
                        return (
                            <div key={index} className="flex w-full justify-between cursor-pointer" onClick={() => onSelectTier(index+1)}>                                            
                                <div className="text-white text-[14px]">
                                    {`Tier ${index+1} - ${getAllocPercent(index)}% max allocation`}
                                </div>
                                <div className="text-[#BAB8CC] text-[14px] text-right">
                                    {`${Number(ido.totalRaiseHardCap * getAllocPercent(index)/100).toLocaleString()} ${ido.projectSymbol}`}
                                </div>      
                            </div>                      
                        )                                
                    })
                }   
            </div>
        </div>
    )
}