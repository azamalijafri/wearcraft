"use client";

import { Button } from "@/components/ui/button";
import { PRODUCT_COLORS, PRODUCT_TYPE } from "@/constants/product-options";
import { Download, Pickaxe } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  PRODUCT_COLOR,
  PRODUCT_SIZE as SIZE,
  PRODUCT_TYPE as TYPE,
} from "@/types";
import NextImage from "next/image";
import { saveAs } from "file-saver";
import LoginModal from "./LoginModal";
import { useUploadThing } from "@/lib/uploadthing";
import imageCompression from "browser-image-compression";
import { nanoid } from "nanoid";
import { createShopProduct } from "@/actions/product-actions";
import { Input } from "./ui/input";

interface CreateProductProps {
  design: string;
  options: {
    color: PRODUCT_COLOR;
    product_type: SIZE;
    product_size: TYPE;
  };
}

const CreateProduct = ({
  design,
  options: productOptions,
}: CreateProductProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useKindeBrowserClient();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Uploading Design");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const byWearCraft =
    useSearchParams().get("bywearcraft") == "true" ? true : false;

  const [title, setTitle] = useState("");

  const productColor = PRODUCT_COLORS.find(
    (supportedColor) => supportedColor.value === productOptions.color.value
  );

  const productType = PRODUCT_TYPE.find(
    ({ value }) => value === productOptions.product_type.value
  )!;

  const { startUpload } = useUploadThing("imageUploader");

  const compressImage = async (imageBlob: File) => {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(imageBlob, options);
      return compressedFile;
    } catch (error) {
      console.error("Error compressing image:", error);
      throw error;
    }
  };

  const handleCreate = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!title) {
      return toast({
        title: "Invalid Name",
        description: "Product name cannot be empty",
        variant: "destructive",
      });
    }
    setIsLoading(true);

    let designId;

    const designIdFromStorage = window.localStorage.getItem("designId");
    if (designIdFromStorage) {
      designId = window.localStorage.getItem("designId");
    } else {
      const file = new File([dataURLToBlob(design)], `${nanoid()}.png`, {
        type: "image/png",
      });
      const compressedFile = await compressImage(file);

      await startUpload([compressedFile])
        .then((res) => {
          if (res) {
            designId = res[0].url;
            window.localStorage.setItem("designId", res[0].url);
          }
        })
        .catch(() => {
          setIsLoading(false);
          toast({
            title: "something went wrong",
            description: "please try again",
            variant: "destructive",
          });
        });
    }

    if (designId) {
      window.localStorage.setItem("designId", designId);

      setLoadingText("Creating Product");
      try {
        const productId = await createShopProduct({
          title: title,
          imageUrl: designId,
          color: productColor?.value!,
          type: productType.value,
          byWearCraft,
        });

        toast({
          title: "Request Success!",
          description: "Product has been successfully created",
        });

        setIsLoading(false);
        setLoadingText("Uploading Design");

        localStorage.removeItem("uploadedImages");
        localStorage.removeItem("designConfiguration");
        localStorage.removeItem("designId");

        router.replace(`/product/${productId}`);
      } catch (error: any) {
        setIsLoading(false);
        toast({
          title: "something went wrong",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const dataURLToBlob = (dataURL: string) => {
    const [header, data] = dataURL.split(",");
    // @ts-expect-error
    const mime = header.match(/:(.*?);/)[1];
    const bstr = atob(data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

      <div className="mt-10 sm:mt-0 flex flex-col md:flex-row items-center md:gap-x-8">
        <div className="flex-1 lg:flex-0.5 w-full">
          <div className="relative w-full bg-opacity-50 pointer-events-none aspect-[3/4]">
            <NextImage
              fill
              alt={`${productType.value}-design`}
              src={design}
              className="pointer-events-none z-10 select-none absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 lg:flex-0.5 flex flex-col gap-y-4 ">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Name Your Product
          </h3>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="mt-4 flex pb-12 gap-4 w-full">
            <Button
              onClick={() => {
                saveAs(design, `${productType.value}-design.png`);
              }}
              className="px-4 sm:px-6 lg:px-8 flex-0.5"
            >
              Download <Download className="h-4 w-4 ml-1.5 inline" />
            </Button>
            <Button
              isLoading={isLoading}
              loadingText={loadingText}
              disabled={isLoading}
              onClick={handleCreate}
              className="px-4 sm:px-6 lg:px-8 flex-0.5"
            >
              Create <Pickaxe className="h-4 w-4 ml-1.5 inline" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;
