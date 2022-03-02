export default function PickTierCard({ido, launchTokenPrice, display, handleClose}:
    {ido:any, launchTokenPrice:number, display:string, handleClose: () => void}){
    const getAllocPercent = (index: number) => {
        return Math.round(Number(ido[`tierAllocation${(index+1)}`])/Number(ido[`tierAllocation1`])*1000)/10
    }
    return (        
        <div className="absolute" style={{display:`${display}`}} >                        
            <div className="flex flex-col rounded-2xl items-center justify-between w-[360px] h-[240px] border border-[#112B40] bg-[#001926] p-4 z-10" onClick={handleClose}>
                {
                    [0,1,2,3,4,5,6].map((index) => {
                        return (
                            <div key={index} className="flex w-full justify-between cursor-pointer">                                            
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
            <div className="w-screen h-screen bg-white fixed left-0 top-0 opacity-0" style={{display: display}} onClick={handleClose}></div>    
        </div>
    )
}