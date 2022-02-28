import Popup from "@app/components/common/Popup";
import { CONSTANT, ConstantItem } from "@app/constants/constant"
import useFund from "@app/lib/hooks/useFund";
import { useSnackbar } from "@app/lib/hooks/useSnackbar";
import { Button } from "@mui/material";

interface AgreeTermsPopupProps {
    id: string,
    onClose?(): any,
    onAgreeToTerms(): any
}

export default function AgreeTermsPopup({
    id,
    onClose,
    onAgreeToTerms
}: AgreeTermsPopupProps) {
    const agreeTermsModalId = "agree-terms-modal";
    const snackbar = useSnackbar();
    const { agreeToTerms } = useFund();

    const handleCloseAgreeTermsModal = () => {
        const modal = document.getElementById(agreeTermsModalId);
        modal.style.display = "none";
    }

    const handleAgreeToTermsSubmit = async (e: any) => {
        const agreeToTermsResult = await agreeToTerms();
        if (agreeToTermsResult.ok) {
            await onAgreeToTerms();
            handleCloseAgreeTermsModal();
        }
        else {
            snackbar.snackbar.show(agreeToTermsResult.message, "error");
        }
    }

    return (
        <Popup
            id={id}
            onPopupClose={onClose}
            title="User Agreement"
        >
            <div className="p-4">
                {CONSTANT[ConstantItem.AGREE_TO_TERMS]}

                <br /><br />
                <Button
                    variant="contained"
                    className="w-full rounded-lg text-sm py-2.5 text-center"
                    onClick={async (e: any) => await handleAgreeToTermsSubmit(e)}
                >
                    Agree to terms
                </Button>
            </div>
        </Popup>
    );
}