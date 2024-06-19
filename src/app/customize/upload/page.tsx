"use client";

import Uploader from "@/components/Uploader";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const Upload = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleUpload = (
    files: { file: File; width: number; height: number }[]
  ) => {
    try {
      localStorage.setItem("uploadedImages", JSON.stringify(files));
      router.push("/customize/design");
    } catch (error) {
      toast({
        title: "something went wrong",
        description: "images might be too large",
        variant: "destructive",
      });
    }
  };
  return <Uploader onUpload={handleUpload} />;
};

export default Upload;
