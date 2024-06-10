"use client";

import Designer from "@/components/Designer";
import { toast } from "@/components/ui/use-toast";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface UploadedImage {
  url: string;
  width: number;
  height: number;
}

const Page: React.FC = () => {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<
    { file: File; width: number; height: number }[]
  >([]);

  useEffect(() => {
    if (!localStorage.getItem("uploadedImages")) return notFound();
    const images = JSON.parse(localStorage.getItem("uploadedImages") || "[]");
    const files = images.map((image: UploadedImage) =>
      fetch(image.url)
        .then((res) => res.blob())
        .then((blob) => new File([blob], "image.jpg", { type: "image/jpeg" }))
        .then((file) => ({ file, width: image.width, height: image.height }))
        .catch(() => {
          toast({
            title: "Error processing images",
            description: "please try again",
            variant: "destructive",
          });
          router.push("/customize/upload");
        })
    );

    Promise.all(files).then(setUploadedImages);
  }, [router]);

  return (
    <div>
      <Designer uploadedImages={uploadedImages} />
    </div>
  );
};

export default Page;
