export default function SelectBox({name, value, source, onChange}:
    {name:string, value:any, source:any, onChange:(val:any) => void}){
   
    return (
        <div className="flex-1 rounded-2xl bg-[#001926] py-4 px-6">
            
            <div className="flex items-center space-x-3 text-[12px] font-bold uppercase text-app-primary mb-2">
                <span>{name}</span><span className='text-[#ff0000]'>*</span>
            </div>
            <select className='bg-[#001926] text-white text-[16px] rounded-lg block w-full p-0 focus:outline-none'>
                {
                    source.map((item) => {
                        return <option value={item.value} selected={item.value===value?true:false}>{item.label}</option>
                    })
                }                                
            </select>
        </div>
    )
}