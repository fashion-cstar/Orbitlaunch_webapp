import React, { useMemo, useState, useEffect, useRef  } from 'react'

export default function Detail({ido}:{ido:any}) {    
   
    return (
        <div className="w-full">
            <div>
                <img src={ido.projectBanner} className='w-full rounded-2xl'/>
            </div>
            <div className="rounded-2xl bg-[#001926] mt-6 p-4">
                <div className="text-[11px] font-bold uppercase text-app-primary">
                    <span>Description</span>
                </div>
                <div className="mt-2">
                    <div className='text-white text-[24px]'>
                        <span>About the project</span>
                    </div>
                    <div className='text-[#919699] text-[16px] mt-2'>
                        <p>{ido.shortDescription}</p>
                        <br />
                        <p>{ido.description}</p>
                    </div>
                </div>
                <div className='mt-12'>
                    <div className="text-[11px] font-bold uppercase text-app-primary">
                        <span>Features</span>
                    </div>
                    <div className='mt-4'>
                        <div className='text-[#919699] text-[16px]'>
                            <p>{ido.featureText1}</p>   
                        </div>
                        <div className='flex items-center justify-start mt-6'>
                            <img src={ido.featureImage1} className='w-[480px] rounded-2xl' />
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div className='text-[#919699] text-[16px]'>
                            <p>{ido.featureText2}</p>   
                        </div>
                        <div className='flex items-center justify-start mt-6'>
                            <img src={ido.featureImage2} className='w-[480px] rounded-2xl' />
                        </div>
                    </div>
                    <div className='mt-4'>
                        <div className='text-[#919699] text-[16px]'>
                            <p>{ido.featureText3}</p>   
                        </div>
                        <div className='flex items-center justify-start mt-6'>
                            <img src={ido.featureImage3} className='w-[480px] rounded-2xl' />
                        </div>
                    </div>
                </div>
                <div className='mt-12'>
                    <div className="text-[11px] font-bold uppercase text-app-primary mt-2">
                        <span>Creators</span>
                    </div>
                    {/* <div className='text-[#919699] text-[16px] mt-4'>
                        <li>{ido.creator1}</li>
                        <li>{ido.creator2}</li>
                        <li>{ido.creator3}</li>
                        <li>{ido.creator4}</li>
                    </div> */}
                </div>
            </div>
        </div>
    )
}