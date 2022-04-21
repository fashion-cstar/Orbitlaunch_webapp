import Head from "next/head";
import OrbitWhitelist from "@app/components/products/Pad/OrbitWhitelist/index";
import { useRouter } from 'next/router'

export default function Home() {
    const router = useRouter()
    const { query: { project } } = router
    return (
        <>
            <Head>
                <title>OrbitFund</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <OrbitWhitelist></OrbitWhitelist>
        </>
    );
}
