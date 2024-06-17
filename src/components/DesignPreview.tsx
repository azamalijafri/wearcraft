"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  BASE_PRICE,
  PRODUCT_COLORS,
  PRODUCT_SIZE,
  PRODUCT_TYPE,
} from "@/constants/product-options";
// import { Configuration } from '@prisma/client'
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check, Download } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
// import { createCheckoutSession } from './actions'
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  PRODUCT_COLOR,
  PRODUCT_SIZE as SIZE,
  PRODUCT_TYPE as TYPE,
} from "@/types";
// import LoginModal from '@/components/LoginModal'
import NextImage from "next/image";
import { saveAs } from "file-saver";
import { createProduct } from "@/actions/product-actions";
import LoginModal from "./LoginModal";
import { useUploadThing } from "@/lib/uploadthing";
import imageCompression from "browser-image-compression";
import { createCheckoutSession } from "@/actions/order-actions";

interface DesignPreviewProps {
  design: string;
  options: {
    color: PRODUCT_COLOR;
    product_type: SIZE;
    product_size: TYPE;
  };
}

const DesignPreview = ({
  design,
  options: productOptions,
}: DesignPreviewProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useKindeBrowserClient();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Uploading Design");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  useEffect(() => setShowConfetti(true), []);

  const productColor = PRODUCT_COLORS.find(
    (supportedColor) => supportedColor.value === productOptions.color.value
  );

  const productType = PRODUCT_TYPE.find(
    ({ value }) => value === productOptions.product_type.value
  )!;

  const productSize = PRODUCT_SIZE.find(
    ({ value }) => value === productOptions.product_size.value
  );

  let totalPrice = BASE_PRICE + productType?.price;

  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      setIsLoading(false);
      setLoadingText("Uploading Design");

      if (url) router.push(url);
      else throw new Error("Unable to retrieve payment URL.");
    },
    onError: () => {
      setIsLoading(false);
      setLoadingText("Uploading Design");

      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { startUpload } = useUploadThing("imageUploader");

  const compressImage = async (imageBlob: File) => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(imageBlob, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
    } else {
      setIsLoading(true);
      const file = new File([dataURLToBlob(design)], "design.png", {
        type: "image/png",
      });
      const compressedFile = await compressImage(file);

      const response = await startUpload([compressedFile]);

      if (response) {
        setLoadingText("Creating Product");

        const productId = await createProduct({
          imageUrl: response[0].url,
          color: productColor?.value!,
          size: productSize?.value!,
          type: productType.value,
        });

        createPaymentSession({ productId: productId! });
      }
    }
  };

  const dataURLToBlob = (dataURL: string) => {
    const [header, data] = dataURL.split(",");
    // @ts-expect-error
    const mime = header.match(/:(.*?);/)[1];
    const bstr = atob(data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

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
              alt={`${productType.value}-design`}
              src={design}
              className="pointer-events-none z-10 select-none absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mt-6 sm:col-span-7 md:row-end-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Your {productType.label}
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

          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
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

            <div className="mt-8 flex justify-end pb-12 gap-4">
              <Button
                onClick={() => {
                  saveAs(design, `${productType.value}-design.png`);
                }}
                className="px-4 sm:px-6 lg:px-8"
              >
                Download <Download className="h-4 w-4 ml-1.5 inline" />
              </Button>
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

export default DesignPreview;
