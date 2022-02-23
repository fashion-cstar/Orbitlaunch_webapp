import busdAbi from "@app/lib/contract/abis/busdAbi.json";
import orbitFundAbi from "@app/lib/contract/abis/OrbitFundAbi.json";
import {
    BSC_RPC_URL,
    MockBusdContractAddress,
    MockOrbitFundContractAddress
} from "@app/shared/AppConstant";
import { ethers } from 'ethers';

interface ResponseModel {
    ok: boolean,
    message?: string,
    returnedModel?: any
}

interface ApproveBusdParameter {
    spender: any,
    value: any
}

interface DepositBusdParameter {
    amount: any
}

interface UserAgreedParameter {
    address: any
}

interface SetPeriodParameter {
    startTime: any
    endTime: any
}

export async function agreeToTerms(): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            MockOrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        return orbitFundContract.agreeToTerms()
            .then(() => {
                return {
                    ok: true
                };
            }).catch((err: any) => {
                console.log("ERROR:" + err);
                return {
                    ok: false,
                    message: "Cannot agree to terms now. Please try again."
                };
            });
    }
    catch (err: any) {
        console.log("ERROR:" + err);
        return {
            ok: false,
            message: "Cannot agree to terms now. Please try again."
        };
    }
}

export async function userAgreed({
    address
}: UserAgreedParameter): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            MockOrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        return await orbitFundContract.userAgreed(address)
            .then((response: any) => {
                return {
                    ok: true,
                    returnedModel: response
                }
            })
            .catch((err: any) => {
                console.log("ERROR:" + err);
                return {
                    ok: false,
                    message: "User Agreement cannot be checked. Please try again.",
                };
            });
    } catch (err: any) {
        console.log("ERROR:" + err);
        return {
            ok: false,
            message: "User Agreement cannot be checked. Please try again.",
        };
    }
}

export async function approveBusd({
    spender,
    value
}: ApproveBusdParameter): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const busdContract = new ethers.Contract(
            MockBusdContractAddress,
            busdAbi,
            provider.getSigner()
        );

        const weiValue = ethers.utils.parseEther(value);
        console.log("WEI: " + weiValue)
        return await busdContract.approve(
            spender,
            weiValue
        ).then((response: any) => {
            return {
                ok: true,
                returnedModel: response
            }
        }).catch((err: any) => {
            console.log("ERROR:" + err);
            return {
                ok: false,
                message: "BUSD amount cannot be approved to use. Please try again."
            };
        });
    }
    catch (err) {
        console.log("ERROR:" + err);
        return {
            ok: false,
            message: "BUSD amount cannot be approved to use. Please try again."
        }
    }
}

export async function depositBusd({
    amount
}: DepositBusdParameter): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            MockOrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        const weiValue = ethers.utils.parseEther(amount);
        return await orbitFundContract.deposit(weiValue)
            .then(() => {
                return {
                    ok: true
                };
            }).catch((err: any) => {
                console.log("ERROR:" + err);
                return {
                    ok: false,
                    message: "Deposit transaction rejected. Please try again."
                };
            });
    }
    catch (error) {
        console.log("ERROR:" + error);
        return {
            ok: false,
            message: "Deposit transaction rejected. Please try again."
        };
    }
}

export async function startPeriodTime(): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            MockOrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        return await orbitFundContract.startTime()
            .then((response: any) => {
                return {
                    ok: true,
                    returnedModel: response
                };
            }).catch((err: any) => {
                console.log("ERROR:" + err);
                return {
                    ok: false,
                    message: "Start time is not received. Please try again."
                };
            });
    }
    catch (error) {
        console.log("ERROR:" + error);
        return {
            ok: false,
            message: "Start time is not received. Please try again."
        };
    }
}

export async function endPeriodTime(): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            MockOrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        return await orbitFundContract.endTime()
            .then((response: any) => {
                return {
                    ok: true,
                    returnedModel: response
                };
            }).catch((err: any) => {
                console.log("ERROR:" + err);
                return {
                    ok: false,
                    message: "End time is not received. Please try again."
                };
            });
    }
    catch (error) {
        console.log("ERROR:" + error);
        return {
            ok: false,
            message: "End time is not received. Please try again."
        };
    }
}

export async function setPeriod({
    startTime,
    endTime
}: SetPeriodParameter): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            MockOrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        const prevResult = await endPeriodTime();
        const prevEndTime = prevResult.returnedModel;

        return await orbitFundContract.setPeriod(
            startTime,
            endTime,
            prevEndTime
        ).then(() => {
            return {
                ok: true
            };
        }).catch((err: any) => {
            debugger;
            console.log("ERROR:" + err);
            return {
                ok: false,
                message: "Period cannot be set. Please try again."
            };
        });
    }
    catch (error) {
        debugger;
        console.log("ERROR:" + error);
        return {
            ok: false,
            message: "Period cannot be set. Please try again."
        };
    }
}

export async function totalInvestedAmount(): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            MockOrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        return await orbitFundContract.totalInvestedAmount()
            .then((response: any) => {
                return {
                    ok: true,
                    returnedModel: response
                };
            }).catch((err: any) => {
                debugger;
                console.log("ERROR:" + err);
                return {
                    ok: false,
                    message: "Total Investors cannot be fetched. Please try again."
                };
            });
    }
    catch (error) {
        debugger;
        console.log("ERROR:" + error);
        return {
            ok: false,
            message: "Total Investors cannot be fetched"
        };
    }
}
