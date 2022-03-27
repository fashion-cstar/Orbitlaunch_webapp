import CommonSelectBox from 'src/components/common/CommonSelectBox'

interface SelectBoxProps {
    name: string
    value: any
    source: any
    onChange: (val: any) => void 
}

export default function SelectBox({ name, value, source, onChange }: SelectBoxProps) {

    return (
        <div className="flex-1 rounded-2xl bg-[#001926] py-4 px-6">

            <div className="flex items-center space-x-3 text-[12px] font-bold uppercase text-app-primary mb-2">
                <span>{name}</span><span className='text-[#ff0000]'>*</span>
            </div>
            <CommonSelectBox value={value} source={source} onChange={onChange} />            
        </div>
    )
}