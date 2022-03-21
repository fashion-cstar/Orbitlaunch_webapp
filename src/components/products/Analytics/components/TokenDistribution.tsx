import React, { useEffect } from "react";
import { render } from "react-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
    chart: {
        backgroundColor: 'transparent',
        type: "pie",
        height: '100%',
        // width: 200,
        margin: 0,
        spacing: 0,
        animation: {
            duration: 1000
        }
    },
    title: {
        text: ""
    },
    subtitle: {
        text:
            "",
        floating: true,
        style: {
            fontSize: 14,
            fontWeight: "bold",
            color: "#000000"
        },
        y: 170
    },
    plotOptions: {
        pie: {
            showInLegend: false,
            innerSize: "78%",
            startAngle: 90,
            borderWidth: 8,
            borderColor: "#001926",
            slicedOffset: 0,
            tooltip: {
                valueSuffix: '%'
            },
            dataLabels: {
                enabled: false,
                distance: -14,
                color: "white",
                style: {
                    fontweight: "bold",
                    fontsize: 50
                }
            }
        }
    },
    credits: {
        enabled: false
    },
    series: [
        {
            name: 'Distribution',
            data: [
                {
                    y: 20,
                    name: "Top Holder",
                    color: "#296FD9",
                    sliced: true
                }, {
                    y: 20,
                    name: "PCS V2",
                    color: "#29D9D0",
                    sliced: true
                }, {
                    y: 25,
                    name: "Total Supply",
                    color: "#00D98D",
                    sliced: true
                }, {
                    y: 35,
                    name: "Burned",
                    color: "#867EE8",
                    sliced: true
                }
            ]
        }
    ]
};

export default function TokenDistribution({ width }: { width: number }) {

    return (
        <div className="w-full" key={width}>
            <div className="text-[18px] md:text-[24px] text-white my-3">Token Distribution</div>
            <div className="flex gap-6 my-6 items-center justify-around">
                <div className="w-1/2">
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </div>
                <div className="flex flex-col justify-between items-stretch">
                    <div className="text-[12px] md:text-[14px] text-[#BAB8CC]">
                        Token Tax<br />
                        {`${10}% Buy - ${10}% Sell`}
                    </div>
                    <div className="text-[12px] md:text-[14px] text-[#00D98D] flex items-center mt-2">
                        <span className="text-[24px] md:text-[32px] leading-8">&#9679;&nbsp;&nbsp;</span>{`Total Supply ${100}M`}
                    </div>
                    <div className="text-[12px] md:text-[14px] text-[#296FD9] flex items-center">
                        <span className="text-[24px] md:text-[32px] leading-8">&#9679;&nbsp;&nbsp;</span>Top Holder&nbsp;<span className="text-white">{`${1.8}M`}</span>
                    </div>
                    <div className="text-[12px] md:text-[14px] text-[#29D9D0] flex items-center">
                        <span className="text-[24px] md:text-[32px] leading-8">&#9679;&nbsp;&nbsp;</span>PCS V2&nbsp;<span className="text-white">{`${10.8}M`}</span>
                    </div>
                    <div className="text-[12px] md:text-[14px] text-[#867EE8] flex items-center">
                        <span className="text-[24px] md:text-[32px] leading-8">&#9679;&nbsp;&nbsp;</span>Burned&nbsp;<span className="text-white">{`${1.8}M`}</span>
                    </div>
                </div>
            </div>
            <div className="text-[12px] text-white underline my-4">
                View Top 100 holders on BscScan
            </div>
        </div>
    )
}