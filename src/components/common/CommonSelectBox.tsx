export default function CommonSelectBox({ value, source, onChange }:
    { value: any, source: any, onChange: (val: any) => void }) {

    return (
        <select className='bg-[#001926] text-white text-[16px] rounded-md block w-full p-0 focus:outline-none'>
            {
                source.map((item) => {
                    return <option value={item.value} selected={item.value === value ? true : false}>{item.label}</option>
                })
            }
        </select>
    )
}