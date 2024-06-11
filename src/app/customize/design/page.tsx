"use client";

import Designer from "@/components/Designer";
import { toast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
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

  useEffect(() => {
    setIsLoading(true);
    const images = JSON.parse(localStorage.getItem("uploadedImages") || "[]");
    const files = images.map((image: UploadedImage) =>
      fetch(image?.base64)
        .then((res) => res.blob())
        .then((blob) => new File([blob], "image.jpg", { type: "image/jpeg" }))
        .then((file) => {
          setIsLoading(false);
          return { file, width: image.width, height: image.height };
        })
        .catch((error) => {
          setIsLoading(false);
          toast({
            title: "Error processing images",
            description: error.message,
            variant: "destructive",
          });
          router.push("/customize/upload");
        })
    );

    Promise.all(files).then(setUploadedImages);
  }, [router]);

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
