import React from "react";
import NavBar from "../../components/owner/NavBar";
import SideBar from "../../components/owner/SideBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex h-full">
        <SideBar />
        <div className="flex-1 p-4 pt-10 md:px-10 h-full">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default Layout;
