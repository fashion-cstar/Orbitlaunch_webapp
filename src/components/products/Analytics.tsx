import BuyButton from "../common/BuyButton";

const styleHeight = {
    height: '300px',
    textAlign: 'center' as 'center',
    color: 'grey',
}

export default function Analytics() {
    return (
        <>
        <div className="flex flex-col space-y-4 w-full">
            <div className="flex flex-row items-center">
                <h1 className="text-[40px] font-medium">OrbitAnalytics</h1>
                <BuyButton></BuyButton>
            </div>
            <div className="flex justify-center items-center flex-1 rounded-md bg-[#001926] p-4" style={styleHeight}>Coming Soon</div>
        </div>
        </>
    )
}