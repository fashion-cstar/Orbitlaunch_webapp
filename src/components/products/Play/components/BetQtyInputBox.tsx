import InputBoxContainer from 'src/components/common/InputBoxContainer'

interface InputBoxProps {    
    onChange: (val: any) => void
    handleFocus: () => void
    handleBlur: () => void
}

export default function TokenQtyInputBox({ onChange, handleFocus, handleBlur }: InputBoxProps) {
    return (
        <InputBoxContainer>
            <input
                type="text"
                className="bg-[#06111C] text-white text-[16px] lg:text-[18px] rounded-md block w-full p-0 focus:outline-none"
                placeholder="0.0"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(event) => {
                    if (isNaN(Number(event.target.value))) onChange(0)
                    else onChange(event.target.value)
                }
                }                
                required={true}
            />
        </InputBoxContainer>
    )
}