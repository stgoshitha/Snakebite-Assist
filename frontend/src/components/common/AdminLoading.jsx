import React from "react";
import SideBar from "./SideBar";
import Header from "./Header";

const AdminLoading = () => {
  return (
    <div className="flex gap-1">
      <div>
        <SideBar />
      </div>
      <div className="ml-70 flex flex-col gap-2 overflow-auto w-full h-screen">
        <Header />
        <div className="flex items-center justify-center h-full">
          <div className="loader w-[45px] aspect-square"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoading;
