import React, { useRef, useState, useEffect } from 'react'

export default function PromotedVideos() {

    return (
        <div className="rounded-2xl bg-[#001926] p-4 h-full">
            <div className="text-[18px] md:text-[24px] text-white my-3">
                Promoted Videos
            </div>
            <div className='flex flex-col gap-4 w-full mt-4'>
                <div className="flex justify-center items-center flex-col sm:flex-row w-full gap-4">
                    <div className='w-full'>
                        <iframe src="videos/OrbitFundEasyDemo.mp4"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="autoplay; picture-in-picture"
                            allowFullScreen={true}>
                        </iframe>
                    </div>
                    <div className='w-full'>
                        <iframe src="videos/OrbitFundEasyDemo.mp4"
                            className=""
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="autoplay; picture-in-picture"
                            allowFullScreen={true}>
                        </iframe>
                    </div>
                </div>
                <div className="flex justify-center items-center flex-col sm:flex-row w-full gap-4">
                    <div className='w-full'>
                        <iframe src="videos/OrbitFundEasyDemo.mp4"
                            className=""
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="autoplay; picture-in-picture"
                            allowFullScreen={true}>
                        </iframe>
                    </div>
                    <div className='w-full'>
                        <iframe src="videos/OrbitFundEasyDemo.mp4"
                            className=""
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allow="autoplay; picture-in-picture"
                            allowFullScreen={true}>
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    )
}