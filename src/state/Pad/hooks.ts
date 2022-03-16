import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { useCallback, useEffect, useMemo, useState } from "react"
import { useEthers, ChainId } from "@usedapp/core"
import { ethers } from "ethers"
import { getContract, parseEther, calculateGasMargin } from 'src/utils'
import ERC20_ABI from 'src/lib/contract/abis/erc20.json'
import PAD_ABI from 'src/lib/contract/abis/orbitpad.json'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { M31TokenAddress, RpcProviders } from "@app/shared/PadConstant"
import { getTierValues } from '@app/shared/TierLevels'
import { getChainIdFromName } from 'src/utils'
import useRefresh from './useRefresh'

import moment from 'moment'

export function fetchProjectList(): Promise<any | null> {
  return (fetch(`https://backend-api-pi.vercel.app/api/getProjects`)
    .then((res: any) => res.json())
    .then((data) => {
      return data
    })
    .catch(error => {
      console.error("Failed to get project list: " + error)
    }))
}

export function useDepositInfo(padContractAddress: string, blockchain: string): BigNumber {
  const { account } = useEthers()
  const [userDeposited, setUserDeposited] = useState<BigNumber>(BigNumber.from(0))
  const chainId = getChainIdFromName(blockchain);
  const { slowRefresh, fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchUserDeposited = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
      const amount = await padContract.depositInfos(account)
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

export function useLaunchTokenCallback(): {
  launchTokenPriceCallback: (padContractAddress: string, blockchain: string) => Promise<BigNumber | undefined>,
  launchTokenDecimalsCallback: (padContractAddress: string, blockchain: string) => Promise<BigNumber | undefined>
} {
  const { account, library } = useEthers()
  const launchTokenPriceCallback = async function (padContractAddress: string, blockchain: string) {
    const chainId = getChainIdFromName(blockchain);
    const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
    if (!padContract) return
    return padContract.launchTokenPrice().then((res: BigNumber) => {
      return res
    })
  }

  const launchTokenDecimalsCallback = async function (padContractAddress: string, blockchain: string) {
    const chainId = getChainIdFromName(blockchain);
    const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
    if (!padContract) return
    return padContract.launchTokenDecimals().then((res: BigNumber) => {
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
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
      const price = await padContract.launchTokenPrice()
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

export function uselaunchTokenDecimals(padContractAddress: string, blockchain: string): BigNumber {
  const { account, library } = useEthers()
  const [launchTokenDecimals, setLaunchTokenDecimals] = useState<BigNumber>(BigNumber.from(18))
  const chainId = getChainIdFromName(blockchain);

  useEffect(() => {
    const fetchLaunchTokenDecimals = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
      const decimals = await padContract.launchTokenDecimals()
      return decimals
    }
    if (padContractAddress) {
      fetchLaunchTokenDecimals().then(result => {
        setLaunchTokenDecimals(result)
      }).catch(error => { })
    }
  }, [padContractAddress])

  return launchTokenDecimals
}

export function useToken(tokenContractAddress: string, blockchain: string): { name: string, symbol: string, decimals: BigNumber } {
  const { account, library } = useEthers()
  const [token, setToken] = useState<any>()
  const chainId = getChainIdFromName(blockchain);

  useEffect(() => {
    const fetchToken = async () => {
      const tokenContract: Contract = getContract(tokenContractAddress, ERC20_ABI, RpcProviders[chainId], account ? account : undefined)
      const name = await tokenContract.name()
      const decimals = await tokenContract.decimals()
      const symbol = await tokenContract.symbol()
      return { name: name, symbol: symbol, decimals: decimals }
    }
    if (tokenContractAddress) {
      fetchToken().then(result => {
        setToken(result)
      }).catch(error => { })
    }
  }, [tokenContractAddress])

  return token
}

export function useTokenAllowance(): { tokenAllowanceCallback: (owner: string, spender: string, tokenContractAddress: string, blockchain: string) => Promise<BigNumber> } {
  const { account, library } = useEthers()
  const tokenAllowanceCallback = async function (owner: string, spender: string, tokenContractAddress: string, blockchain: string) {
    const chainId = getChainIdFromName(blockchain);
    const tokenContract: Contract = getContract(tokenContractAddress, ERC20_ABI, RpcProviders[chainId], account ? account : undefined)
    return tokenContract.allowance(owner, spender).then((res: BigNumber) => {
      return res
    })
  }
  return { tokenAllowanceCallback }
}

export function usePadApproveCallback(): {
  padApproveCallback: (padContractAddress: string, tokenContractAddress: string, amount: number, blockchain: string) => Promise<string>
} {
  const { account, library } = useEthers()
  const padApproveCallback = async function (padContractAddress: string, tokenContractAddress: string, amount: number, blockchain: string) {
    const chainId = getChainIdFromName(blockchain);
    const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
    const tokenContract: Contract = getContract(tokenContractAddress, ERC20_ABI, library, account ? account : undefined)
    let decimals = await tokenContract.decimals()
    if (!account || !library || !padContract) return
    return tokenContract.estimateGas.approve(padContract.address, MaxUint256).then(estimatedGas => {
      return tokenContract.estimateGas.approve(padContract.address, parseEther(amount, decimals)).then(estimatedGasLimit => {
        const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
        return tokenContract.approve(padContract.address, parseEther(amount, decimals), {
          gasLimit: calculateGasMargin(gas)
        }).then((response: TransactionResponse) => {
          return response.hash
        })
      }).catch((error: any) => {
        const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGas
        return tokenContract.approve(padContract.address, MaxUint256, {
          gasLimit: calculateGasMargin(gas)
        }).then((response: TransactionResponse) => {
          return response.hash
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
    const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
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
          return response.hash
        })
      })
    } else {
      return padContract.estimateGas.deposit(parseEther(amount, decimals)).then(estimatedGas => {
        return padContract.estimateGas.deposit(parseEther(amount, decimals)).then(estimatedGasLimit => {
          const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
          return padContract.deposit(parseEther(amount, decimals), {
            gasLimit: calculateGasMargin(gas)
          }).then((response: TransactionResponse) => {
            return response.hash
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
    const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
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

export function useTokenBalance(tokenAddress: string, blockchain: string): BigNumber {
  const { account } = useEthers()
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0))
  const chainId = getChainIdFromName(blockchain);
  const { slowRefresh, fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchUserBalance = async () => {
      const tokenContract: Contract = getContract(tokenAddress, ERC20_ABI, RpcProviders[chainId], account ? account : undefined)
      const amount = await tokenContract.balanceOf(account)
      return amount
    }
    if (!!account && !!tokenAddress) {
      fetchUserBalance().then(result => {
        setBalance(result)
      }).catch(error => { })
    } else {
      setBalance(BigNumber.from(0))
    }
  }, [account, tokenAddress, slowRefresh])

  return balance
}

export function useTokenBalanceCallback(): { tokenBalanceCallback: (tokenAddress: string, blockchain: string) => Promise<BigNumber> } {
  const { account, library } = useEthers()
  const tokenBalanceCallback = async function (tokenAddress: string, blockchain: string) {
    const chainId = getChainIdFromName(blockchain);
    const tokenContract: Contract = getContract(tokenAddress, ERC20_ABI, RpcProviders[chainId], account ? account : undefined)
    return tokenContract.balanceOf(account).then((res: BigNumber) => {
      return res
    })
  }
  return { tokenBalanceCallback }
}

export function useFundTier(): number {
  const { account, library, chainId } = useEthers()
  const [currentTierNo, setCurrentTierNo] = useState(0)
  const connectedUserBalance = useTokenBalance(M31TokenAddress[chainId], 'bsc')

  useEffect(() => {
    const fetchFundTier = async () => {
      const formattedConnectedBalance = formatEther(connectedUserBalance)
      let tierResult = await getTierValues(ethers.BigNumber.from(Math.trunc(parseFloat(formattedConnectedBalance))))
      return tierResult.tierNo
    }
    if (!!account && !!library) {
      fetchFundTier().then(result => {
        setCurrentTierNo(result)
      }).catch(error => { })
    } else {
      setCurrentTierNo(0)
    }
  }, [account, library, connectedUserBalance])

  return currentTierNo
}

export function useTotalInvestedAmount(padContractAddress: string, blockchain: string): BigNumber {
  const { account } = useEthers()
  const [totalInvestedAmount, setTotalInvestedAmount] = useState<BigNumber>(BigNumber.from(0))
  const chainId = getChainIdFromName(blockchain);
  const { slowRefresh, fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchTotalInvestedAmount = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
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
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
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
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
      const availableTokens = await padContract.getAvailableTokens(account)
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

export function useVestingStartedAt(padContractAddress: string, blockchain: string): BigNumber {
  const { account } = useEthers()
  const [vestingStartedAt, setVestingStartedAt] = useState<BigNumber>(BigNumber.from(0))
  const chainId = getChainIdFromName(blockchain);
  const { slowRefresh, fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchVestingStartedAt = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
      const vestingat = await padContract.vestingStartedAt()
      return vestingat
    }
    if (padContractAddress) {
      fetchVestingStartedAt().then(result => {
        setVestingStartedAt(result)
      }).catch(error => { })
    }
  }, [padContractAddress, slowRefresh])

  return vestingStartedAt
}

export function useVestDuration(padContractAddress: string, blockchain: string): BigNumber {
  const { account } = useEthers()
  const [vestDuration, setVestDuration] = useState<BigNumber>(BigNumber.from(0))
  const chainId = getChainIdFromName(blockchain);
  const { slowRefresh, fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchVestDuration = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
      const vestDuration = await padContract.vestDuration()
      return vestDuration
    }
    if (padContractAddress) {
      fetchVestDuration().then(result => {
        setVestDuration(result)
      }).catch(error => { })
    }
  }, [padContractAddress, slowRefresh])

  return vestDuration
}

export function useStartTime(padContractAddress: string, blockchain: string): BigNumber {
  const { account } = useEthers()
  const [startTime, setStartTime] = useState<BigNumber>(BigNumber.from(0))
  const chainId = getChainIdFromName(blockchain);
  const { slowRefresh, fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchStartTime = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
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
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
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

export function useStartTimeForNonM31(padContractAddress: string, blockchain: string): BigNumber {
  const { account } = useEthers()
  const [startTimeForNonM31, setStartTimeForNonM31] = useState<BigNumber>(BigNumber.from(0))
  const chainId = getChainIdFromName(blockchain);
  const { slowRefresh, fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchStartTimeForNonM31 = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
      const timeat = await padContract.startTimeForNonM31()
      return timeat
    }
    if (padContractAddress) {
      fetchStartTimeForNonM31().then(result => {
        setStartTimeForNonM31(result)
      }).catch(error => { })
    }
  }, [padContractAddress, slowRefresh])

  return startTimeForNonM31
}

export function useEndTimeForNonM31(padContractAddress: string, blockchain: string): BigNumber {
  const { account } = useEthers()
  const [endTimeForNonM31, setEndTimeForNonM31] = useState<BigNumber>(BigNumber.from(0))
  const chainId = getChainIdFromName(blockchain);
  const { slowRefresh, fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchEndTimeForNonM31 = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
      const timeat = await padContract.endTimeForNonM31()
      return timeat
    }
    if (padContractAddress) {
      fetchEndTimeForNonM31().then(result => {
        setEndTimeForNonM31(result)
      }).catch(error => { })
    }
  }, [padContractAddress, slowRefresh])

  return endTimeForNonM31
}

export function useOpenedToNonM31Holders(padContractAddress: string, blockchain: string): boolean {
  const { account } = useEthers()
  const [openedToNonM31, setOpenedToNonM31] = useState(false)
  const chainId = getChainIdFromName(blockchain);
  const { slowRefresh, fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchOpenedToNonM31Holders = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
      const opened = await padContract.openedToNonM31Holders()
      return opened
    }
    if (padContractAddress) {
      fetchOpenedToNonM31Holders().then(result => {
        setOpenedToNonM31(result)
      }).catch(error => { })
    }
  }, [padContractAddress, slowRefresh])

  return openedToNonM31
}

export function useNativeTokenBalance(blockchain: string): BigNumber {
  const { account } = useEthers()
  const chainId = getChainIdFromName(blockchain);
  const [balance, setBalance] = useState(BigNumber.from(0))
  const { slowRefresh, fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchNativeToken = async () => {
      const balance = await RpcProviders[chainId].getBalance(account);
      return balance
    }
    if (account) {
      fetchNativeToken().then(result => {
        setBalance(result)
      }).catch(error => { })
    } else {
      setBalance(BigNumber.from(0))
    }
  }, [account, slowRefresh])
  return balance
}

export function useProjectStatus(ido: any): number {
  const startTime: BigNumber = useStartTime(ido ? ido.contractAddress : '', ido ? ido.blockchain : '')
  const endTime: BigNumber = useEndTime(ido ? ido.contractAddress : '', ido ? ido.blockchain : '')
  const startTimeForNonM31: BigNumber = useStartTimeForNonM31(ido ? ido.contractAddress : '', ido ? ido.blockchain : '')
  const endTimeForNonM31: BigNumber = useEndTimeForNonM31(ido ? ido.contractAddress : '', ido ? ido.blockchain : '')
  const openedToNonM31: boolean = useOpenedToNonM31Holders(ido ? ido.contractAddress : '', ido ? ido.blockchain : '')
  const vestingStartedAt: BigNumber = useVestingStartedAt(ido ? ido.contractAddress : '', ido ? ido.blockchain : '')
  const vestDuration: BigNumber = useVestDuration(ido ? ido.contractAddress : '', ido ? ido.blockchain : '')
  const [projectStatus, setProjectStatus] = useState(0)

  useEffect(() => {
    if (startTime && endTime && startTimeForNonM31 && endTimeForNonM31) {
      if (startTime.toNumber() > 0 && endTime.toNumber() > 0) {
        if (moment(moment.now()).isBefore(moment(startTime.toNumber() * 1000))) setProjectStatus(1) // presale opening soon
        if (moment(moment.now()).isSameOrAfter(moment(startTime.toNumber() * 1000))
          && moment(moment.now()).isBefore(moment(endTime.toNumber() * 1000))) setProjectStatus(2) // presale open
        if (moment(moment.now()).isSameOrAfter(moment(endTime.toNumber() * 1000))) setProjectStatus(3) // presale closed      
      }
      if (openedToNonM31) {
        if (startTimeForNonM31.toNumber() > 0 && endTimeForNonM31.toNumber() > 0) {
          if (moment(moment.now()).isSameOrAfter(moment(startTimeForNonM31.toNumber() * 1000))
            && moment(moment.now()).isBefore(moment(endTimeForNonM31.toNumber() * 1000))) setProjectStatus(4) // public presale open
          if (moment(moment.now()).isSameOrAfter(moment(endTimeForNonM31.toNumber() * 1000))) setProjectStatus(5) // public presale closed
        }
      }
    }
    if (vestingStartedAt && vestDuration) {
      let vestingEndAt = (vestingStartedAt.toNumber() + vestDuration.toNumber() * 2592000) //unix timestamp
      if (vestingStartedAt.toNumber() > 0 && vestDuration.toNumber() > 0) {
        if (moment(moment.now()).isSameOrAfter(moment(vestingStartedAt.toNumber() * 1000))
          && moment(moment.now()).isBefore(moment(vestingEndAt * 1000))) setProjectStatus(7) // vesting started
        if (moment(moment.now()).isSameOrAfter(moment(vestingEndAt * 1000))) setProjectStatus(8) // vesting closed
      }
    }
    if (ido) {
      if (ido?.launchDate > 0) {
        if (moment(moment.now()).isAfter(moment(ido?.launchDate * 1000))) {
          setProjectStatus(6) // project launched
        }
      }
    }
  }, [ido, startTime, endTime, startTimeForNonM31, endTimeForNonM31, openedToNonM31])

  return projectStatus
}

export function useMaxAllocationNonM31(padContractAddress: string, blockchain: string): BigNumber {
  const { account } = useEthers()
  const [maxAllocationNonM31, setMaxAllocationNonM31] = useState<BigNumber>(BigNumber.from(0))
  const chainId = getChainIdFromName(blockchain);

  useEffect(() => {
    const fetchMaxAllocationNonM31 = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
      const timeat = await padContract.maxAllocationNonM31()
      return timeat
    }
    if (padContractAddress) {
      fetchMaxAllocationNonM31().then(result => {
        setMaxAllocationNonM31(result)
      }).catch(error => { })
    }
  }, [padContractAddress])

  return maxAllocationNonM31
}

export function useInvestCap(padContractAddress: string, blockchain: string): BigNumber {
  const { account } = useEthers()
  const [investCap, setInvestCap] = useState<BigNumber>(BigNumber.from(0))
  const chainId = getChainIdFromName(blockchain);
  const { slowRefresh, fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchInvestCap = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, RpcProviders[chainId], account ? account : undefined)
      const timeat = await padContract.investCap()
      return timeat
    }
    if (padContractAddress) {
      fetchInvestCap().then(result => {
        setInvestCap(result)
      }).catch(error => { })
    }
  }, [padContractAddress, slowRefresh])

  return investCap
}



