"use client";

import {
  BASE_PRICE,
  PRODUCT_COLORS,
  PRODUCT_SIZE,
  PRODUCT_TYPE,
} from "@/constants/product-options";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  PRODUCT_COLOR,
  PRODUCT_SIZE as SIZE,
  PRODUCT_TYPE as TYPE,
} from "@/types";
import { createCheckoutProduct } from "@/actions/product-actions";
import { useUploadThing } from "@/lib/uploadthing";
import imageCompression from "browser-image-compression";
import { createCheckoutSession } from "@/actions/order-actions";
import { nanoid } from "nanoid";
import Preview from "./Preview";

interface DesignPreviewProps {
  design: string;
  options: {
    color: PRODUCT_COLOR;
    product_type: TYPE;
    product_size: SIZE;
  };
  quantity: number;
}

const DesignPreview = ({
  design,
  options: productOptions,
  quantity,
}: DesignPreviewProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
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

  let totalPrice = (BASE_PRICE + productType?.price) * quantity;

  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      setIsLoading(false);
      setLoadingText("Uploading Design");

      if (url) {
        router.push(url);
      } else throw new Error("Unable to retrieve payment URL.");
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

      let designId;

      const designIdFromStorage = window.localStorage.getItem("designId");
      if (designIdFromStorage) {
        designId = window.localStorage.getItem("designId");
      } else {
        const file = new File([dataURLToBlob(design)], `${nanoid()}.png`, {
          type: "image/png",
        });
        const compressedFile = await compressImage(file);

        await startUpload([compressedFile])
          .then((res) => {
            if (res) {
              designId = res[0].url;
              window.localStorage.setItem("designId", res[0].url);
            }
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              title: "something went wrong",
              description: "please try again",
              variant: "destructive",
            });
          });
      }

      if (designId) {
        window.localStorage.setItem("designId", designId);

        setLoadingText("Creating Product");
        try {
          const productId = await createCheckoutProduct({
            imageUrl: designId,
            color: productColor?.value!,
            size: productSize?.value!,
            type: productType.value,
          });

          createPaymentSession({
            productId: productId!,
            quantity,
            cancelPathname: pathname,
          });
        } catch (error: any) {
          setIsLoading(false);
          toast({
            title: "something went wrong",
            description: error.message,
            variant: "destructive",
          });
        }
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
    <Preview
      design={design}
      handleCheckout={handleCheckout}
      isLoading={isLoading}
      isLoginModalOpen={isLoginModalOpen}
      setIsLoginModalOpen={setIsLoginModalOpen}
      loadingText={loadingText}
      productColor={productColor as PRODUCT_COLOR}
      productSize={productSize as SIZE}
      productTitle={productType.label}
      productType={productType as TYPE}
      showConfetti={showConfetti}
      totalPrice={totalPrice}
      quantity={quantity}
    />
  );
};

export default DesignPreview;
