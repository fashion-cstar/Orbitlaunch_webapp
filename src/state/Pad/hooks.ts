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

export function useDepositInfo(padContractAddress: string):BigNumber {
  const { account, library, chainId } = useEthers()      
  const [ userDeposited, setUserDeposited ] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {    
    const fetchUserDespoisted = async () => {     
      const padContract:Contract=getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)   
      const amount = await padContract.depositInfos(account)         
      return amount
    }
    if (!!account && !!library) {
      fetchUserDespoisted().then(result => {
        setUserDeposited(result)
      }).catch(console.error)
    } 
  }, [account, library])

  return userDeposited
}

export function useLaunchTokenPrice():{launchTokenPriceCallback: (padContractAddress: string) => Promise<BigNumber | undefined>} {
  const { account, library } = useEthers()    
  const launchTokenPriceCallback = async function(padContractAddress: string){    
    const padContract:Contract=getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)    
    if (!padContract || !account) return    
    return padContract.launchTokenPrice().then((res:BigNumber) => {      
      return res
    }).catch((error:any) => {
      console.error("ERROR: " + error.data?.message)
    })
  }
  return { launchTokenPriceCallback }
}

export function useTokenAllowance():{tokenAllowanceCallback: (owner: string, spender: string, tokenContractAddress: string) => Promise<BigNumber>} {
  const { account, library } = useEthers()    
  const tokenAllowanceCallback = async function(owner: string, spender: string, tokenContractAddress: string){    
    const tokenContract:Contract=getContract(tokenContractAddress, ERC20_ABI, library, account ? account : undefined)       
    return tokenContract.allowance(owner, spender).then((res:BigNumber) => {      
      return res
    }).catch((error:any) => {
      console.error("ERROR: " + error.data?.message)
    })
  }
  return { tokenAllowanceCallback }
}

export function usePadApproveCallback():
 {padApproveCallback: (padContractAddress: string, tokenContractAddress: string, amount: number) => Promise<string>
} {
  const { account, library, chainId } = useEthers()
  const padApproveCallback = async function(padContractAddress: string, tokenContractAddress: string, amount: number) {
    const padContract:Contract=getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)
    const tokenContract:Contract=getContract(tokenContractAddress, ERC20_ABI, library, account ? account : undefined)    
    let decimals=await tokenContract.decimals()
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

  const joinPresaleCallback = async function(padContractAddress: string, tokenContractAddress: string, amount: number) {
    const padContract:Contract=getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)    
    const tokenContract:Contract=getContract(tokenContractAddress, ERC20_ABI, library, account ? account : undefined)    
    let decimals=await tokenContract.decimals()
    if (!account || !library || !chainId || !padContract) return       
    if (tokenContractAddress===AddressZero){ 
      return padContract.estimateGas.deposit(parseEther(amount, decimals), {
        value:parseEther(amount, decimals)
      }).then(estimatedGasLimit => {
        const gas = chainId === ChainId.BSC ? BigNumber.from(350000) : estimatedGasLimit
        return padContract.deposit(parseEther(amount, decimals), {
          gasLimit: calculateGasMargin(gas), value:parseEther(amount, decimals)
          }).then((response: TransactionResponse) => {                
            return response.hash
        }).catch((error: any) => {
          console.error("Join Presale Error: " + error.data?.message)
        })
      }).catch((error: any) => {
        console.error("Join Presale Error: " + error.data?.message)
      })
    }else{      
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

export function useTokenBalance(tokenAddress: string):BigNumber {
  const { account, library, chainId } = useEthers()      
  const [ balance, setBalance ] = useState<BigNumber>(BigNumber.from(0))

  useEffect(() => {    
    const fetchUserBalance = async () => {     
      const tokenContract:Contract=getContract(tokenAddress, ERC20_ABI, library, account ? account : undefined)
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

export function useFundTier():number {
  const { account, library, chainId } = useEthers()
  // const connectedUserBalance = useTokenBalance(M31TokenAddress[chainId], account)
  const [ currentTierNo, setCurrentTierNo ] = useState(0)
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