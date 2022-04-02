import Head from "next/head";
import Fund from "@app/components/products/Fund/Fund";
import { useRouter } from "next/router";

const ReferralFund = () => {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>OrbitFund</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Fund></Fund>
        </>
    );
}

export default ReferralFund;