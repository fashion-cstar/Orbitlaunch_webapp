import React, { PropsWithChildren } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Header />
      <div className="flex items-start py-[64px]">
        <Sidebar isOpen />
        <div className="p-10">{children}</div>
      </div>
    </>
  );
}
