"use client";

import CheckoutPreview from "@/components/CheckoutPreview";
import { PRODUCT_SIZE } from "@/constants/product-options";
import { PRODUCT_SIZE as SIZE } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [productId, setProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [size, setSize] = useState<SIZE>();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const productId = localStorage.getItem("productId");
      const quantity = localStorage.getItem("quantity");
      const size = localStorage.getItem("productSize");

      const productSize = PRODUCT_SIZE.find(({ value }) => value === size);

      if (!quantity || isNaN(parseInt(quantity)) || !productId || !productSize)
        return router.push("/");

      setSize(productSize);
      setProductId(productId);
      setQuantity(parseInt(quantity));
    };

    fetchData();
  }, [router]);

  return (
    <div className="h-full w-full">
      <CheckoutPreview
        productId={productId}
        quantity={quantity}
        productSize={size!}
      />
    </div>
  );
};

export default Page;
