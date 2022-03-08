import React, { useMemo, useState, useEffect, useRef } from 'react'
import ChainIcon from "../ChainIcon"
import { useProjectStatus } from 'src/state/Pad/hooks'
import { getProjectStatusText } from 'src/utils'

interface UpcomingCardProps {
    ido: any
    firstCardIndex: number
    onDetail: (ido: any) => void
    options: any
}

export default function FeaturedCard({ ido, firstCardIndex, onDetail, options }: UpcomingCardProps) {
    const projectStatus=useProjectStatus(ido)
    let bgColor = (!!options && !!options.bgCard) ? options.bgCard : '#001926';
    let width = (!!options && !!options.width) ? options.width : '420px';
    let titleFontSize = (!!options && !!options.titleFontSize) ? options.titleFontSize : '24px';
    let descFontSize = (!!options && !!options.descFontSize) ? options.descFontSize : '16px';
    let imgHeight = (!!options && !!options.imgHeight) ? options.imgHeight : (!!options && !!options.width) ? `${Number(options.width.substr(0, options.width.length - 2)) * 16 / 45}px` : '150px';

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

    const statusBgColor=(ps:number) => {
        if (ps===3 || ps===5) return "#06111C"
        if (ps===6) return "#00D98D"
        return "#29D9D0"
    }

    const statusTxtColor=(ps:number) => {
        if (ps===3 || ps===5) return "#ffffff"
        return "#000000"
    }

    return (
        <div className="pr-6" style={{ transform: `translateX(-${firstCardIndex * 100}%)`, transition: "transform 500ms ease 0s" }} onClick={() => onDetail(ido)}>
            <div className="rounded-2xl cursor-pointer hover:shadow-xl hover:scale-[1.038] hover:border-slate-400 hover:border" style={styling}>
                <div className="overflow-hidden relative" style={{ height: imgHeight }}>
                    <div className="absolute h-6 px-2 left-4 top-4 flex items-center justify-center rounded-md" style={{backgroundColor: statusBgColor(projectStatus)}}>
                        <span className="text-[12px] uppercase" style={{color: statusTxtColor(projectStatus)}}>{getProjectStatusText(projectStatus)}</span>
                    </div>
                    <img className="w-full rounded-t-2xl" src={ido.projectBanner} alt={ido.projectName} />
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-gray-500 text-sm uppercase mt-2">${ido.projectSymbol}</p>
                            <p className="text-white" style={titleSize}>{ido.projectName}</p>
                        </div>
                        <div>
                            <ChainIcon blockchain={ido.blockchain} />
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