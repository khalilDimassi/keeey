import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
  return (
    <div className="w-full h-screen  p-2 ">
     
      <div className="w-full h-12 "> <Navbar /></div>
      <div className="flex w-full h-[calc(100%-64px)]">
        <div style={{width:"7rem"}}> <Sidebar /></div>
        <div className="flex flex-col w-3/4">
          <div className="h-1/3 "></div>
          <div className="h-1/3 "></div>
          <div className="h-1/3 "></div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
