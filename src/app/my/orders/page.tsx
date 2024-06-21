import OrdersTable from "@/components/OrdersTable";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OrderStatus } from "@prisma/client";
import { notFound } from "next/navigation";

const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: "Awaiting Shipment",
  fulfilled: "Fulfilled",
  shipped: "Shipped",
};

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return notFound();
  }

  return (
    <div className="flex h-full w-full bg-muted/40">
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4 h-full pt-4 sm:pt-8">
        <div className="flex flex-col gap-10 h-full">
          <h1 className="text-4xl font-bold tracking-tight">Your Orders</h1>
          <OrdersTable />
        </div>
      </div>
    </div>
  );
};

export default Page;
