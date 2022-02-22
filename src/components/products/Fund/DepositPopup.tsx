import DepositInput from "@app/components/common/DepositInput";
import Popup from "@app/components/common/Popup";
import { approveBusd, depositBusd, userAgreed } from "@app/lib/contract/abis/consumers/busdContractConsumer";
import { useSnackbar } from "@app/lib/hooks/useSnackbar";
import { orbitFundMockAccountAddress, orbitFundMockContractddress } from "@app/shared/AppConstant";
import { useState } from "react";
import AgreeTermsPopup from "./AgreeTermsPopup";

interface DepositPopupProps {
    id: string,
    onDepositSubmit?(event: any, amount: any): void,
    onClose?(): void
}

export default function DepositPopup({
    id,
    onDepositSubmit,
    onClose
}: DepositPopupProps) {
    const snackbar = useSnackbar();
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
        const approveBusdResult = await approveBusd({ spender: orbitFundMockContractddress, value: depositAmount });
        if (!approveBusdResult.ok && !approveBusdResult.returnedModel) {
            snackbar.snackbar.show(approveBusdResult.message, "error");
            return;
        }

        const depositResult = await depositBusd({ amount: depositAmount });
        if (!depositResult.ok) {
            snackbar.snackbar.show(depositResult.message, "error");
            return;
        }

        snackbar.snackbar.show("Deposit is succesfull", "success");
    }

    const handleOpenAgreeTermsModal = () => {
        const modal = document.getElementById(agreeTermsModalId);
        modal.style.display = "flex";
    }

    const handleDepositSubmit = async (e: any, amount: any) => {
        const userAgreedResult = await userAgreed({ address: orbitFundMockAccountAddress });
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
                onAgreeToTerms={async () => await deposit()}
            />
        </>
    );
}