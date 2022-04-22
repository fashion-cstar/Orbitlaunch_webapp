import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { useCallback, useEffect, useMemo, useState } from "react"
import { useEthers, ChainId } from "@usedapp/core"
import { ethers } from "ethers"
import { getContract, parseEther, calculateGasMargin } from 'src/utils'
import ERC20_ABI from 'src/lib/contract/abis/erc20.json'
import ORBIT_WHITELIST_ABI from 'src/lib/contract/abis/OrbitWhitelist.json'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { RpcProviders } from "@app/shared/PadConstant"
import { getChainIdFromName, PROJECT_STATUS } from 'src/utils'
import useRefresh from '../useRefresh'

import moment from 'moment'

const orbitToken_Address = '0x8dcfced61b0f343cee6829c30d77d4bd698426db'
export function useDepositInfo(padContractAddress: string, blockchain: string): BigNumber {
    const { account } = useEthers()
    const [userDeposited, setUserDeposited] = useState<BigNumber>(BigNumber.from(0))
    const chainId = getChainIdFromName(blockchain);
    const { slowRefresh, fastRefresh } = useRefresh()

    useEffect(() => {
        const fetchUserDeposited = async () => {
            const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
            const amount = await padContract.depositInfo(account)
            return amount
        }
        if (!!account) {
            fetchUserDeposited().then(result => {
                setUserDeposited(result)
            }).catch(error => { })
        } else {
            setUserDeposited(BigNumber.from(0))
        }
    }, [account, slowRefresh])

    return userDeposited
}

export function useOrbitWhitelisted(padContractAddress: string, blockchain: string): boolean {
    const { account } = useEthers()
    const [userWhitelisted, setUserWhitelisted] = useState(false)
    const chainId = getChainIdFromName(blockchain);

    useEffect(() => {
        const fetchUserDeposited = async () => {
            const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
            const iswhitelisted = await padContract.whitelist(account)
            return iswhitelisted
        }
        if (!!account) {
            fetchUserDeposited().then(result => {
                setUserWhitelisted(result)
            }).catch(error => { })
        } else {
            setUserWhitelisted(false)
        }
    }, [account])

    return userWhitelisted
}

export function useWhitelistedCallback(): {
    whitelistedCallback: (padContractAddress: string, blockchain: string) => Promise<boolean | undefined>,    
} {
    const { account, library } = useEthers()
    const whitelistedCallback = async function (padContractAddress: string, blockchain: string) {
        const chainId = getChainIdFromName(blockchain);
        const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
        if (!padContract) return
        return padContract.whitelist(account).then((res: boolean) => {
            return res
        })
    }

    return { whitelistedCallback }
}

export function useLaunchTokenCallback(): {
    launchTokenPriceCallback: (padContractAddress: string, blockchain: string) => Promise<BigNumber | undefined>,
    launchTokenDecimalsCallback: (padContractAddress: string, blockchain: string) => Promise<BigNumber | undefined>
} {
    const { account, library } = useEthers()
    const launchTokenPriceCallback = async function (padContractAddress: string, blockchain: string) {
        const chainId = getChainIdFromName(blockchain);
        const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
        if (!padContract) return
        return padContract.presalePrice().then((res: BigNumber) => {
            return res
        })
    }

    const launchTokenDecimalsCallback = async function (padContractAddress: string, blockchain: string) {
        const chainId = getChainIdFromName(blockchain);
        const orbitContract: Contract = getContract(orbitToken_Address, ERC20_ABI, RpcProviders[chainId], account ? account : undefined)
        if (!orbitContract) return
        return orbitContract.decimals().then((res: BigNumber) => {
            return res
        })
    }

    return { launchTokenPriceCallback, launchTokenDecimalsCallback }
}

