import InputBoxContainer from './InputBoxContainer'

interface InputBoxProps {
    value: any
    onChange: (val: any) => void
    handleFocus: () => void
    handleBlur: () => void
}

export default function SwapQtyInputBox({ value, onChange, handleFocus, handleBlur }: InputBoxProps) {
    return (
        <InputBoxContainer>
            <input
                type="text"
                className="bg-[#06111C] text-white text-[24px] rounded-md block w-full p-0 focus:outline-none"
                placeholder="0.0"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(event) => {
                    if (isNaN(Number(event.target.value))) onChange(0)
                    else onChange(event.target.value)
                }
                }
                value={Number(value) === 0 || isNaN(Number(value)) ? '' : Number(value)}
                required={true}
            />
        </InputBoxContainer>
    )
}