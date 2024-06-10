"use client";

import Uploader from "@/components/Uploader";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Upload = () => {
  const router = useRouter();

  const handleUpload = (
    files: { file: File; width: number; height: number }[]
  ) => {
    // Save uploaded files to local storage or pass them to the next route
    localStorage.setItem(
      "uploadedImages",
      JSON.stringify(
        files.map((file) => ({
          url: URL.createObjectURL(file.file),
          width: file.width,
          height: file.height,
        }))
      )
    );
    router.push("/customize/design");
  };
  return <Uploader onUpload={handleUpload} />;
};

export default Upload;
