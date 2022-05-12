import React, { useEffect } from "react"
import { render } from "react-dom"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"

const options = {
    title: {
        text: ''
    },
    series: [
        {
            name: 'ORBIT',
            type: 'area',
            data: [{
                x: 2,
                y: 9,
            }, {
                x: 3,
                y: 6,
            },
            {
                x: 7,
                y: 5,
            },
            {
                x: 8,
                y: 5,
            },
            {
                x: 9,
                y: 5,
            }]
        }
    ],
    tooltip: { enabled: true },
    plotOptions: {
        series: {
            showInLegend: false
        },
        area: {
            lineWidth: 3,
            color: '#867EE8',
            fillColor: {
                linearGradient: [0, 0, 0, 300],
                stops: [
                    [0, 'rgba(134,126,232, 0.5)'],
                    [0.5, 'rgba(134,126,232, 0)'],
                    [1, 'rgba(134,126,232, 0)']
                ]
            },
            marker: {
                fillColor: '#001926',
                lineColor: '#867EE8',
                lineWidth: 2,
                enabled: true
            }
        }
    },
    chart: {
        backgroundColor: 'transparent',
        height: '45%',
        // width: 450,
        spacingBottom: 0,
        spacingLeft: 0,
        animation: {
            duration: 1000
        }
    },
    credits: {
        enabled: false
    },
    xAxis: {
        min: 0,
        max: 11,
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        lineColor: 'transparent',
        minorGridLineColor: 'transparent',
        tickColor: 'transparent',
        labels: {
            style: {
                color: '#919699',
                fontSize: '11px',
                fontWeight: '300',
            }
        }
    },
    yAxis: {
        // visible: false,
        min: 0,
        max: 10,
        tickAmount: 3,
        // categories: ["1k","10k","20k","40k","80k"],
        lineColor: 'transparent',
        minorGridLineColor: 'transparent',
        tickColor: 'transparent',
        gridLineColor: '#112B40',
        labels: {
            style: {
                color: '#919699',
                fontSize: '11px',
                fontWeight: '300',
                // fontFamily: 'Poppins'
            },
            formatter: function () {
                return this.pos + "k"
            }
        },
        title: {
            text: ''
        }
    }
};

export default function HolderInfo({ width }: { width: number }) {

    return (
        <div className="w-full" key={width}>
            <div className="text-[18px] md:text-[24px] text-white my-3">
                Holder Info
            </div>
            <div className="text-[16px] md:text-[21px] text-white my-3">{`${0.0442}$`}<span className="text-[#00D98D]">{` (`}&#8593;{`${28}% ${30} days)`}</span></div>
            <HighchartsReact highcharts={Highcharts} options={options} />
            <div className="text-[16px] md:text-[21px] text-white my-3">{`Project Age - ${421} days`}</div>
        </div>
    )
}