export function useLaunchTokenPrice(padContractAddress: string, blockchain: string): BigNumber {
    const { account, library } = useEthers()
    const [launchTokenPrice, setLaunchTokenPrice] = useState<BigNumber>(BigNumber.from(0))
    const chainId = getChainIdFromName(blockchain);

    useEffect(() => {
        const fetchLaunchTokenPrice = async () => {
            const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
            const price = await padContract.presalePrice()
            return price
        }
        if (padContractAddress) {
            fetchLaunchTokenPrice().then(result => {
                setLaunchTokenPrice(result)
            }).catch(error => { })
        }
    }, [padContractAddress])

    return launchTokenPrice
}

export function uselaunchTokenDecimals(blockchain: string): BigNumber {
    const { account, library } = useEthers()
    const [launchTokenDecimals, setLaunchTokenDecimals] = useState<BigNumber>(BigNumber.from(18))
    const chainId = getChainIdFromName(blockchain);

    useEffect(() => {
        const fetchLaunchTokenDecimals = async () => {
            const orbitContract: Contract = getContract(orbitToken_Address, ERC20_ABI, RpcProviders[chainId], account ? account : undefined)
            const decimals = await orbitContract.decimals()
            return decimals
        }
        if (orbitToken_Address) {
            fetchLaunchTokenDecimals().then(result => {
                setLaunchTokenDecimals(result)
            }).catch(error => { })
        }
    }, [])

    return launchTokenDecimals
}

export function usePadApproveCallback(): {
    padApproveCallback: (padContractAddress: string, tokenContractAddress: string, amount: number, blockchain: string) => Promise<string>
} {
    const { account, library } = useEthers()
    const padApproveCallback = async function (padContractAddress: string, tokenContractAddress: string, amount: number, blockchain: string) {
        const chainId = getChainIdFromName(blockchain);
        const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
        const tokenContract: Contract = getContract(tokenContractAddress, ERC20_ABI, library, account ? account : undefined)
        let decimals = await tokenContract.decimals()
        if (!account || !library || !padContract) return
        return tokenContract.estimateGas.approve(padContract.address, MaxUint256).then(estimatedGas => {
            return tokenContract.estimateGas.approve(padContract.address, parseEther(amount, decimals)).then(estimatedGasLimit => {
                const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
                return tokenContract.approve(padContract.address, parseEther(amount, decimals), {
                    gasLimit: calculateGasMargin(gas)
                }).then((response: TransactionResponse) => {
                    response.wait().then((_: any) => {
                        return response.hash
                    }).catch(error => { })
                    //   return response.hash
                })
            }).catch((error: any) => {
                const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGas
                return tokenContract.approve(padContract.address, MaxUint256, {
                    gasLimit: calculateGasMargin(gas)
                }).then((response: TransactionResponse) => {
                    response.wait().then((_: any) => {
                        return response.hash
                    }).catch(error => { })
                    //   return response.hash
                })
            })
        })
    }
    return { padApproveCallback }
}
export function useJoinPresaleCallback(): {
    joinPresaleCallback: (padContractAddress: string, tokenContractAddress: string, amount: number, blockchain: string) => Promise<string>
} {
    // get claim data for this account
    const { account, library, chainId } = useEthers()

    const joinPresaleCallback = async function (padContractAddress: string, tokenContractAddress: string, amount: number, blockchain: string) {
        const chainId = getChainIdFromName(blockchain);
        const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, library, account ? account : undefined)
        const tokenContract: Contract = getContract(tokenContractAddress, ERC20_ABI, RpcProviders[chainId], account ? account : undefined)
        let decimals = await tokenContract.decimals()

        if (!account || !library || !padContract) return
        if (tokenContractAddress === AddressZero) {
            return padContract.estimateGas.deposit(parseEther(amount, decimals), {
                value: parseEther(amount, decimals)
            }).then(estimatedGasLimit => {
                const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
                return padContract.deposit(parseEther(amount, decimals), {
                    gasLimit: calculateGasMargin(gas), value: parseEther(amount, decimals)
                }).then((response: TransactionResponse) => {
                    response.wait().then((_: any) => {
                        return response.hash
                    }).catch(error => { })
                    //   return response.hash
                })
            })
        } else {
            return padContract.estimateGas.deposit(parseEther(amount, decimals)).then(estimatedGas => {
                return padContract.estimateGas.deposit(parseEther(amount, decimals)).then(estimatedGasLimit => {
                    const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
                    return padContract.deposit(parseEther(amount, decimals), {
                        gasLimit: calculateGasMargin(gas)
                    }).then((response: TransactionResponse) => {
                        response.wait().then((_: any) => {
                            return response.hash
                        }).catch(error => { })
                        // return response.hash
                    })
                })
            })
        }
    }

    return { joinPresaleCallback }
}

