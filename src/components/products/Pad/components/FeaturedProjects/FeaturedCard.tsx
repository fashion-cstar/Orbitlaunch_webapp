import React, { useMemo, useState, useEffect, useRef  } from 'react'
import ChainIcon from "../ChainIcon"
import { getChainIdFromName } from 'src/utils'

interface UpcomingCardProps {
    ido: any
    firstCardIndex: number
    onDetail: (ido: any) => void
    options: any
}

export default function FeaturedCard({ ido, firstCardIndex, onDetail, options }: UpcomingCardProps) {

    let bgColor = (!!options && !!options.bgCard) ? options.bgCard : '#001926';
    let width = (!!options && !!options.width) ? options.width : '420px';
    let titleFontSize = (!!options && !!options.titleFontSize) ? options.titleFontSize : '24px';
    let descFontSize = (!!options && !!options.descFontSize) ? options.descFontSize : '16px';
    let imgHeight = (!!options && !!options.imgHeight) ? options.imgHeight : (!!options && !!options.width) ? `${Number(options.width.substr(0,options.width.length-2))*16/45}px` : '150px';
    
    const styling = {
        backgroundColor: bgColor,
        width
    }

    const titleSize = {
        fontSize: titleFontSize
    }

    const descSize = {
        fontSize: descFontSize
    }
    
    return (              
        <div className="pr-6" style={{ transform: `translateX(-${firstCardIndex * 100}%)`, transition: "transform 500ms ease 0s" }} onClick={() => onDetail(ido)}>
            <div className="rounded-2xl cursor-pointer hover:shadow-xl hover:scale-[1.038] hover:border-slate-400 hover:border" style={styling}>
                <div className="overflow-hidden" style={{ height: imgHeight }}>
                    <img className="w-full rounded-t-2xl" src={ido.projectBanner} alt={ido.projectName} />
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase mt-2">${ido.projectSymbol}</p>
                            <p className="text-white" style={titleSize}>{ido.projectName}</p>
                        </div>
                        <div>
                            <ChainIcon chainId={getChainIdFromName(ido.blockchain)} />
                        </div>
                    </div>
                    <p className="text-gray-500 mt-5" style={descSize}>Total Raise:{' '}
                        <span className="text-white">${ido.totalRaiseHardCap.toLocaleString()}</span>
                    </p>
                    <p className="text-gray-500 my-2" style={descSize}>Allocations:{' '}
                        <span className="text-white">{`$${ido.tierAllocation7} - $${ido.tierAllocation1}`}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}