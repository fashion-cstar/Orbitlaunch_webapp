import DepositInput from "@app/components/common/DepositInput";
import Popup from "@app/components/common/Popup";
import theme from "@app/lib/theme";
import { useState } from "react";

interface DepositPopupProps {
    onDepositSubmit(event: any, amount: any): void,
    onClose?(): void
}

export default function DepositPopup({
    onDepositSubmit,
    onClose
}: DepositPopupProps) {
    const [disableDepositButton, setDisableDepositButton] = useState(true);
    const [depositAmount, setDepositAmount] = useState(0.0);

    const handleInputChange = (amount: any) => {
        setDisableDepositButton(Number(amount) === 0)
        setDepositAmount(amount);
    }

    return (
        <Popup
            id="deposit-busd-modal"
            onPopupClose={onClose}
            contentStyles={{ backgroundColor: '#06111C' }}
            mainModalStyles={{ backgroundColor: '#ab949447' }}
        >
            <div className="space-y-3 p-2">
                <div>
                    <DepositInput value={depositAmount} onChange={(val) => handleInputChange(val)} />
                </div>
                <button
                    className={`w-full bg-[#867EE8] hover:opacity-0.75 font-medium rounded-lg text-sm py-2.5 text-center ${disableDepositButton ? 'opacity-25' : ''}`}
                    disabled={disableDepositButton}
                    onClick={(e) => onDepositSubmit(e, depositAmount)}
                >
                    Deposit
                </button>
            </div>
        </Popup>
    );
}