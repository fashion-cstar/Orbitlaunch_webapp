import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useEthers, useToken, ChainId } from "@usedapp/core";
import { ethers } from "ethers";
import { getContract, parseEther, calculateGasMargin } from 'src/utils'
import ERC20_ABI from 'src/lib/contract/abis/erc20.json'
import PAD_ABI from 'src/lib/contract/abis/orbitpad.json'
import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'

export function fetchProjectList(): Promise<any | null> {
  return (fetch(`https://backend-api-pi.vercel.app/api/getProjects`)                 
    .then((res: any) => res.json())
    .then((data) => {
      return data
    })
    .catch(error => {
      console.error('Failed to get project list', error)
      throw error
    }))
}

export function useLaunchTokenPrice():{launchTokenPriceCallback: (padContractAddress: string) => Promise<BigNumber | undefined>} {
  const { account, library, chainId } = useEthers()    
  const launchTokenPriceCallback = async function(padContractAddress: string){    
    const padContract:Contract=getContract(padContractAddress, PAD_ABI, library, account ? account : undefined)    
    if (!padContract || !account) return
    return padContract.launchTokenPrice().then((res:BigNumber) => {      
      return res
    }).catch((error:any) => {
      console.debug(`Failed to get launchTokenPrice from OrbitPad Contract`, error)
      return
    })
  }
  return { launchTokenPriceCallback }
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
          return
        })
      }).catch((error: any) => {
        const gas = chainId === ChainId.BSC ? BigNumber.from(350000) : estimatedGas
        return tokenContract.approve(padContract.address, MaxUint256, {
          gasLimit: calculateGasMargin(gas)
          }).then((response: TransactionResponse) => {         
            return response.hash
        }).catch((error: any) => {
          return
        })        
      })                
    }).catch((error: any) => {
      return
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
          return
        })
      }).catch((error: any) => {
        return
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
            return
          })
        }).catch((error: any) => {
          return
        })                
      }).catch((error: any) => {
        console.log(error)
        return
      })
    }
  }

  return { joinPresaleCallback }
}