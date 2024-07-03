"use client ";
import { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  BillingAddress,
  OrderStatus,
  CheckoutProduct,
  ShippingAddress,
  User,
} from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import NextImage from "next/image";
import {
  BASE_PRICE,
  PRODUCT_COLORS,
  PRODUCT_SIZE,
  PRODUCT_TYPE,
} from "@/constants/product-options";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader } from "lucide-react";

export type OrderDetail = {
  id: string;
  productId: string;
  product: CheckoutProduct;
  user: User;
  userId: string;
  amount: number;
  isPaid: boolean;
  status: OrderStatus;
  shippingAddress?: ShippingAddress | null;
  billingAddress?: BillingAddress | null;
  createdAt: Date;
  updatedAt: Date;
  quantity: number;
} | null;

const OrderDetailModal = ({
  isOpen,
  setIsOpen,
  order,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  order: OrderDetail;
}) => {
  if (!order) return null;

  const productColor = PRODUCT_COLORS.find(
    (supportedColor) => supportedColor.value === order.product.color
  );

  const productType = PRODUCT_TYPE.find(
    ({ value }) => value === order.product.type
  )!;

  const productSize = PRODUCT_SIZE.find(
    ({ value }) => value === order.product.size
  );

  let totalPrice = (BASE_PRICE + productType?.price) * order?.quantity;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-full max-w-4xl">
        <div className="flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
          <div className="md:col-span-6 lg:col-span-5 md:row-span-2 md:row-end-2">
            <div className="relative w-full bg-opacity-50 pointer-events-none aspect-[3/4]">
              {!order?.product?.imageUrl ? (
                <div className="size-full flex items-center justify-center">
                  <Loader className="animate-spin" />
                </div>
              ) : (
                <NextImage
                  fill
                  alt={`design-image`}
                  src={order.product.imageUrl}
                  className="pointer-events-none z-10 select-none absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="mt-6 sm:col-span-7 md:row-end-1">
            <h3 className="text-3xl font-bold tracking-tight text-gray-900">
              {order?.product?.title ?? productType.label}
            </h3>
          </div>

          <div className="sm:col-span-10 md:col-span-7 text-base">
            <div className="mt-0">
              <div className="bg-gray-50 sm:rounded-lg">
                <div className="flow-root text-sm">
                  <div className="mt-12 text-sm font-medium">
                    <p className="text-zinc-900">Order number</p>
                    <p className="mt-2 text-zinc-500">{order?.id}</p>
                  </div>

                  <TooltipProvider>
                    <div className="grid grid-cols-2 gap-x-6 py-10 text-sm w-full">
                      <div>
                        <p className="font-medium text-gray-900">
                          Shipping address
                        </p>
                        <div className="mt-2 text-zinc-700">
                          <address className="not-italic">
                            <span className="block">
                              {order?.shippingAddress?.name}
                            </span>
                            <Tooltip>
                              <TooltipTrigger className="block overflow-hidden text-ellipsis w-full text-start">
                                {order?.shippingAddress?.street}
                              </TooltipTrigger>
                              <TooltipContent>
                                {order?.shippingAddress?.street}
                              </TooltipContent>
                            </Tooltip>
                            <span className="block">
                              {order?.shippingAddress?.postalCode}{" "}
                              {order?.shippingAddress?.city}
                            </span>
                          </address>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Billing address
                        </p>
                        <div className="mt-2 text-zinc-700">
                          <address className="not-italic">
                            <span className="block">
                              {order?.billingAddress?.name}
                            </span>
                            <Tooltip>
                              <TooltipTrigger className="block overflow-hidden text-ellipsis w-full text-start">
                                {order?.billingAddress?.street}
                              </TooltipTrigger>
                              <TooltipContent>
                                {order?.billingAddress?.street}
                              </TooltipContent>
                            </Tooltip>
                            <span className="block">
                              {order?.billingAddress?.postalCode}{" "}
                              {order?.billingAddress?.city}
                            </span>
                          </address>
                        </div>
                      </div>
                    </div>
                  </TooltipProvider>
                  <div className="my-2 h-px bg-gray-200" />

                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Color</p>
                    <p className="font-medium text-gray-900">
                      {productColor?.label}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Size</p>
                    <p className="font-medium text-gray-900">
                      {productSize?.label}
                    </p>
                  </div>

                  <div className="my-2 h-px bg-gray-200" />

                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Quantity</p>
                    <p className="font-medium text-gray-900">
                      {order?.quantity}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Base price</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(BASE_PRICE / 100)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">{productType?.label} Price</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(productType.price / 100)}
                    </p>
                  </div>

                  <div className="my-2 h-px bg-gray-200" />

                  <div className="flex items-center justify-between py-2">
                    <p className="font-semibold text-gray-900">Order total</p>
                    <p className="font-semibold text-gray-900">
                      {formatPrice(totalPrice / 100)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
