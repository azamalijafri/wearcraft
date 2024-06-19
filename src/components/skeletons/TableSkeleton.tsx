import React from "react";

const TableSkeleton = () => {
  return (
    <div className="h-3/4 w-full rounded-md grid grid-rows-5 gap-3">
      <div className="bg-accent w-full h-full rounded-lg" />
      <div className="bg-accent w-full h-full rounded-lg" />
      <div className="bg-accent w-full h-full rounded-lg" />
      <div className="bg-accent w-full h-full rounded-lg" />
      <div className="bg-accent w-full h-full rounded-lg" />
    </div>
  );
};

export default TableSkeleton;
