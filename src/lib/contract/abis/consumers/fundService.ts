import { ethers } from 'ethers';
import busdAbi from "@app/lib/contract/abis/busdAbi.json";
import orbitStableCoinAbi from "@app/lib/contract/abis/orbitStableCoinAbi.json";
import orbitFundAbi from "@app/lib/contract/abis/OrbitFundAbi.json";
import {
    BusdContractAddress,
    OrbitFundContractAddress,
    OrbitStableTokenAddress
} from "@app/shared/AppConstant";

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

interface DepositInfosParameter {
    address: any
}

interface UserAgreedParameter {
    address: any
}

interface SetPeriodParameter {
    startTime: any
    endTime: any
}

interface ApproveOrbitStableParameter {
    spender: any,
    weiAmount: ethers.BigNumber
}

interface WitdrawInvestmentParameter {
    weiAmount: ethers.BigNumber
}

interface UserWithdrewParameter {
    account: string
}

export async function agreeToTerms(): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            OrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        return orbitFundContract.agreeToTerms()
            .then(() => {
                return {
                    ok: true
                };
            }).catch((err: any) => {
                console.error("ERROR: " + err.data?.message);
                return {
                    ok: false,
                    message: "Cannot agree to terms now. Please try again."
                };
            });
    }
    catch (err: any) {
        console.error("ERROR: " + err.data?.message);
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
            OrbitFundContractAddress,
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
                console.error("ERROR: " + err.data?.message);
                return {
                    ok: false,
                    message: "User Agreement cannot be checked. Please try again.",
                };
            });
    } catch (err: any) {
        console.error("ERROR: " + err.data?.message);
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
            BusdContractAddress,
            busdAbi,
            provider.getSigner()
        );

        const weiValue = ethers.utils.parseEther(value);
        console.log("WEI APPROVED: " + weiValue);
        return await busdContract.approve(
            spender,
            weiValue
        ).then((response: any) => {
            return {
                ok: true,
                returnedModel: response
            }
        }).catch((err: any) => {
            console.error("ERROR: " + err.data?.message);
            return {
                ok: false,
                message: "BUSD amount cannot be approved to use. Please try again."
            };
        });
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
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
            OrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );
        const busdContract = new ethers.Contract(
            BusdContractAddress,
            busdAbi,
            provider.getSigner()
        );

        const weiAmount = ethers.utils.parseEther(amount);
        const approveTxHash = await busdContract
            .connect(provider.getSigner())
            .approve(OrbitFundContractAddress, weiAmount);

        return approveTxHash.wait().then(async (_: any) => {
            return await orbitFundContract.deposit(weiAmount)
                .then(() => {
                    return {
                        ok: true
                    };
                }).catch((err: any) => {
                    console.error("ERROR: " + err.data?.message);
                    return {
                        ok: false,
                        message: "Deposit transaction rejected. Please try again."
                    };
                });
        });
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
        return {
            ok: false,
            message: "Deposit transaction rejected. Please try again."
        };
    }
}

export async function depositInfos({
    address
}: DepositInfosParameter): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            OrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        return await orbitFundContract.depositInfos(address)
            .then((response: any) => {
                return {
                    ok: true,
                    returnedModel: response.amount
                };
            }).catch((err: any) => {
                console.error("ERROR: " + err.data?.message);
                return {
                    ok: false,
                    message: "Deposit Info cannot be fetched. Please try again."
                };
            });
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
        return {
            ok: false,
            message: "Deposit Info cannot be fetched. Please try again."
        };
    }
}

export async function startPeriodTime(): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            OrbitFundContractAddress,
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
                console.error("ERROR: " + err.data?.message);
                return {
                    ok: false,
                    message: "Start time is not received. Please try again."
                };
            });
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
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
            OrbitFundContractAddress,
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
                console.error("ERROR: " + err.data?.message);
                return {
                    ok: false,
                    message: "End time is not received. Please try again."
                };
            });
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
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
            OrbitFundContractAddress,
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
            console.error("ERROR: " + err.data?.message);
            return {
                ok: false,
                message: "Period cannot be set. Please try again."
            };
        });
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
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
            OrbitFundContractAddress,
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
                console.error("ERROR: " + err.data?.message);
                return {
                    ok: false,
                    message: "Total Invested Amount cannot be fetched. Please try again."
                };
            });
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
        return {
            ok: false,
            message: "Total Invested Amount cannot be fetched. Please try again."
        };
    }
}

