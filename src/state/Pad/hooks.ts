import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { useEffect, useMemo, useState } from "react"
import { useEthers, useToken, ChainId } from "@usedapp/core"
import { ethers } from "ethers"
import { getContract, parseEther, calculateGasMargin } from 'src/utils'
import ERC20_ABI from 'src/lib/contract/abis/erc20.json'
import PAD_ABI from 'src/lib/contract/abis/orbitpad.json'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { M31TokenAddress } from "@app/shared/PadConstant"
import { getTierValues } from '@app/shared/TierLevels'

export function fetchProjectList(): Promise<any | null> {
  return (fetch(`https://backend-api-pi.vercel.app/api/getProjects`)
    .then((res: any) => res.json())
    .then((data) => {
      return data
    })
    .catch(error => {
      console.error("Failed to get project list: " + error.data?.message)
    }))
}

export function useDepositInfo(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [userDeposited, setUserDeposited] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchUserDeposited = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const amount = await padContract.depositInfos(account)
      return amount
    }
    if (!!account && !!library) {
      fetchUserDeposited().then(result => {
        setUserDeposited(result)
      }).catch(console.error)
    }
  }, [account, library])

  return userDeposited
}

export function useLaunchTokenCallback(): { 
  launchTokenPriceCallback: (padContractAddress: string) => Promise<BigNumber | undefined>,
  launchTokenDecimalsCallback: (padContractAddress: string) => Promise<BigNumber | undefined>
} {
  const { account, library } = useEthers()
  const launchTokenPriceCallback = async function (padContractAddress: string) {
    const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
    if (!padContract) return
    return padContract.launchTokenPrice().then((res: BigNumber) => {
      return res
    }).catch((error: any) => {
      console.error("ERROR: " + error.data?.message)
    })
  }

  const launchTokenDecimalsCallback = async function (padContractAddress: string) {
    const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
    if (!padContract) return
    return padContract.launchTokenDecimals().then((res: BigNumber) => {
      return res
    }).catch((error: any) => {
      console.error("ERROR: " + error.data?.message)
    })
  }

  return { launchTokenPriceCallback, launchTokenDecimalsCallback }
}

