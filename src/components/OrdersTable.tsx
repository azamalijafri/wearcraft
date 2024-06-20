"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { PAGE_LIMIT } from "@/constants/variables";
import TableSkeleton from "./skeletons/TableSkeleton";
import { Button } from "./ui/button";
import { getLoggedInUserOrders } from "@/actions/order-actions";
import StatusDropdown from "@/app/dashboard/StatusDropdown";
import OrderDetailModal, { OrderDetail } from "./modals/OrderDetailModal";

const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
  awaiting_shipment: "Awaiting Shipment",
  fulfilled: "Fulfilled",
  shipped: "Shipped",
};

const OrdersTable = ({ isDashboard }: { isDashboard?: boolean }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsData, setDetailsData] = useState<any>(null);

  const fetchOrders = async () => {
    const response = await getLoggedInUserOrders({ currentPage, isDashboard });
    const { data } = response;

    return data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["orders", currentPage, isDashboard],
    queryFn: fetchOrders,
  });

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  const totalPages = data ? Math.ceil(data.total / PAGE_LIMIT) : 1;

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div className="h-full pb-10">
      <OrderDetailModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        order={detailsData}
      />
      {!data ? (
        <TableSkeleton />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden sm:table-cell">
                Purchase date
              </TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.orders?.map((order) => (
              <TableRow key={order.id} className="bg-accent">
                <TableCell
                  className="cursor-pointer"
                  onClick={() => {
                    setIsModalOpen(true);
                    setDetailsData(order);
                  }}
                >
                  <div className="font-medium">
                    {order.shippingAddress?.name}
                  </div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {order.user.email}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {isDashboard ? (
                    <StatusDropdown
                      id={order.id}
                      orderStatus={order.status}
                      currentPage={currentPage}
                    />
                  ) : (
                    LABEL_MAP[order.status]
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(order.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || !data || isLoading}
        >
          Previous
        </Button>
        <span>
          {data?.orders.length == 0
            ? "No result found"
            : `Page ${currentPage} of ${totalPages}`}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || !data || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default OrdersTable;
