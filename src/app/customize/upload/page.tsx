"use client";

import Uploader from "@/components/Uploader";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Upload = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const currentParams = new URLSearchParams(searchParams);

  const nextUrl = `/customize/design?${currentParams.toString()}`;

  const handleUpload = (
    files: { file: File; width: number; height: number }[]
  ) => {
    try {
      localStorage.setItem("uploadedImages", JSON.stringify(files));
      router.push(nextUrl);
    } catch (error) {
      toast({
        title: "something went wrong",
        description: "images might be too large",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  return <Uploader onUpload={handleUpload} />;
};

export default Upload;
