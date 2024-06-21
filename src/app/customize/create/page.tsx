"use client";

import CreateProduct from "@/components/CreateProduct";
import { toast } from "@/components/ui/use-toast";
import { PRODUCT_SIZE, PRODUCT_TYPE } from "@/constants/product-options";
import { Loader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [design, setDesign] = useState<string | null>(null);
  const [options, setOptions] = useState<any>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams);
  const uploadUrl = `/customize/upload?${currentParams.toString()}`;
  const onlycreate = searchParams.get("onlycreate") == "true";

  useEffect(() => {
    if (!onlycreate) router.push("/customize/preview");

    const fetchDesign = async () => {
      const designConfig = localStorage.getItem("designConfiguration");

      if (designConfig) {
        const { design, options } = JSON.parse(designConfig);

        const img = new Image();
        img.onload = () => {
          setDesign(design);
          setOptions(options);
        };
        img.onerror = () => {
          localStorage.removeItem("designConfiguration");
          return router.replace(uploadUrl);
        };
        img.src = design;

        const productType = PRODUCT_TYPE.find(
          ({ value }) => value === options.product_type.value
        )!;

        const productSize = PRODUCT_SIZE.find(
          ({ value }) => value === options.product_size.value
        );

        if (!productType || !productSize) {
          localStorage.removeItem("designConfiguration");
          toast({
            title: "something went wrong",
            description: "stop tempering the local data",
            variant: "destructive",
          });
          return router.replace(uploadUrl);
        }
      } else {
        router.replace(uploadUrl);
      }

      setIsLoading(false);
    };

    fetchDesign();
  }, [router, onlycreate, uploadUrl]);

  return (
    <div className="h-full w-full">
      {!isLoading && design ? (
        <CreateProduct design={design} options={options} />
      ) : (
        <div className="h-full w-full flex items-center justify-center mt-20">
          <Loader className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Page;