export function useLaunchTokenPrice(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [launchTokenPrice, setLaunchTokenPrice] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchLaunchTokenPrice = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const price = await padContract.launchTokenPrice()
      return price
    }
    if (!!account && !!library) {
      fetchLaunchTokenPrice().then(result => {
        setLaunchTokenPrice(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return launchTokenPrice
}

export function uselaunchTokenDecimals(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [launchTokenDecimals, setLaunchTokenDecimals] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchLaunchTokenDecimals = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const decimals = await padContract.launchTokenDecimals()
      return decimals
    }
    if (!!account && !!library) {
      fetchLaunchTokenDecimals().then(result => {
        setLaunchTokenDecimals(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return launchTokenDecimals
}

export function useTokenAllowance(): { tokenAllowanceCallback: (owner: string, spender: string, tokenContractAddress: string) => Promise<BigNumber> } {
  const { account, library } = useEthers()
  const tokenAllowanceCallback = async function (owner: string, spender: string, tokenContractAddress: string) {
    const tokenContract: Contract = getContract(tokenContractAddress, ERC20_ABI, library, account ? account : undefined)
    return tokenContract.allowance(owner, spender).then((res: BigNumber) => {
      return res
    }).catch((error: any) => {
      console.error("ERROR: " + error.data?.message)
    })
  }
  return { tokenAllowanceCallback }
}

export function usePadApproveCallback(): {
  padApproveCallback: (padContractAddress: string, tokenContractAddress: string, amount: number) => Promise<string>
} {
  const { account, library, chainId } = useEthers()
  const padApproveCallback = async function (padContractAddress: string, tokenContractAddress: string, amount: number) {
    const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
    const tokenContract: Contract = getContract(tokenContractAddress, ERC20_ABI, library, account ? account : undefined)
    let decimals = await tokenContract.decimals()
    if (!account || !library || !chainId || !padContract) return
    return tokenContract.estimateGas.approve(padContract.address, MaxUint256).then(estimatedGas => {
      return tokenContract.estimateGas.approve(padContract.address, parseEther(amount, decimals)).then(estimatedGasLimit => {
        const gas = chainId === ChainId.BSC ? BigNumber.from(350000) : estimatedGasLimit
        return tokenContract.approve(padContract.address, parseEther(amount, decimals), {
          gasLimit: calculateGasMargin(gas)
        }).then((response: TransactionResponse) => {
          return response.hash
        }).catch((error: any) => {
          console.error("Approve Error: " + error.data?.message)
        })
      }).catch((error: any) => {
        const gas = chainId === ChainId.BSC ? BigNumber.from(350000) : estimatedGas
        return tokenContract.approve(padContract.address, MaxUint256, {
          gasLimit: calculateGasMargin(gas)
        }).then((response: TransactionResponse) => {
          return response.hash
        }).catch((error: any) => {
          console.error("Approve Error: " + error.data?.message)
        })
      })
    }).catch((error: any) => {
      console.error("Approve Error: " + error.data?.message)
    })
  }
  return { padApproveCallback }
}
export function useJoinPresaleCallback(): {
  joinPresaleCallback: (padContractAddress: string, tokenContractAddress: string, amount: number) => Promise<string>
} {
  // get claim data for this account
  const { account, library, chainId } = useEthers()

  const joinPresaleCallback = async function (padContractAddress: string, tokenContractAddress: string, amount: number) {
    const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
    const tokenContract: Contract = getContract(tokenContractAddress, ERC20_ABI, library, account ? account : undefined)
    let decimals = await tokenContract.decimals()
    if (!account || !library || !chainId || !padContract) return
    if (tokenContractAddress === AddressZero) {
      return padContract.estimateGas.deposit(parseEther(amount, decimals), {
        value: parseEther(amount, decimals)
      }).then(estimatedGasLimit => {
        const gas = chainId === ChainId.BSC ? BigNumber.from(350000) : estimatedGasLimit
        return padContract.deposit(parseEther(amount, decimals), {
          gasLimit: calculateGasMargin(gas), value: parseEther(amount, decimals)
        }).then((response: TransactionResponse) => {
          return response.hash
        }).catch((error: any) => {
          console.error("Join Presale Error: " + error.data?.message)
        })
      }).catch((error: any) => {
        console.error("Join Presale Error: " + error.data?.message)
      })
    } else {
      return padContract.estimateGas.deposit(parseEther(amount, decimals)).then(estimatedGas => {
        return padContract.estimateGas.deposit(parseEther(amount, decimals)).then(estimatedGasLimit => {
          const gas = chainId === ChainId.BSC ? BigNumber.from(350000) : estimatedGasLimit
          return padContract.deposit(parseEther(amount, decimals), {
            gasLimit: calculateGasMargin(gas)
          }).then((response: TransactionResponse) => {
            return response.hash
          }).catch((error: any) => {
            console.error("Join Presale Error: " + error.data?.message)
          })
        }).catch((error: any) => {
          console.error("Join Presale Error: " + error.data?.message)
        })
      }).catch((error: any) => {
        console.error("Join Presale Error: " + error.data?.message)
      })
    }
  }

  return { joinPresaleCallback }
}

export function useClaimCallback(): {
  ClaimCallback: (padContractAddress: string) => Promise<string>,
} {
  const { account, library, chainId } = useEthers()

  const ClaimCallback = async function (padContractAddress: string) {
    if (!account || !library || !chainId || !padContractAddress) return
    const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
    return padContract.estimateGas.claim().then(estimatedGasLimit => {
      const gas = chainId === ChainId.BSC ? BigNumber.from(350000) : estimatedGasLimit
      return padContract
        .claim({ gasLimit: calculateGasMargin(gas) })
        .then((response: TransactionResponse) => {          
          return response.hash
        }).catch((error: any) => {
          console.error("Claiming Error: " + error.data?.message);
        })
    })
  }
  return { ClaimCallback }
}

export function useTokenBalance(tokenAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchUserBalance = async () => {
      const tokenContract: Contract = getContract(tokenAddress, ERC20_ABI, library, account ? account : undefined)
      const amount = await tokenContract.balanceOf(account)
      return amount
    }
    if (!!account && !!library) {
      fetchUserBalance().then(result => {
        setBalance(result)
      }).catch(console.error)
    }
  }, [account, library])

  return balance
}

export function useFundTier(): number {
  const { account, library, chainId } = useEthers()
  // const connectedUserBalance = useTokenBalance(M31TokenAddress[chainId], account)
  const [currentTierNo, setCurrentTierNo] = useState(0)
  const connectedUserBalance = useTokenBalance(M31TokenAddress[chainId])
  useEffect(() => {
    const fetchFundTier = async () => {
      const formattedConnectedBalance = formatEther(connectedUserBalance)
      let tierResult = await getTierValues(ethers.BigNumber.from(Math.trunc(parseFloat(formattedConnectedBalance))))
      return tierResult.tierNo
    }
    if (!!account && !!library) {
      fetchFundTier().then(result => {
        setCurrentTierNo(result)
      }).catch(console.error)
    }
  }, [account, library, connectedUserBalance])

  return currentTierNo
}

export function useTotalInvestedAmount(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [totalInvestedAmount, setTotalInvestedAmount] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchTotalInvestedAmount = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const amount = await padContract.totalInvestedAmount()
      return amount
    }
    if (!!padContractAddress && !!library) {
      fetchTotalInvestedAmount().then(result => {
        setTotalInvestedAmount(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return totalInvestedAmount
}

export function useGetTotalInvestors(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [totalInvestors, setTotalInvestors] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchGetTotalInvestors = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const amount = await padContract.getTotalInvestors()
      return amount
    }
    if (!!account && !!library) {
      fetchGetTotalInvestors().then(result => {
        setTotalInvestors(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return totalInvestors
}

export function useVestingStartedAt(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [vestingStartedAt, setVestingStartedAt] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchVestingStartedAt = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const vestingat = await padContract.vestingStartedAt()
      return vestingat
    }
    if (!!account && !!library) {
      fetchVestingStartedAt().then(result => {
        setVestingStartedAt(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return vestingStartedAt
}

export function useStartTime(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [startTime, setStartTime] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchStartTime = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const timeat = await padContract.startTime()
      return timeat
    }
    if (!!account && !!library) {
      fetchStartTime().then(result => {
        setStartTime(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return startTime
}

export function useEndTime(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [endTime, setEndTime] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchEndTime = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const timeat = await padContract.endTime()
      return timeat
    }
    if (!!account && !!library) {
      fetchEndTime().then(result => {
        setEndTime(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return endTime
}

export function useStartTimeForNonM31(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [startTimeForNonM31, setStartTimeForNonM31] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchStartTimeForNonM31 = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const timeat = await padContract.startTimeForNonM31()
      return timeat
    }
    if (!!account && !!library) {
      fetchStartTimeForNonM31().then(result => {
        setStartTimeForNonM31(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return startTimeForNonM31
}

export function useEndTimeForNonM31(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [endTimeForNonM31, setEndTimeForNonM31] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchEndTimeForNonM31 = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const timeat = await padContract.endTimeForNonM31()
      return timeat
    }
    if (!!account && !!library) {
      fetchEndTimeForNonM31().then(result => {
        setEndTimeForNonM31(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return endTimeForNonM31
}

export function useMaxAllocationNonM31(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [maxAllocationNonM31, setMaxAllocationNonM31] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchMaxAllocationNonM31 = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const timeat = await padContract.maxAllocationNonM31()
      return timeat
    }
    if (!!account && !!library) {
      fetchMaxAllocationNonM31().then(result => {
        setMaxAllocationNonM31(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return maxAllocationNonM31
}

export function useVestDuration(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [vestDuration, setVestDuration] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchVestDuration = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const timeat = await padContract.vestDuration()
      return timeat
    }
    if (!!account && !!library) {
      fetchVestDuration().then(result => {
        setVestDuration(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return vestDuration
}

export function useInvestCap(padContractAddress: string): BigNumber {
  const { account, library, chainId } = useEthers()
  const [investCap, setInvestCap] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {
    const fetchInvestCap = async () => {
      const padContract: Contract = getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
      const timeat = await padContract.investCap()
      return timeat
    }
    if (!!account && !!library) {
      fetchInvestCap().then(result => {
        setInvestCap(result)
      }).catch(console.error)
    }
  }, [padContractAddress, account])

  return investCap
}



