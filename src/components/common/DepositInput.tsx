import { useState } from "react";

interface DepositInputProps {
    value: any
    depositCurrencyOptions?: { key: number, value: any, icon: any }[],
    defaultSelectedCurrency?: number,
    inputClass?: any,
    onChange?(amount: any): any
}

export default function DepositInput({
    value,
    defaultSelectedCurrency,
    depositCurrencyOptions,
    inputClass,
    onChange
}: DepositInputProps) {
    const [depositAmount, setDepositAmount] = useState(isNaN(value) ? 0.0 : value);
    const [selectedDepositCurrency, setSelectedDepositCurrency] = useState(defaultSelectedCurrency ?? 0);
    const options = depositCurrencyOptions ?? [{ key: 0, value: 'BUSD', icon: 'BUSD' }];
    const classInput = inputClass ?? 'bg-[#001926] text-gray-400 text-sm';

    const handleChangeAmount = (e: any) => {
        const amount = e.target.value;
        if (isNaN(amount)) {
            return;
        }
        setDepositAmount(amount);

        if (onChange) {
            onChange(amount);
        }
    }

    return (
        <div className={`flex flex-col space-y-4 rounded-lg block w-full p-2.5 ${classInput}`}>
            <div className="flex flex-row">
                <div className="text-xs text-[#867EE8] uppercase font-bold">Amount</div>
            </div>
            <div className="flex flex-row items-center">
                <div className="basis-3/4">
                    <input
                        className="bg-[#001926] text-gray-400 text-sm rounded-lg block w-full p-2.5"
                        placeholder="0.0"
                        onChange={handleChangeAmount}
                        value={depositAmount}
                    />
                </div>
                <div className="basis-1/4 text-center">{options.filter(x => x.key === selectedDepositCurrency)[0]?.icon}</div>
            </div>
        </div >
    );
}