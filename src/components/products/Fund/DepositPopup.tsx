import DepositInput from "@app/components/common/DepositInput";
import Popup from "@app/components/common/Popup";
import useFundWithV3 from "@app/lib/hooks/useFundWithV3";
import useFund_V2 from "@app/lib/hooks/useFund_V2";
import { useSnackbar } from "@app/lib/hooks/useSnackbar";
import { useState } from "react";
import AgreeTermsPopup from "./AgreeTermsPopup";

interface DepositPopupProps {
    id: string,
    version: number,
    onDepositSubmit?(event: any, amount: any): void,
    onClose?(): void
}

export default function DepositPopup({
    id,
    version,
    onDepositSubmit,
    onClose
}: DepositPopupProps) {
    const snackbar = useSnackbar();
    const { userAgreed, depositBusd } = useFund_V2();
    const { userAgreed: userAgreedV3, depositBusd: depositBusdV3 } = useFundWithV3();
    const agreeTermsModalId = "agree-terms-modal";
    const [disableDepositButton, setDisableDepositButton] = useState(true);
    const [depositAmount, setDepositAmount] = useState('');
    const [selectedDepositCurrency, setSelectedDepositCurrency] = useState('BUSD');

    const handleInputChange = (amount: any) => {
        setDisableDepositButton(Number(amount) === 0)
        setDepositAmount(amount);
    }

    const handleSelectedCurrencyChange = (changedCurrency: any) => {

    }

    const deposit = async () => {
        const depositResult = version === 2 ? await depositBusd(depositAmount) : await depositBusdV3(depositAmount);
        if (!depositResult.ok) {
            console.error(depositResult.message);
            return;
        }
    }

    const handleOpenAgreeTermsModal = () => {
        const modal = document.getElementById(agreeTermsModalId);
        modal.style.display = "flex";
    }

    const handleDepositSubmit = async (e: any, amount: any) => {
        const userAgreedResult = version === 2 ? await userAgreed() : await userAgreedV3();
        if (userAgreedResult.ok) {
            //If user agreement has not been done, open the agreement modal
            if (!userAgreedResult.returnedModel) {
                handleOpenAgreeTermsModal();
                return;
            }

            await deposit();
        }
        else {
            snackbar.snackbar.show(userAgreedResult.message, "error");
        }

        if (onDepositSubmit) {
            onDepositSubmit(e, amount);
        }
    }

    return (
        <>
            <Popup
                id={id}
                onPopupClose={onClose}
                title="Deposit BUSD"
            >
                <div className="space-y-3 p-2">
                    <div>
                        <DepositInput
                            value={depositAmount}
                            onChange={(val) => handleInputChange(val)}
                            onSelectedCurrencyChange={(changedCurrency) => handleSelectedCurrencyChange(changedCurrency)}
                        />
                    </div>
                    <button
                        className={`w-full bg-[#867EE8] hover:opacity-0.75 font-medium rounded-lg text-sm py-2.5 text-center ${disableDepositButton ? 'opacity-25' : ''}`}
                        disabled={disableDepositButton}
                        onClick={async (e) => await handleDepositSubmit(e, depositAmount)}
                    >
                        {`Deposit ${disableDepositButton ? '' : `${depositAmount} ${selectedDepositCurrency}`}`}
                    </button>
                </div>
            </Popup>
            <AgreeTermsPopup
                id={agreeTermsModalId}
                version={version}
                onAgreeToTerms={async () => await deposit()}
            />
        </>
    );
}