import Head from "next/head";
import Pad from "@app/components/products/Pad/index";
import ProjectDetail from "@app/components/products/Pad/components/ProjectDetail"
import ExtendedProjectSubmit from '@app/components/products/Pad/components/ExtendedProjectSubmit'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const {
    query: { project },
  } = router
  return (
    <>
      <Head>
        <title>OrbitPad</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {project ? project == "register" ? <ExtendedProjectSubmit /> : <ProjectDetail project={project}></ProjectDetail> : <Pad></Pad>}
    </>
  );
}
