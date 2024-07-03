"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { notFound, useRouter } from "next/navigation";
import NextImage from "next/image";
import { Check, ChevronsUpDown, ArrowRight, Loader } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import {
  PRODUCT_SIZE,
  PRODUCT_TYPE,
  BASE_PRICE,
} from "@/constants/product-options";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Input } from "./ui/input";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

interface ProductDetailsProps {
  productId: string;
  user: KindeUser | null;
}

const ProductDetails = ({ productId, user }: ProductDetailsProps) => {
  const router = useRouter();

  const [options, setOptions] = useState<{
    product_size: (typeof PRODUCT_SIZE)[number];
  }>({
    product_size: PRODUCT_SIZE[0],
  });

  const [quantity, setQuantity] = useState(1);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `/api/product/details?productId=${productId}`
      );

      return response.data.product as any;
    } catch (error) {
      router.push("/");
    }
  };

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-details", productId],
    queryFn: fetchProductDetails,
  });

  const handleNext = () => {
    localStorage.setItem("productId", productId);
    localStorage.setItem("quantity", JSON.stringify(quantity));
    localStorage.setItem("productSize", options.product_size.value);
    router.push("/checkout/preview");
  };

  const product_type = PRODUCT_TYPE.find((type) => type.value == product?.type);

  if (isLoading)
    return (
      <div className="size-full flex items-center justify-center">
        <Loader className="animate-spin size-10" />
      </div>
    );

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-4 mb-20 pb-20">
      <div className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        <div className="relative w-full bg-opacity-50 pointer-events-none aspect-[3/4]">
          <NextImage
            fill
            alt={`product-image`}
            src={product?.imageUrl}
            className="pointer-events-none z-10 select-none absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="h-[37.5rem] w-full col-span-full lg:col-span-2 flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />

          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight font-bold text-3xl">
              {product?.title}
            </h2>

            <div className="w-full h-px bg-zinc-200 my-6" />

            <div className="relative mt-4 h-full flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Sizes</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.product_size.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {PRODUCT_SIZE.map((product_size) => (
                        <DropdownMenuItem
                          key={product_size.label}
                          className={cn(
                            "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                            {
                              "bg-zinc-100":
                                product_size.label ===
                                options.product_size.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({ ...prev, product_size }));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              product_size.label === options.product_size.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {product_size.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Quantity</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleQuantityChange(quantity - 1)}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      disabled={true}
                      onChange={(e) =>
                        handleQuantityChange(Number(e.target.value))
                      }
                      className="w-16 text-center border border-gray-300 rounded-md disabled:opacity-100"
                    />
                    <Button
                      variant="outline"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-200" />
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center">
              <p className="font-medium whitespace-nowrap">
                {formatPrice(
                  ((BASE_PRICE + product_type?.price!) / 100) * quantity
                )}
              </p>
              <Button
                // isLoading={isProcessing}
                onClick={handleNext}
                loadingText="Saving"
                // onClick={saveConfiguration}
                size="sm"
                className="w-full"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
