import OrdersTable from "@/components/OrdersTable";
import React from "react";

const page = () => {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4 min-h-screen">
        <div className="flex flex-col gap-12 h-full">
          <h1 className="text-4xl font-bold tracking-tight">Incoming orders</h1>
          <OrdersTable isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default page;
