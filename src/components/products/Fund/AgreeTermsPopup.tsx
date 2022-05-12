import Popup from "@app/components/common/Popup";
import { CONSTANT, ConstantItem } from "@app/constants/constant"
import useFundWithV3 from "@app/lib/hooks/useFundWithV3";
import useFund_V2 from "@app/lib/hooks/useFund_V2";
import { useSnackbar } from "@app/lib/hooks/useSnackbar";
import { Button } from "@mui/material";

interface AgreeTermsPopupProps {
    id: string,
    version: number;
    onClose?(): any,
    onAgreeToTerms(): any
}

export default function AgreeTermsPopup({
    id,
    version,
    onClose,
    onAgreeToTerms
}: AgreeTermsPopupProps) {
    const agreeTermsModalId = "agree-terms-modal";
    const snackbar = useSnackbar();
    const { agreeToTerms } = useFund_V2();
    const { agreeToTerms: agreeToTermsV3 } = useFundWithV3();

    const handleCloseAgreeTermsModal = () => {
        const modal = document.getElementById(agreeTermsModalId);
        modal.style.display = "none";
    }

    const handleAgreeToTermsSubmit = async (e: any) => {
        const agreeToTermsResult = version === 2 ? await agreeToTerms() : await agreeToTermsV3();
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