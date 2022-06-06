import React, { useMemo, useState, useEffect } from 'react'
import Popup from "@app/components/common/Popup";
import { CONSTANT, ConstantItem } from "@app/constants/constant"
import useFundWithV3 from "@app/lib/hooks/useFundWithV3";
import useFundWithV4 from "@app/lib/hooks/useFundWithV4";
import useFund_V2 from "@app/lib/hooks/useFund_V2";
import { useSnackbar } from "@app/lib/hooks/useSnackbar";
import { Button } from "@mui/material";
import Modal from 'src/components/common/Modal';

interface AgreeTermsPopupProps {
    version: number,
    isOpen: boolean,
    handleClose: () => void
}

export default function AgreeTermsPopup({
    isOpen,
    version,
    handleClose,
}: AgreeTermsPopupProps) {    
    const snackbar = useSnackbar();
    const { agreeToTerms } = useFund_V2();
    const { agreeToTerms: agreeToTermsV3 } = useFundWithV3();
    const { agreeToTerms: agreeToTermsV4 } = useFundWithV4();
    const [isLoading, setIsLoading] = useState(false)

    const handleAgreeToTermsSubmit = async (e: any) => {
        setIsLoading(true)
        const agreeToTermsResult = version === 2 ? await agreeToTerms() : version === 4 ? await agreeToTermsV4() : await agreeToTermsV3();
        setIsLoading(false)
        if (agreeToTermsResult.ok) {
            snackbar.snackbar.show("You have agreed to the terms!", "success");
            handleClose();
        }
        else {
            snackbar.snackbar.show(agreeToTermsResult.message, "error");
        }
    }

    const closeModal = () => {
        if (!isLoading) {
            handleClose()
        }
    }

    return (
        // <Popup
        //     id={id}
        //     onPopupClose={onClose}
        //     title="User Agreement"
        // >
        //     <div className="p-4">
        //         {CONSTANT[ConstantItem.AGREE_TO_TERMS]}

        //         <br /><br />
        //         <Button
        //             variant="contained"
        //             className="w-full rounded-lg text-sm py-2.5 text-center"
        //             disabled={isLoading}
        //             onClick={async (e: any) => await handleAgreeToTermsSubmit(e)}
        //         >
        //             Agree to terms
        //         </Button>
        //     </div>
        // </Popup>
        <Modal
            isOpen={isOpen}
            header="Deposit BUSD"
            handleClose={closeModal}
        >
            <div className='m-4 md:m-6 min-w-[300px]'>
                <div className='flex flex-col w-full lg:w-[430px] max-w-[460px] gap-4'>
                    {CONSTANT[ConstantItem.AGREE_TO_TERMS]}

                    <br /><br />
                    <Button
                        variant="contained"
                        className="w-full rounded-lg text-sm py-2.5 text-center"
                        disabled={isLoading}
                        onClick={async (e: any) => await handleAgreeToTermsSubmit(e)}
                    >
                        Agree to terms
                    </Button>
                </div>
            </div>
        </Modal>
    );
}