export async function getTotalInvestors(): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({provider})
        const orbitFundContract = new ethers.Contract(
            OrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        console.log({orbitFundContract})

        return await orbitFundContract.getTotalInvestors()
            .then((response: any) => {
                console.log({response})
                return {
                    ok: true,
                    returnedModel: ethers.utils.parseUnits(response)
                };
            }).catch((err: any) => {
                console.error("ERROR: " + err.data?.message);
                return {
                    ok: false,
                    message: "Get Total Investors cannot be fetched. Please try again."
                };
            });
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
        return {
            ok: false,
            message: "Get Total Investors cannot be fetched. Please try again."
        };
    }
}

export async function approveOrbitStableCoin({
    spender,
    weiAmount
}: ApproveOrbitStableParameter): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitStableContract = new ethers.Contract(
            OrbitStableTokenAddress,
            orbitStableCoinAbi,
            provider.getSigner()
        );

        return await orbitStableContract.approve(
            spender,
            weiAmount
        ).then((response: any) => {
            return {
                ok: true,
                returnedModel: response
            }
        }).catch((err: any) => {
            console.error("ERROR: " + err.data?.message);
            return {
                ok: false,
                message: "Orbit amount cannot be approved to use. Please try again."
            };
        });
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
        return {
            ok: false,
            message: "Orbit amount cannot be approved to use. Please try again."
        }
    }
}

export async function withdrawInvestment({
    weiAmount
}: WitdrawInvestmentParameter): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            OrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );
        const orbitStableContract = new ethers.Contract(
            OrbitStableTokenAddress,
            orbitStableCoinAbi,
            provider.getSigner()
        );

        const approveTxHash = await orbitStableContract
            .connect(provider.getSigner())
            .approve(OrbitFundContractAddress, weiAmount);

        return approveTxHash.wait().then(async (_: any) => {
            return await orbitFundContract.withdraw()
                .then(() => {
                    return {
                        ok: true
                    };
                }).catch((err: any) => {
                    console.error("ERROR: " + err.data?.message);
                    return {
                        ok: false,
                        message: "Withdrawal cannot be made. Please try again."
                    };
                });
        })
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
        return {
            ok: false,
            message: "Withdrawal cannot be made. Please try again."
        };
    }
}

export async function getLossPercentage(): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            OrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        return await orbitFundContract.lossPercentage()
            .then((response: any) => {
                return {
                    ok: true,
                    returnedModel: response
                };
            }).catch((err: any) => {
                console.error("ERROR: " + err.data?.message);
                return {
                    ok: false,
                    message: "Loss Percentage value cannot be get. Please try again."
                };
            });
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
        return {
            ok: false,
            message: "Loss Percentage value cannot be get. Please try again."
        };
    }
}

export async function userWithdrew({
    account
}: UserWithdrewParameter): Promise<ResponseModel> {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const orbitFundContract = new ethers.Contract(
            OrbitFundContractAddress,
            orbitFundAbi,
            provider.getSigner()
        );

        const userWithdrewTxHash = await orbitFundContract
            .connect(provider.getSigner())
            .userWithdrew(account);

        return userWithdrewTxHash.wait().then(async (result: any) => {
            return {
                ok: true,
                returnedModel: result
            };
        }).catch((err: any) => {
            console.error("ERROR: " + err.data?.message);
            return {
                ok: false,
                message: "err.data?.message"
            };
        })
    }
    catch (err) {
        console.error("ERROR: " + err.data?.message);
        return {
            ok: false,
            message: "Withdrawal cannot be made. Please try again."
        };
    }
}
