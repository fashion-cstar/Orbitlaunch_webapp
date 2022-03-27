import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { useCallback, useEffect, useMemo, useState } from "react"
import { useEthers, ChainId } from "@usedapp/core"
import { getContract } from 'src/utils'
import ERC20_ABI from 'src/lib/contract/abis/erc20.json'
import { RpcProviders } from "@app/shared/PadConstant"
import { getChainIdFromName } from 'src/utils'
import useRefresh from './useRefresh'

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

export function useToken(tokenContractAddress: string, blockchain: string): { name: string, symbol: string, decimals: number } {
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