export function useClaimCallback(): {
    claimCallback: (padContractAddress: string, blockchain: string) => Promise<string>,
} {
    const { account, library } = useEthers()

    const claimCallback = async function (padContractAddress: string, blockchain: string) {
        if (!account || !library || !padContractAddress) return
        const chainId = getChainIdFromName(blockchain);
        const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, library, account ? account : undefined)
        return padContract.estimateGas.claim().then(estimatedGasLimit => {
            const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
            return padContract
                .claim({ gasLimit: calculateGasMargin(gas) })
                .then((response: TransactionResponse) => {
                    return response.hash
                })
        })
    }
    return { claimCallback }
}

export function useTotalInvestedAmount(padContractAddress: string, blockchain: string): BigNumber {
    const { account } = useEthers()
    const [totalInvestedAmount, setTotalInvestedAmount] = useState<BigNumber>(BigNumber.from(0))
    const chainId = getChainIdFromName(blockchain);
    const { slowRefresh, fastRefresh } = useRefresh()

    useEffect(() => {
        const fetchTotalInvestedAmount = async () => {
            const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
            const amount = await padContract.totalInvestedAmount()
            return amount
        }
        if (padContractAddress) {
            fetchTotalInvestedAmount().then(result => {
                setTotalInvestedAmount(result)
            }).catch(error => { })
        }
    }, [padContractAddress, slowRefresh])

    return totalInvestedAmount
}

export function useGetTotalInvestors(padContractAddress: string, blockchain: string): BigNumber {
    const { account } = useEthers()
    const [totalInvestors, setTotalInvestors] = useState<BigNumber>(BigNumber.from(0))
    const chainId = getChainIdFromName(blockchain);
    const { slowRefresh, fastRefresh } = useRefresh()

    useEffect(() => {
        const fetchGetTotalInvestors = async () => {
            const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
            const amount = await padContract.getTotalInvestors()
            return amount
        }
        if (padContractAddress) {
            fetchGetTotalInvestors().then(result => {
                setTotalInvestors(result)
            }).catch(error => { })
        }
    }, [padContractAddress, slowRefresh])

    return totalInvestors
}

export function useGetAvailableTokens(padContractAddress: string, blockchain: string): BigNumber {
    const { account } = useEthers()
    const [availableTokens, setAvailableTokens] = useState<BigNumber>(BigNumber.from(0))
    const chainId = getChainIdFromName(blockchain);
    const { slowRefresh, fastRefresh } = useRefresh()

    useEffect(() => {
        const fetchAvailableTokens = async () => {
            const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
            const availableTokens = await padContract.getAvailableAmount(account)
            return availableTokens
        }
        if (padContractAddress && account) {
            fetchAvailableTokens().then(result => {
                setAvailableTokens(result)
            }).catch(error => { })
        } else {
            setAvailableTokens(BigNumber.from(0))
        }
    }, [padContractAddress, account, slowRefresh])

    return availableTokens
}

