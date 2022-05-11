import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from "@ethersproject/units"
import { Contract } from '@ethersproject/contracts'
import { useEthers, ChainId } from "@usedapp/core"
import { getContract, parseEther, calculateGasMargin } from 'src/utils'
import MigrateABI from 'src/lib/contract/abis/MigrateABI.json'
import { TransactionResponse } from '@ethersproject/providers'
import { getChainIdFromName, PROJECT_STATUS } from 'src/utils'
import { RpcProviders } from "@app/shared/PadConstant"

export function useMigrationCallback(): {
  migrationCallback: (migrateContractAddress: string, tokenContractAddress: string, amount: number, blockchain: string) => Promise<string>
} {
  // get claim data for this account
  const { account, library, chainId } = useEthers()

  const migrationCallback = async function (migrateContractAddress: string, tokenContractAddress: string, amount: number, blockchain: string) {
    const chainId = getChainIdFromName(blockchain);
    const migrateContract: Contract = getContract(migrateContractAddress, MigrateABI, library, account ? account : undefined)

    if (!account || !library || !migrateContract) return
    
    return migrateContract.estimateGas.deposit().then(estimatedGasLimit => {
      const gas = chainId === ChainId.BSC || chainId === ChainId.BSCTestnet ? BigNumber.from(350000) : estimatedGasLimit
      return migrateContract.deposit({
        gasLimit: calculateGasMargin(gas)
      }).then((response: TransactionResponse) => {
        return response.hash
      })
    })    
  }

  return { migrationCallback }
}

