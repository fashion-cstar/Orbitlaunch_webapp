import Head from "next/head";
import Play from "@app/components/products/Play/index";
import { PlayProvider } from "@app/contexts";

export default function Home() {
    return (
        <>
            <Head>
                <title>OrbitPlay</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PlayProvider>
                <Play></Play>
            </PlayProvider>
        </>
    );
}
