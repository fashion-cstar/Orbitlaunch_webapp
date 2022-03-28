import React, { useMemo, useState, useEffect } from 'react'
import { render } from "react-dom"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import RightArrow from 'src/components/common/RightArrow'
import LeftArrow from 'src/components/common/LeftArrow'
import TabButton from "./TabButton"

const options = {
    title: {
        text: ''
    },
    legend: {
        itemStyle: { "color": "#919699", "cursor": "pointer", "fontSize": "14px", "fontWeight": "300", "textOverflow": "ellipsis" },
        itemHoverStyle: { "color": "#ffffff" },
        layout: 'horizontal',
        align: 'left',
        verticalAlign: 'top',
        x: 0,
    },
    series: [
        {
            name: 'Buys',
            color: '#00D98D',
            pointWidth: 10,
            borderWidth: 0,
            // showInLegend: false,                      
            data: [{ x: 0, y: 100 }, { x: 1, y: 80 }, { x: 2, y: 160 }, { x: 3, y: 230 }]
        },
        {
            name: 'Sells',
            color: '#29D9D0',
            pointWidth: 10,
            borderWidth: 0,
            data: [{ x: 0, y: 240 }, { x: 1, y: 130 }, { x: 2, y: 60 }, { x: 3, y: 170 }]
        }
    ],
    tooltip: { enabled: true },
    chart: {
        backgroundColor: 'transparent',
        height: '50%',
        // width: 450,
        marginTop: 65,
        spacingBottom: 0,
        spacingLeft: 0,
        animation: {
            duration: 1000
        },
        type: "column"
    },
    credits: {
        enabled: false
    },
    xAxis: {
        min: 0,
        max: 3,
        categories: ["Feb.1", "Feb.2", "Feb.3", "Feb.4"],
        lineColor: 'transparent',
        minorGridLineColor: 'transparent',
        tickColor: 'transparent',
        gridLineColor: '#112B40',
        gridLineWidth: 1,
        labels: {
            style: {
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '300',
            }
        }
    },
    yAxis: {
        min: 0,
        max: 250,
        tickAmount: 6,
        lineColor: 'transparent',
        minorGridLineColor: 'transparent',
        tickColor: 'transparent',
        gridLineColor: '#112B40',
        lineWidth:1,
        labels: {
            style: {
                color: '#919699',
                fontSize: '11px',
                fontWeight: '300',
            },
            formatter: function () {
                return this.pos + "k";
            }
        },
        title: {
            text: ''
        }
    }
};

export default function Volume({ width }: { width: number }) {
    const [tabIndex, setTabIndex] = useState(0)

    const handleClick = (tabIndex: number) => {
        setTabIndex(tabIndex)
    }

    const handleLeftClick = () => {

    }

    const handleRightClick = () => {

    }

    return (
        <div className="w-full" key={width}>
            <div className="flex justify-between text-[18px] md:text-[24px] text-white my-3">
                <span>Volume</span>
                <div className="flex gap-2">
                    <TabButton isSelected={tabIndex === 0} name="Day" tabIndex={0} handleTabClick={handleClick} />
                    <TabButton isSelected={tabIndex === 1} name="Month" tabIndex={1} handleTabClick={handleClick} />                    
                </div>
            </div>
            <HighchartsReact highcharts={Highcharts} options={options} /> 
            <div className='flex justify-center mt-4'>
                <div className="flex flex-row gap-4">
                    <LeftArrow handleLeftClick={handleLeftClick} />
                    <RightArrow handleRightClick={handleRightClick} />
                </div>
            </div>           
        </div>
    )
}