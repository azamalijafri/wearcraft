"use client";

import Uploader from "@/components/Uploader";
import { useRouter } from "next/navigation";

const Upload = () => {
  const router = useRouter();

  const handleUpload = (
    files: { file: File; width: number; height: number }[]
  ) => {
    localStorage.setItem("uploadedImages", JSON.stringify(files));
    router.push("/customize/design");
  };
  return <Uploader onUpload={handleUpload} />;
};

export default Upload;
