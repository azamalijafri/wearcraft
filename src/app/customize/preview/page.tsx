"use client";

import DesignPreview from "@/components/DesignPreview";
import { toast } from "@/components/ui/use-toast";
import { PRODUCT_SIZE, PRODUCT_TYPE } from "@/constants/product-options";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [design, setDesign] = useState<string | null>(null);
  const [options, setOptions] = useState<any>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
          return router.replace("/customize/upload");
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
          return router.replace("/customize/upload");
        }
      } else {
        router.replace("/customize/upload");
      }

      setIsLoading(false);
    };

    fetchDesign();
  }, [router]);

  return (
    <div className="h-full w-full">
      {!isLoading && design ? (
        <DesignPreview design={design} options={options} />
      ) : (
        <div className="h-full w-full flex items-center justify-center mt-20">
          <Loader className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Page;
