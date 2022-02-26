import useOrbit from "@app/lib/hooks/useOrbit";
import dynamic from "next/dynamic";
import { NoSsr } from "@mui/material";

const TVChartContainer = dynamic(
    () =>
        import("@app/components/TVChartContainer/TVChartContainer").then(
            (mod) => mod.TVChartContainer
        ),
    { ssr: false }
);

export default function Indicators() {
    const { marketCap, liquidityPool, holders, price } = useOrbit();

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-row space-x-4">
                <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                    <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-[6px]">
                        <span>Market Cap</span>
                    </div>
                    <div className="text-xl">{marketCap}</div>
                </div>
                <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                    <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-[6px]">
                        <span>Current LP</span>
                    </div>
                    <div className="text-xl">{liquidityPool} BNB</div>
                </div>
                <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                    <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-[6px]">
                        <span>Holders</span>
                    </div>
                    <div className="text-xl">{holders}</div>
                </div>
                {/* @todo: have a variation e.g up to 28% */}
                <div className="flex-1 rounded-2xl bg-[#001926] p-4">
                    <div className="flex items-center space-x-5 text-[11px] font-bold uppercase text-app-primary mb-[6px]">
                        <span>Price</span>
                    </div>
                    <div className="text-xl">$ {price}</div>
                </div>
            </div>
            <div className="rounded-2xl bg-[#001926] p-4">
                <NoSsr>
                    <TVChartContainer />
                </NoSsr>
            </div>
        </div>
    );
}