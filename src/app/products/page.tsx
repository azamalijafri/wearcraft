"use client";

import Filterbar from "@/components/Filterbar";
import React from "react";

const Page = () => {
  return (
    <div className="flex h-full">
      <div className="fixed">
        <Filterbar />
      </div>
      <div className="flex-1 p-4 md:ml-32 lg:ml-44 h-full mt-8 -z-10 md:z-0">
        <main>main</main>
      </div>
    </div>
  );
};

export default Page;
