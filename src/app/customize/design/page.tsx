"use client";

import Designer from "@/components/Designer";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface UploadedImage {
  base64: string;
  width: number;
  height: number;
}

const Page: React.FC = () => {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<
    { file: File; width: number; height: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const images = JSON.parse(
          localStorage.getItem("uploadedImages") || "[]"
        );
        const files = await Promise.all(
          images.map(async (image: UploadedImage) => {
            try {
              const response = await fetch(image?.base64);
              const blob = await response.blob();
              const file = new File([blob], "image.jpg", {
                type: "image/jpeg",
              });
              return { file, width: image.width, height: image.height };
            } catch (error: any) {
              toast({
                title: "Something went wrong",
                description: error.message,
                variant: "destructive",
              });
              router.push("/customize/upload");
              throw error;
            }
          })
        );
        setUploadedImages(files);
      } catch (error: any) {
        toast({
          title: "Something went wrong",
          description: error.message,
          variant: "destructive",
        });
        router.replace("/customize/upload");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [router, toast]);

  return (
    <div className="h-full w-full">
      {!isLoading ? (
        <Designer uploadedImages={uploadedImages} />
      ) : (
        <div className="h-full w-full flex items-center justify-center mt-20">
          <Loader className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default Page;
