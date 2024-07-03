"use client";

import {
  BASE_PRICE,
  PRODUCT_COLORS,
  PRODUCT_TYPE,
} from "@/constants/product-options";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  PRODUCT_COLOR,
  PRODUCT_SIZE as SIZE,
  PRODUCT_TYPE as TYPE,
} from "@/types";
import { createCheckoutProduct } from "@/actions/product-actions";
import { createCheckoutSession } from "@/actions/order-actions";
import Preview from "./Preview";
import axios from "axios";
import { ProductSize, ShopProduct } from "@prisma/client";
import MaxWidthWrapper from "./MaxWidthWrapper";

interface CheckoutPreviewProps {
  productId: string;
  productSize: SIZE;
  quantity: number;
}

const CheckoutPreview = ({
  productId,
  quantity,
  productSize,
}: CheckoutPreviewProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const pathname = usePathname();
  const { user } = useKindeBrowserClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  useEffect(() => setShowConfetti(true), []);

  const fetchProductDetails = async () => {
    const response = await axios.get(
      `/api/product/details?productId=${productId}`
    );

    if (response.status != 200) {
      router.replace("/");
    }

    return response.data.product as ShopProduct;
  };

  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product-details", productId],
    queryFn: fetchProductDetails,
  });

  const productColor = useMemo(
    () =>
      PRODUCT_COLORS.find(
        (supportedColor) => supportedColor.value === product?.color
      ),
    [product]
  );

  const productType = useMemo(
    () => PRODUCT_TYPE.find(({ value }) => value === product?.type),
    [product]
  )!;

  let totalPrice = (BASE_PRICE + productType?.price) * quantity;

  const { mutate: createPaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      setIsLoading(false);

      if (url) {
        router.push(url);
      } else throw new Error("Unable to retrieve payment URL.");
    },
    onError: () => {
      setIsLoading(false);

      toast({
        title: "Something went wrong",
        description: "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
    } else {
      setIsLoading(true);

      try {
        const productId = await createCheckoutProduct({
          imageUrl: product?.imageUrl!,
          color: productColor?.value!,
          size: productSize?.value! as ProductSize,
          type: productType.value,
          title: product?.title,
        });

        createPaymentSession({
          productId: productId!,
          quantity: quantity,
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
  };

  return (
    <MaxWidthWrapper>
      <Preview
        noDownload={true}
        design={product?.imageUrl!}
        handleCheckout={handleCheckout}
        isLoading={isLoading}
        isLoginModalOpen={isLoginModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
        loadingText={"Creating Product"}
        productColor={productColor as PRODUCT_COLOR}
        productSize={productSize as SIZE}
        productTitle={productType?.label}
        productType={productType as TYPE}
        showConfetti={showConfetti}
        totalPrice={totalPrice}
        quantity={quantity}
      />
    </MaxWidthWrapper>
  );
};

export default CheckoutPreview;
