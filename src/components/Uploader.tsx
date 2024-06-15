"use client";

import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Image as ImageIcon,
  Loader2,
  MousePointerSquareDashed,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import Dropzone, { FileRejection } from "react-dropzone";

interface ImageUploadProps {
  onUpload: (files: { file: File; width: number; height: number }[]) => void;
}

const Uploader: React.FC<ImageUploadProps> = ({ onUpload }) => {
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  // const { startUpload, isUploading } = useUploadThing('imageUploader', {
  //   onClientUploadComplete: ([data]) => {
  //     const configId = data.serverData.configId
  //     startTransition(() => {
  //       router.push(`/configure/design?id=${configId}`)
  //     })
  //   },
  //   onUploadProgress(p) {
  //     setUploadProgress(p)
  //   },
  // })

  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles;

    setIsDragOver(false);

    toast({
      title: `${file.file.type} type is not supported.`,
      description: "Please choose a PNG, JPG, or JPEG image instead.",
      variant: "destructive",
    });
  };

  const onDropAccepted = useCallback(
    async (acceptedFiles: File[]) => {
      setLoading(true);
      const formattedFiles = acceptedFiles.map(async (file) => {
        return new Promise<{
          file: File;
          width: number;
          height: number;
          base64: string;
        }>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target?.result as string;
            const img = new window.Image();
            img.onload = () => {
              resolve({ file, width: img.width, height: img.height, base64 });
            };
            img.src = base64;
          };
          reader.readAsDataURL(file);
        });
      });

      await Promise.all(formattedFiles)
        .then(onUpload)
        .then(() => {
          setLoading(false);
        });
    },
    [onUpload]
  );

  useEffect(() => {
    localStorage.removeItem("uploadedImages");
  }, []);

  return (
    <div
      className={cn(
        "relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
        {
          "ring-blue-900/25 bg-blue-900/10": isDragOver,
        }
      )}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" />
              ) : loading ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
              ) : (
                <ImageIcon className="h-6 w-6 text-zinc-500 mb-2" />
              )}
              <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                {
                  // isUploading ? (
                  //   <div className='flex flex-col items-center'>
                  //     <p>Uploading...</p>
                  //     <Progress
                  //       value={uploadProgress}
                  //       className='mt-2 w-40 h-2 bg-gray-300'
                  //     />
                  //   </div>
                  // ) :
                  loading ? (
                    <div className="flex flex-col items-center">
                      <p>Redirecting, please wait...</p>
                    </div>
                  ) : isDragOver ? (
                    <p>
                      <span className="font-semibold">Drop file</span> to upload
                    </p>
                  ) : (
                    <p>
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                  )
                }
              </div>

              {loading ? null : (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default Uploader;
