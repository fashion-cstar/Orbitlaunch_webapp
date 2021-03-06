import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Button } from "@mui/material"
import { useLaunchTokenCallback, useWhitelistedCallback, useProjectStatus } from 'src/state/Pad/orbit_hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from 'src/utils'
import { useEthers } from "@usedapp/core"
import { getProjectStatusText, PROJECT_STATUS } from 'src/utils'
import { Web3ModalButton } from "@app/components/WalletConnect/Web3Modal"
import OrbitJoinPresale from './JoinPresale'
import OrbitClaim from './Claim'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade';

const IdoProject = { contractAddress: '0xa9921C7a252011336009ACc2723f89c409EF0e3D', blockchain: 'bsc', launchDate: 0, projectSymbol: 'ORBIT', projectIcon: './images/launchpad/TokenIcons/orbit.ico' }
export default function OrbitWhitelist() {
    const [launchTokenPrice, setLaunchTokenPrice] = useState(0)
    const { launchTokenPriceCallback } = useLaunchTokenCallback()
    const { whitelistedCallback } = useWhitelistedCallback()
    const { library, account, chainId } = useEthers()
    const projectStatus = useProjectStatus(IdoProject)
    const activateProvider = Web3ModalButton()
    const [userWhitelisted, setUserWhitelisted] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        try {
            launchTokenPriceCallback(IdoProject.contractAddress, IdoProject.blockchain).then((res: BigNumber) => {
                setLaunchTokenPrice(formatEther(res, 18, 5))
            }).catch((error: any) => {
                console.log(error)
            })
        } catch (error) {
            console.debug('Failed to get launch price', error)
        }
    }, [])

    useEffect(() => {
        if (account) {
            setLoading(true)
            try {
                whitelistedCallback(IdoProject.contractAddress, IdoProject.blockchain).then((res: boolean) => {
                    if (res) setUserWhitelisted(true)
                    else setUserWhitelisted(false)
                    setLoading(false)
                }).catch((error: any) => {
                    setUserWhitelisted(false)
                    setLoading(false)
                    console.log(error)
                })
            } catch (error) {
                setUserWhitelisted(false)
                setLoading(false)
                console.debug('Failed to get launch price', error)
            }
        } else {
            setUserWhitelisted(false)
        }
    }, [account])
    return (
        <>
            <div className='w-full h-[600px] flex flex-col justify-center items-center'>
                {!account && <div className='flex flex-col gap-6 justify-center items-center text-[24px] text-white'>
                    <div>Connect your wallet to access presale</div>
                    <Button
                        variant="outlined"
                        onClick={activateProvider}
                        className="relative"
                        sx={{ borderRadius: "12px" }}
                    >
                        Connect Wallet
                    </Button>
                </div>}
                {account && loading && <Fade in={true} style={{ transitionDelay: '800ms' }} unmountOnExit>
                    <CircularProgress />
                </Fade>}
                {account && !userWhitelisted && !loading && <div className='flex flex-col justify-center items-center gap-6 text-white'>
                    <span className='text-[24px]'>Not authorised...</span>
                    <span className='text-[16px] text-center'>
                        Please check the wallet you connected with is the wallet which you provided to be whitelisted<br />
                        Contact us if you believe you are seeing this in error.
                    </span>
                </div>}
                {account && userWhitelisted && <>
                    {projectStatus >= PROJECT_STATUS.VestingStarted && projectStatus <= PROJECT_STATUS.VestingClosed ?
                        (<OrbitClaim project={IdoProject}
                            launchTokenPrice={launchTokenPrice} />) :
                        (<>
                            <OrbitJoinPresale project={IdoProject}
                                launchTokenPrice={launchTokenPrice}
                                currentTierNo={0} projectStatus={projectStatus} />
                            <div className='text-[14px] text-white'>
                                Once you have reserved your tokens you will be able to return to this page on 5th of May to claim your tokens.
                            </div>
                        </>)}
                </>}
            </div>
        </>
    )
}