import React, { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Check, Download, Pickaxe } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import NextImage from "next/image";
import Confetti from "react-dom-confetti";
import LoginModal from "./LoginModal";
import { BASE_PRICE } from "@/constants/product-options";
import { saveAs } from "file-saver";
import { PRODUCT_COLOR, PRODUCT_SIZE, PRODUCT_TYPE } from "@/types";
import { useRouter } from "next/navigation";

interface PreviewProps {
  showConfetti: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: Dispatch<SetStateAction<boolean>>;
  design: string;
  totalPrice: number;
  productType: PRODUCT_TYPE;
  productSize: PRODUCT_SIZE;
  productColor: PRODUCT_COLOR;
  productTitle: string;
  isLoading: boolean;
  loadingText: string;
  handleCheckout: () => void;
  quantity?: number;
  noDownload?: boolean;
  isCreate?: boolean;
}

const Preview = ({
  showConfetti,
  isLoginModalOpen,
  setIsLoginModalOpen,
  design,
  productType,
  productColor,
  productSize,
  productTitle,
  totalPrice,
  isLoading,
  loadingText,
  handleCheckout,
  quantity,
  noDownload,
  isCreate,
}: PreviewProps) => {
  const router = useRouter();
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 90 }}
        />
      </div>

      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="mt-20 flex flex-col items-center md:grid text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12">
        <div className="md:col-span-6 lg:col-span-5 md:row-span-2 md:row-end-2">
          {/* DESIGN IMAGE */}
          <div className="relative w-full bg-opacity-50 pointer-events-none aspect-[3/4]">
            <NextImage
              fill
              alt={`design-image`}
              src={design}
              className="pointer-events-none z-10 select-none absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mt-6 sm:col-span-7 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {productTitle}
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            In stock and ready to ship
          </div>
        </div>

        <div className="sm:col-span-10 md:col-span-7 text-base">
          <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High Quality Graphics</li>
                <li>Durable Fabric</li>
                <li>5 year print warranty</li>
              </ol>
            </div>
          </div>

          <div className="mt-0">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
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
                    {quantity?.toLocaleString()}
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
                    {formatPrice(productType?.price / 100)}
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

            <div className="mt-8 flex justify-end pb-12 gap-4">
              {isCreate && (
                <Button
                  onClick={() => {
                    router.push(`/customize/create?onlycreate=true`);
                  }}
                  className="px-4 sm:px-6 lg:px-8"
                >
                  Create Product <Pickaxe className="h-4 w-4 ml-1.5 inline" />
                </Button>
              )}
              {!noDownload && (
                <Button
                  onClick={() => {
                    saveAs(design, `${productType.value}-design.png`);
                  }}
                  className="px-4 sm:px-6 lg:px-8"
                >
                  Download <Download className="h-4 w-4 ml-1.5 inline" />
                </Button>
              )}
              <Button
                isLoading={isLoading}
                loadingText={loadingText}
                disabled={isLoading}
                onClick={handleCheckout}
                className="px-4 sm:px-6 lg:px-8"
              >
                Check out <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Preview;
