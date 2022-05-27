import DepositInput from "@app/components/common/DepositInput";
import Popup from "@app/components/common/Popup";
import useFundWithV3 from "@app/lib/hooks/useFundWithV3";
import useFundWithV4 from "@app/lib/hooks/useFundWithV4";
import useFund_V2 from "@app/lib/hooks/useFund_V2";
import { useSnackbar } from "@app/lib/hooks/useSnackbar";
import { useEffect, useState } from "react";
import AgreeTermsPopup from "./AgreeTermsPopup";
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from 'src/components/common/Modal';

interface DepositPopupProps {
    version: number,
    isOpen: boolean,
    handleClose: () => void,
}

export default function DepositPopup({
    version,
    isOpen,
    handleClose,
}: DepositPopupProps) {
    const snackbar = useSnackbar();
    const { userAgreed, depositBusd, isWalletApproving: isApprovingV2, isDepositing: isDepositingV2 } = useFund_V2();
    const { userAgreed: userAgreedV3, depositBusd: depositBusdV3, isWalletApproving: isApprovingV3, isDepositing: isDepositingV3 } = useFundWithV3();
    const { userAgreed: userAgreedV4, depositBusd: depositBusdV4, isWalletApproving: isApprovingV4, isDepositing: isDepositingV4 } = useFundWithV4();
    const agreeTermsModalId = "agree-terms-modal";
    const [disableDepositButton, setDisableDepositButton] = useState(true);
    const [depositAmount, setDepositAmount] = useState('');
    const [selectedDepositCurrency, setSelectedDepositCurrency] = useState('BUSD');
    const [isWalletApproving, setIsWalletApproving] = useState(false)
    const [isDepositing, setIsDepositing] = useState(false)

    const handleInputChange = (amount: any) => {
        setDisableDepositButton(Number(amount) === 0)
        setDepositAmount(amount);
    }

    const handleSelectedCurrencyChange = (changedCurrency: any) => {

    }

    useEffect(() => {        
        setDepositAmount('')
    }, [isOpen])

    useEffect(() => {
        switch (version) {
            case 2:
                setIsWalletApproving(isApprovingV2)
                setIsDepositing(isDepositingV2)
                break;
            case 4:
                setIsWalletApproving(isApprovingV4)
                setIsDepositing(isDepositingV4)
                break;
            default:
                setIsWalletApproving(isApprovingV3)
                setIsDepositing(isDepositingV3)
                break;
        }
    }, [isApprovingV2, isApprovingV3, isApprovingV4, isDepositingV2, isDepositingV3, isDepositingV4])

    const deposit = async () => {
        const depositResult = version === 2 ? await depositBusd(depositAmount) : version === 4 ? await depositBusdV4(depositAmount) : await depositBusdV3(depositAmount);
        if (!depositResult.ok) {
            snackbar.snackbar.show(depositResult.message, "error");
            console.error(depositResult.message);
            return;
        } else {
            snackbar.snackbar.show(`${depositAmount} ${selectedDepositCurrency} has been deposited successfully!`, "success");
            handleClose()
        }
    }

    const handleCloseAgreeTermsModal = () => {
        const modal = document.getElementById(agreeTermsModalId);
        modal.style.display = "none";
    }

    const handleOpenAgreeTermsModal = () => {
        const modal = document.getElementById(agreeTermsModalId);
        modal.style.display = "flex";
    }

    const handleDepositSubmit = async (e: any, amount: any) => {
        const userAgreedResult = version === 2 ? await userAgreed() : version === 4 ? await userAgreedV4() : await userAgreedV3();
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
    }

    const closeModal = () => {
        if (!(isDepositing || isWalletApproving)) {
            handleClose()
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                header="Deposit BUSD"
                handleClose={closeModal}
            >
                <div className='m-4 md:m-6 min-w-[300px]'>
                    <div className='flex flex-col w-full lg:w-[430px] max-w-[460px] gap-4'>
                        <div>
                            <DepositInput
                                value={depositAmount}
                                onChange={(val) => handleInputChange(val)}
                                onSelectedCurrencyChange={(changedCurrency) => handleSelectedCurrencyChange(changedCurrency)}
                            />
                        </div>
                        <LoadingButton
                            variant="contained"
                            sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                            loading={isWalletApproving || isDepositing}
                            loadingPosition="start"
                            disabled={disableDepositButton}
                            onClick={async (e) => await handleDepositSubmit(e, depositAmount)}
                        >
                            {`${isWalletApproving ? 'Approving ' : isDepositing ? 'Depositing ' : 'Deposit '}${disableDepositButton ? '' : `${depositAmount} ${selectedDepositCurrency}`}`}
                        </LoadingButton>
                    </div>
                </div>
            </Modal>
            <AgreeTermsPopup
                id={agreeTermsModalId}
                version={version}
                onAgreeToTerms={async () => await deposit()}
                handleCloseAgreeTermsModal={handleCloseAgreeTermsModal}
            />
        </>
    );
}