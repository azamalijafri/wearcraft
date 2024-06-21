import Sidebar from "@/components/Sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full">
      <div className="fixed">
        <Sidebar />
      </div>
      <div className="flex-1 p-4 md:ml-32 lg:ml-44 h-full mt-8 -z-10 md:z-0">
        {children}
      </div>
    </div>
  );
};

export default layout;
