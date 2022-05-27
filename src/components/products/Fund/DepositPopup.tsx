import DepositInput from "@app/components/common/DepositInput";
import Button from '@mui/material/Button';
import useFundWithV3 from "@app/lib/hooks/useFundWithV3";
import useFundWithV4 from "@app/lib/hooks/useFundWithV4";
import useFund_V2 from "@app/lib/hooks/useFund_V2";
import { useSnackbar } from "@app/lib/hooks/useSnackbar";
import { useEffect, useState } from "react";
import AgreeTermsPopup from "./AgreeTermsPopup";
import LoadingButton from '@mui/lab/LoadingButton';
import Modal from 'src/components/common/Modal';
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import { getEtherscanLink, CHAIN_LABELS } from 'src/utils'
import { useEthers, ChainId } from "@usedapp/core";
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';

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
    const { library, account, chainId } = useEthers()
    const { userAgreed, depositBusd, approve } = useFund_V2();
    const { userAgreed: userAgreedV3, approve: approveV3, depositBusd: depositBusdV3 } = useFundWithV3();
    const { userAgreed: userAgreedV4, approve: approveV4, depositBusd: depositBusdV4 } = useFundWithV4();
    const agreeTermsModalId = "agree-terms-modal";
    const [disableDepositButton, setDisableDepositButton] = useState(true);
    const [depositAmount, setDepositAmount] = useState('');
    const [selectedDepositCurrency, setSelectedDepositCurrency] = useState('BUSD');
    const [hash, setHash] = useState<string | undefined>()
    const [attempting, setAttempting] = useState(false)
    const [isApproved, setIsApproved] = useState(false)
    const [isWalletApproving, setIsWalletApproving] = useState(false)

    const handleInputChange = (amount: any) => {
        setDisableDepositButton(Number(amount) === 0)
        setDepositAmount(amount);
    }

    const handleSelectedCurrencyChange = (changedCurrency: any) => {

    }

    useEffect(() => {
        setDepositAmount('')
        setHash(undefined)
        setAttempting(false)
        setIsApproved(false)
    }, [isOpen])

    const deposit = async () => {
        const depositResult = version === 2 ? await depositBusd(depositAmount) : version === 4 ? await depositBusdV4(depositAmount) : await depositBusdV3(depositAmount);
        if (!depositResult.ok) {
            snackbar.snackbar.show(depositResult.message, "error");
            console.error(depositResult.message);
            return;
        } else {
            // snackbar.snackbar.show(`${depositAmount} ${selectedDepositCurrency} has been deposited successfully!`, "success");
            setHash(depositResult.hash)
            // handleClose()
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

    async function onApprove() {
        const userAgreedResult = version === 2 ? await userAgreed() : version === 4 ? await userAgreedV4() : await userAgreedV3();
        if (userAgreedResult.ok) {
            //If user agreement has not been done, open the agreement modal
            if (!userAgreedResult.returnedModel) {
                handleOpenAgreeTermsModal();
                return;
            }

            setIsWalletApproving(true)
            const approveResult = version === 2 ? await approve(depositAmount) : version === 4 ? await approveV4(depositAmount) : await approveV3(depositAmount);
            setIsWalletApproving(false)
            if (!approveResult.ok) {
                snackbar.snackbar.show(approveResult.message, "error");
                console.error(approveResult.message);
                return;
            } else {
                snackbar.snackbar.show(`Approved!`, "success");
                setIsApproved(true)
            }
        }
        else {
            snackbar.snackbar.show(userAgreedResult.message, "error");
        }
    }

    async function onDeposit() {
        setAttempting(true)
        const depositResult = version === 2 ? await depositBusd(depositAmount) : version === 4 ? await depositBusdV4(depositAmount) : await depositBusdV3(depositAmount);
        setAttempting(false)
        if (!depositResult.ok) {
            snackbar.snackbar.show(depositResult.message, "error");
            console.error(depositResult.message);
            return;
        } else {
            // snackbar.snackbar.show(`${depositAmount} ${selectedDepositCurrency} has been deposited successfully!`, "success");
            setHash(depositResult.hash)
        }
    }

    const handleDepositSubmit = async (e: any, amount: any) => {

    }

    const closeModal = () => {
        if (!(isWalletApproving || attempting)) {
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
                    {!attempting && !hash && <div className='flex flex-col w-full lg:w-[430px] max-w-[460px] gap-4'>
                        <div>
                            <DepositInput
                                value={depositAmount}
                                onChange={(val) => handleInputChange(val)}
                                onSelectedCurrencyChange={(changedCurrency) => handleSelectedCurrencyChange(changedCurrency)}
                            />
                        </div>
                        {/* <LoadingButton
                            variant="contained"
                            sx={{ width: "100%", borderRadius: "12px", height: '45px' }}
                            loading={isWalletApproving || isDepositing}
                            loadingPosition="start"
                            disabled={disableDepositButton}
                            onClick={async (e) => await handleDepositSubmit(e, depositAmount)}
                        >
                            {`${isWalletApproving ? 'Approving ' : isDepositing ? 'Depositing ' : 'Deposit '}${disableDepositButton ? '' : `${depositAmount} ${selectedDepositCurrency}`}`}
                        </LoadingButton> */}
                        <div className='flex gap-4'>
                            <LoadingButton
                                variant="contained"
                                sx={{ width: "100%", borderRadius: "12px" }}
                                loading={isWalletApproving}
                                loadingPosition="start"
                                disabled={disableDepositButton || isApproved}
                                onClick={onApprove}
                            >
                                {isWalletApproving ? 'Approving...' : "Approve"}
                            </LoadingButton>
                            <Button
                                variant="contained"
                                sx={{ width: "100%", borderRadius: "12px" }}
                                onClick={onDeposit}
                                disabled={!isApproved || disableDepositButton}
                            >
                                Deposit
                            </Button>
                        </div>
                    </div>}
                    {attempting && !hash && (
                        <div className="flex justify-center items-center flex-col gap-12 h-[200px]">
                            <Fade in={true} style={{ transitionDelay: '800ms' }} unmountOnExit>
                                <CircularProgress />
                            </Fade>
                            <div>
                                {`Depositing ${depositAmount} ${selectedDepositCurrency}`}
                            </div>
                        </div>
                    )}
                    {hash && (
                        <div className='w-full'>
                            <div className='w-full flex justify-center py-4'>
                                <TaskAltIcon sx={{ fontSize: 120, color: '#00aa00' }} />
                            </div>
                            <div className='flex flex-col gap-2'>
                                <div className='text-[16px] text-[#aaaaaa] text-center'>Transaction submitted</div>
                                <div className='text-[16px] text-[#aaaaaa] text-center'>{'Hash: ' + hash.slice(0, 10) + '...' + hash.slice(56, 65)}</div>
                                {chainId && (
                                    <a className='text-[16px] mt-4 text-[#aaaaee] underline text-center' target="_blank" href={getEtherscanLink(chainId, hash, 'transaction')}>
                                        {chainId && `View on ${CHAIN_LABELS[chainId]}`}
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
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