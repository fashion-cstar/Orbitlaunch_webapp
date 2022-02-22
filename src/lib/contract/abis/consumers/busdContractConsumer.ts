import busdAbi from "@app/lib/contract/abis/pancake.json";
import orbitFundAbi from "@app/lib/contract/abis/OrbitFundAbi.json";
import {
    BUSD_TOKEN_ADDRESS,
    orbitFundMockContractddress
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

export async function agreeToTerms(): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            orbitFundMockContractddress,
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
            orbitFundMockContractddress,
            orbitFundAbi,
            provider.getSigner()
        );

        const result = await orbitFundContract.userAgreed(address)
            .catch((err: any) => {
                console.log("ERROR:" + err);
                return {
                    ok: false,
                    message: "User Agreement cannot be checked. Please try again.",
                };
            });

        return {
            ok: true,
            returnedModel: result
        }
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
            BUSD_TOKEN_ADDRESS,
            busdAbi,
            provider.getSigner()
        );

        const weiValue = value * Math.pow(10, 18);
        const result = await busdContract.approve(
            spender,
            weiValue
        ).catch((err: any) => {
            console.log("ERROR:" + err);
            return {
                ok: false,
                message: "BUSD amount cannot be approved to use. Please try again."
            };
        });

        debugger;
        return {
            ok: true,
            returnedModel: result
        }
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
            orbitFundMockContractddress,
            orbitFundAbi,
            provider.getSigner()
        );

        const weiValue = (Number(amount) * Math.pow(10, 18)).toString();
        debugger;
        return await orbitFundContract.deposit(weiValue)
            .then(() => {
                debugger;
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
