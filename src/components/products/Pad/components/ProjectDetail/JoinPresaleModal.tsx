import React, { useMemo, useState, useEffect, useRef  } from 'react'
import Button from '@mui/material/Button';
import Modal from '../Common/Modal';
import InputBox from '../Common/InputBox';
import FundTokenInput from '../Common/FundTokenInput'
import ProjectTokenInput from '../Common/ProjectTokenInput'
import { useEthers, useToken, ChainId } from "@usedapp/core";
import { useJoinPresaleCallback, usePadApproveCallback, useLaunchTokenPrice } from 'src/state/Pad/hooks'
import { AddressZero } from '@ethersproject/constants'
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import { BigNumber } from '@ethersproject/bignumber';
import { formatEther } from 'src/utils'

interface PresaleModalProps {
    isOpen: boolean
    handleClose:() => void
    project: any
}

export default function JoinPresaleModal({isOpen, handleClose, project}:PresaleModalProps) {
    const [hash, setHash] = useState<string | undefined>()
    const [attempting, setAttempting] = useState(false)
    const { library, account, chainId } = useEthers()  
    const [fundTokenAmount, setFundTokenAmount] = useState(0)
    const [projectTokenAmount, setProjectTokenAmount] = useState(0)
    const { joinPresaleCallback } = useJoinPresaleCallback()
    const { padApproveCallback } = usePadApproveCallback()
    const { launchTokenPriceCallback} = useLaunchTokenPrice()
    const [isApproved, setIsApproved] = useState(false)
    const [isDeposited, setDeposited] = useState(false)  
    const [launchTokenPrice, setLaunchTokenPrice] = useState(0)
    const tokenAddress='0xcbdeb985e2189e615eae14f5784733c0122c253c'
    
    useEffect(() => {            
        try{        
            launchTokenPriceCallback(project.contractAddress).then((res:BigNumber) => {
                setLaunchTokenPrice(formatEther(res, 18, 5))
        }).catch((error:any) => {              
            console.log(error)
        })  
        }catch(error){
            console.debug('Failed to approve token', error)            
        }
    }, [account])

    async function onApprove() {     
        // if (tokenAddress===AddressZero){          
        //     setIsApproved(true)
        // }else{          
        try{        
            padApproveCallback(project.contractAddress, tokenAddress, fundTokenAmount).then((hash:string) => {
            setIsApproved(true)
            onDeposit()
        }).catch((error:any) => {              
            console.log(error)
        })  
        }catch(error){
            console.debug('Failed to approve token', error)            
        }
        // }
        return null;
      }
      
      const successDeposited=() => {
        
      }

      async function onDeposit() {    
        try{      
            setAttempting(true)        
            console.log("AAAAAAAAAAAAAAA")        
            joinPresaleCallback(project.contractAddress, tokenAddress,  fundTokenAmount).then((hash:string) => {
                setHash(hash)
                successDeposited()
            }).catch(error => {
                setAttempting(false)
                console.log(error)
            })      
        }catch(error){
            setAttempting(false)
            console.log(error)
        }    
        return null;
    }

    const onFundTokenChange = (val:any) => {
        if (Number(val)!==NaN) setFundTokenAmount(Number(val))
        else setFundTokenAmount(0)
        if (launchTokenPrice){
            setProjectTokenAmount(Number(val)/launchTokenPrice)
        }
    }

    const onProjectTokenChange = (val:any) => {
        if (Number(val)!==NaN) setProjectTokenAmount(Number(val))
        else setFundTokenAmount(0)
        if (launchTokenPrice){
            setFundTokenAmount(Number(val)*launchTokenPrice)
        }
    }

    const onMax = () => {

    }

    const onclose = () => {        
        setHash(undefined)
        setAttempting(false)
        setIsApproved(false)
        setDeposited(false)        
        handleClose()
    }

    return (
        <div>            
            <Modal
                isOpen={isOpen}
                header="Join Presale Now"
                handleClose={onclose}
            >
                {!attempting && !hash && (<div className='m-4 md:m-6 w-[300px] md:w-[400px]'>
                    {/* <div className='text-white text-[32px] mt-6'>
                        Join Presale Now
                    </div> */}
                    <div className='flex flex-col space-y-4 mt-6'>
                        <FundTokenInput onChange={(val:any) => onFundTokenChange(val)} 
                            value={fundTokenAmount} name="BUSD" icon="./images/launchpad/TokenIcons/busd.svg" />
                        <ProjectTokenInput onChange={(val:any) => onProjectTokenChange(val)} onMax={onMax}
                            value={projectTokenAmount} name={project.projectSymbol} icon={project.projectIcon} />
                        <Button
                            variant="contained"
                            sx={{width:"100%", borderRadius:"12px"}}
                            onClick={onApprove}
                            disabled={!account}
                        >
                            Reserve your tokens now
                        </Button>
                    </div>
                </div>)}
                {attempting && !hash && (
                    <div className="flex justify-center items-center h-[300px]">
                        <Fade in={true} style={{ transitionDelay: '800ms' }} unmountOnExit>
                            <CircularProgress />
                        </Fade>
                    </div>
                )}
                {hash && (
                    <div className='flex flex-col gap-8'>
                        <div className='text-white text-[14px]'>
                            {hash}
                        </div>
                        <div className='text-white text-[14px]'>
                            Deposited {fundTokenAmount}{' '}{project.projectSymbol}
                        </div>
                    </div>              
                )}
            </Modal>
        </div>
    );
}
