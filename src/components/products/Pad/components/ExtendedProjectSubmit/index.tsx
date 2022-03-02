import React, { useMemo, useState, useEffect, useRef  } from 'react'
import Button from '@mui/material/Button'
import InputBox from '../Common/InputBox'
import TextArea from '../Common/TextArea'
import UploadFile from '../Common/UploadFile'
import ReCAPTCHA from "react-google-recaptcha"
import SelectBox from '../Common/SelectBox'

import { init_project_values } from './init_values';

export default function ProjectSubmitModal() { 
    const [project_values, setProjectValues] = useState(init_project_values)
    const chainlist=[{'label': "Ethereum", value: 1}, {'label': "Binance Smart Chain", value: 56}]
    const vestingreqlist=[{'label': "Yes", value: true}, {'label': "No", value: false}]
    const categorylist=[{'label': "Category1", value: 1}, {'label': "Category2", value: 2}]
    function onCaptchaChange(value) {
        console.log("Captcha value:", value);
    } 
    const onSubmitProject = () => {
   
    }

    return (
        <div>
            <div className='m-6'>
                <div className='text-white text-[] mt-6'>
                    Submit your project
                </div>
                <div className='flex flex-col space-y-4 mt-6'>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">  
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, project: val })} 
                                id="ep_project"
                                value={project_values.project} name="Project name" 
                                placeholder='Type something' type="text" required={true}/>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, symbol: val })}
                                id="ep_symbol"
                                value={project_values.symbol} name="Token symbol" 
                                placeholder='Type something' type="text" required={true}/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, contractAddr: val })} 
                                id="ep_contractAddr"
                                value={project_values.contractAddr} name="Contract Address" 
                                placeholder='Type something' type="text" required={true}/>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, KYCofDev: val })}
                                id="ep_KYCofDev"
                                value={project_values.KYCofDev} name="KYC Info" 
                                placeholder='Type something' type="text" required={true}/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">    
                        <div className="md:basis-1/2">
                            <div className='flex gap-4'>
                                <UploadFile onChange={(val: any) => setProjectValues({ ...project_values, logo: val })}
                                    name="Logo" placeholder='Upload file' id="ep_logo" />
                                <UploadFile onChange={(val: any) => setProjectValues({ ...project_values, banner: val })}
                                    name="Banner" placeholder='Upload file' id="ep_banner" />
                            </div>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, maxPerWallet: val })}
                                id="ep_maxPerWallet"
                                value={project_values.maxPerWallet} name="Max Buy Per Wallet" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                    </div>  
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, totalSoft: val })} 
                                id="ep_totalSoft"
                                value={project_values.totalSoft} name="Total Raise Soft Cap" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, totalHard: val })}
                                id="ep_totalHard"
                                value={project_values.totalHard} name="Total Raise Hard Cap" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                    </div>       
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <SelectBox onChange={(val: any) => setProjectValues({ ...project_values, vestingRequired: val })} 
                                value={project_values.vestingRequired} name="Total Raise Soft Cap" source={vestingreqlist} />
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, vestingLenInMonth: val })}
                                id="ep_vestingLenInMonth"
                                value={project_values.vestingLenInMonth} name="Vesting In Months" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                    </div>    
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, vestingReleasedAtLaunch: val })} 
                                id="ep_vestingReleasedAtLaunch"
                                value={project_values.vestingReleasedAtLaunch} name="Vesting % Released At Launch" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, vestingReleasedPerMonth: val })}
                                id="ep_vestingReleasedPerMonth"
                                value={project_values.vestingReleasedPerMonth} name="Vesting % Released Per Month" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, telegram: val })} 
                                id="ep_telegram"
                                value={project_values.telegram} name="Telegram" 
                                placeholder='Type something' type="url" required={true}/>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, twitter: val })}
                                id="ep_twitter"
                                value={project_values.twitter} name="Twitter" 
                                placeholder='Type something' type="url" required={true}/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, medium: val })} 
                                id="ep_medium"
                                value={project_values.medium} name="Medium" 
                                placeholder='Type something' type="url" required={true}/>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, website: val })}
                                id="ep_website"
                                value={project_values.website} name="Website" 
                                placeholder='Type something' type="url" required={true}/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <SelectBox onChange={(val: any) => setProjectValues({ ...project_values, totalSoft: val })} 
                                value={project_values.totalSoft} name="Total Raise Soft Cap" source={chainlist} />
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, github: val })}
                                id="ep_github"
                                value={project_values.github} name="Github" 
                                placeholder='Type something' type="url" required={true}/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, whitepaper: val })} 
                                id="ep_whitepaper"
                                value={project_values.whitepaper} name="Litepaper Or Whitepaper" 
                                placeholder='Type something' type="url" required={true}/>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, contractAudit: val })}
                                id="ep_contractAudit"
                                value={project_values.contractAudit} name="Contract Audit" 
                                placeholder='Type something' type="url" required={true}/>
                        </div>
                    </div>
                    <div className="flex justify-center">       
                                          
                        </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <TextArea onChange={(val: any) => setProjectValues({ ...project_values, shortDescription: val })}  
                                id="ep_shortDescription"
                                value={project_values.shortDescription} name="Project Short Description" 
                                placeholder='Type something' required={true}/>      
                        </div>
                        <div className='md:basis-1/2'>
                            <TextArea onChange={(val: any) => setProjectValues({ ...project_values, longDescription: val })}  
                                id="ep_longDescription"
                                value={project_values.longDescription} name="Project Long Description" 
                                placeholder='Type something' required={true}/>      
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <div className='flex flex-col gap-4'>
                                <UploadFile onChange={(val: any) => setProjectValues({ ...project_values, featureImage1: val })}
                                        name="Feature Image 1" placeholder='Upload file' id="ep_featureImage1" />
                                <TextArea onChange={(val: any) => setProjectValues({ ...project_values, featureText1: val })}  
                                    id="ep_featureText1"
                                    value={project_values.featureText1} name="Feature Image 1 Text" 
                                    placeholder='Type something' required={true}/>
                            </div>
                        </div>
                        <div className='md:basis-1/2'>
                            <div className='flex flex-col gap-4'>
                                <UploadFile onChange={(val: any) => setProjectValues({ ...project_values, featureImage2: val })}
                                        name="Feature Image 2" placeholder='Upload file' id="ep_featureImage2" />
                                <TextArea onChange={(val: any) => setProjectValues({ ...project_values, featureText2: val })}  
                                    id="ep_featureText2"
                                    value={project_values.featureText2} name="Feature Image 2 Text" 
                                    placeholder='Type something' required={true}/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <div className='flex flex-col gap-4'>
                                <UploadFile onChange={(val: any) => setProjectValues({ ...project_values, featureImage3: val })}
                                        name="Feature Image 3" placeholder='Upload file' id="ep_featureImage3" />
                                <TextArea onChange={(val: any) => setProjectValues({ ...project_values, featureText3: val })}  
                                    id="ep_featureText3"
                                    value={project_values.featureText3} name="Feature Image 3 Text" 
                                    placeholder='Type something' required={true}/>
                            </div>
                        </div>
                        <div className='md:basis-1/2'>
                            <div className='flex flex-col gap-4'>
                                <InputBox onChange={(val: any) => setProjectValues({ ...project_values, launchDate: val })}
                                    id="ep_launchDate"
                                    value={project_values.launchDate} name="Launch Date" 
                                    placeholder='Type something' type="date" required={true}/> 
                                <InputBox onChange={(val: any) => setProjectValues({ ...project_values, launchTime: val })}
                                    id="ep_launchTime"
                                    value={project_values.launchTime} name="Launch Time" 
                                    placeholder='Type something' type="time" required={true}/>
                                <InputBox onChange={(val: any) => setProjectValues({ ...project_values, lengthOfPresale: val })}
                                    id="ep_lengthOfPresale"
                                    value={project_values.lengthOfPresale} name="Length Of Presale (Hours)" 
                                    placeholder='Type something' type="number" required={true}/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, allocPerTier1: val })} 
                                id="ep_allocPerTier1"
                                value={project_values.allocPerTier1} name="Starting Allocation Tier 1" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, allocPerTier2: val })}
                                id="ep_allocPerTier2"
                                value={project_values.allocPerTier2} name="Starting Allocation Tier 2" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, allocPerTier3: val })} 
                                id="ep_allocPerTier3"
                                value={project_values.allocPerTier3} name="Starting Allocation Tier 3" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, allocPerTier4: val })}
                                id="ep_allocPerTier4"
                                value={project_values.allocPerTier4} name="Starting Allocation Tier 4" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, allocPerTier5: val })} 
                                id="ep_allocPerTier5"
                                value={project_values.allocPerTier5} name="Starting Allocation Tier 5" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, allocPerTier6: val })}
                                id="ep_allocPerTier6"
                                value={project_values.allocPerTier6} name="Starting Allocation Tier 6" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">       
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, allocPerTier7: val })} 
                                id="ep_allocPerTier7"
                                value={project_values.allocPerTier7} name="Starting Allocation Tier 7" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                        <div className='md:basis-1/2'>
                            <InputBox onChange={(val: any) => setProjectValues({ ...project_values, allocIncreasedBy: val })}
                                id="ep_allocIncreasedBy"
                                value={project_values.allocIncreasedBy} name="Allocation Increased By 50%" 
                                placeholder='Type something' type="number" required={true}/>
                        </div>
                    </div>
                    <div className='flex justify-center items-center py-4'>
                        <ReCAPTCHA
                            sitekey={process.env.ReCAPTCHA_key}
                            onChange={onCaptchaChange}
                        />,
                        <Button
                            variant="contained"                            
                            sx={{minWidth:"120px", height:"40px", borderRadius:"12px"}}
                            onClick={onSubmitProject}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>            
        </div>
    );
}