export function useStartTime(padContractAddress: string, blockchain: string): BigNumber {
    const { account } = useEthers()
    const [startTime, setStartTime] = useState<BigNumber>(BigNumber.from(0))
    const chainId = getChainIdFromName(blockchain);
    const { slowRefresh, fastRefresh } = useRefresh()

    useEffect(() => {
        const fetchStartTime = async () => {
            const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
            const timeat = await padContract.startTime()
            return timeat
        }
        if (padContractAddress) {
            fetchStartTime().then(result => {
                setStartTime(result)
            }).catch(error => { })
        }
    }, [padContractAddress, slowRefresh])

    return startTime
}

export function useEndTime(padContractAddress: string, blockchain: string): BigNumber {
    const { account } = useEthers()
    const [endTime, setEndTime] = useState<BigNumber>(BigNumber.from(0))
    const chainId = getChainIdFromName(blockchain);
    const { slowRefresh, fastRefresh } = useRefresh()

    useEffect(() => {
        const fetchEndTime = async () => {
            const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
            const timeat = await padContract.endTime()
            return timeat
        }
        if (padContractAddress) {
            fetchEndTime().then(result => {
                setEndTime(result)
            }).catch(error => { })
        }
    }, [padContractAddress, slowRefresh])

    return endTime
}

export function useProjectStatus(ido: any): number {
    const startTime: BigNumber = useStartTime(ido ? ido.contractAddress : '', ido ? ido.blockchain : '')
    const endTime: BigNumber = useEndTime(ido ? ido.contractAddress : '', ido ? ido.blockchain : '')
    const investCap: BigNumber = useInvestCap(ido ? ido.contractAddress : '', ido ? ido.blockchain : '')
    const totalInvestedAmount: BigNumber = useTotalInvestedAmount(ido ? ido.contractAddress : '', ido ? ido.blockchain : '')
    const [projectStatus, setProjectStatus] = useState(0)

    useEffect(() => {
        let status = 0
        if (startTime && endTime && investCap && totalInvestedAmount) {
            if (startTime.toNumber() > 0 && endTime.toNumber() > 0) {
                if (moment(moment.now()).isBefore(moment(startTime.toNumber() * 1000))) setProjectStatus(PROJECT_STATUS.PresaleOpeningSoon) // presale opening soon
                if (moment(moment.now()).isSameOrAfter(moment(startTime.toNumber() * 1000))
                    && moment(moment.now()).isBefore(moment(endTime.toNumber() * 1000))) {
                    setProjectStatus(PROJECT_STATUS.PresaleOpen) // presale open
                    status = PROJECT_STATUS.PresaleOpen
                }
                if (moment(moment.now()).isSameOrAfter(moment(endTime.toNumber() * 1000))) setProjectStatus(PROJECT_STATUS.VestingStarted) // claim started
            }
            if (investCap.gt(0)) {
                if (totalInvestedAmount.gte(investCap)) {
                    if (status === PROJECT_STATUS.PresaleOpen || status === PROJECT_STATUS.PublicPresaleOpen) setProjectStatus(PROJECT_STATUS.PresaleFilled)
                }
            }
        }
    }, [ido, startTime, endTime, investCap, totalInvestedAmount])

    return projectStatus
}

export function useInvestCap(padContractAddress: string, blockchain: string): BigNumber {
    const { account } = useEthers()
    const [investCap, setInvestCap] = useState<BigNumber>(BigNumber.from(0))
    const chainId = getChainIdFromName(blockchain);
    const { slowRefresh, fastRefresh } = useRefresh()

    useEffect(() => {
        const fetchInvestCap = async () => {
            const padContract: Contract = getContract(padContractAddress, ORBIT_WHITELIST_ABI, RpcProviders[chainId], account ? account : undefined)
            const cap = await padContract.investmentCap()
            return cap
        }
        if (padContractAddress) {
            fetchInvestCap().then(result => {
                setInvestCap(result)
            }).catch(error => { })
        }
    }, [padContractAddress, slowRefresh])

    return investCap
}
