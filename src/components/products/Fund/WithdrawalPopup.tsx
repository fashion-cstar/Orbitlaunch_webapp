import DepositInput from "@app/components/common/DepositInput";
import Popup from "@app/components/common/Popup";
import { useSnackbar } from "@app/lib/hooks/useSnackbar";
import { OrbitFundContractAddress } from "@app/shared/AppConstant";
import { useEthers } from "@usedapp/core";
import { useState } from "react";

interface WithdrawalPopupProps {
    id: string,
    onWithdrawalSubmit?(event: any, amount: any): void,
    onClose?(): void
}

export default function WithdrawalPopup({
    id,
    onWithdrawalSubmit,
    onClose
}: WithdrawalPopupProps) {
    const snackbar = useSnackbar();
    const { account } = useEthers();
    const [disableWithdrawButton, setDisableWithdrawButton] = useState(true);
    const [withdrawalAmount, setWithdrawAmount] = useState('');
    const selectedWithdrawCurrency = 'BUSD';

    const handleInputChange = (amount: any) => {
        setDisableWithdrawButton(Number(amount) === 0)
        setWithdrawAmount(amount);
    }

    const handleWithdrawalSubmit = async (e: any, amount: any) => {
        // const approveOrbitResult = await approveOrbitStableCoin({ spender: OrbitFundContractAddress, value: amount });
        // if (!approveOrbitResult.ok && !approveOrbitResult.returnedModel) {
        //     snackbar.snackbar.show(approveOrbitResult.message, "error");
        //     return;
        // }

        // const withdrawalResult = await withdraw(amount);
        // if (!withdrawalResult.ok) {
        //     snackbar.snackbar.show(withdrawalResult.message, "error");
        //     return;
        // }

        // snackbar.snackbar.show("Deposit is succesfull", "success");

        // if (onWithdrawalSubmit) {
        //     onWithdrawalSubmit(e, amount);
        // }
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
                            value={withdrawalAmount}
                            onChange={(val) => handleInputChange(val)}
                        />
                    </div>
                    <button
                        className={`w-full bg-[#867EE8] hover:opacity-0.75 font-medium rounded-lg text-sm py-2.5 text-center ${disableWithdrawButton ? 'opacity-25' : ''}`}
                        disabled={disableWithdrawButton}
                        onClick={async (e) => await handleWithdrawalSubmit(e, withdrawalAmount)}
                    >
                        {`Withdraw ${disableWithdrawButton ? '' : `${withdrawalAmount} ${selectedWithdrawCurrency}`}`}
                    </button>
                </div>
            </Popup>
        </>
    );
}