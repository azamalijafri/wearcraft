"use client";

import { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { Check, ChevronsUpDown, ArrowRight } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import {
  PRODUCT_COLORS,
  PRODUCT_SIZE,
  PRODUCT_TYPE,
  BASE_PRICE,
} from "@/constants/product-options";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup } from "@headlessui/react";

interface DesignerProps {
  uploadedImages: { file: File; width: number; height: number }[];
}

const Designer = ({ uploadedImages }: DesignerProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);

  const [options, setOptions] = useState<{
    color: (typeof PRODUCT_COLORS)[number];
    product_type: (typeof PRODUCT_TYPE)[number];
    product_size: (typeof PRODUCT_SIZE)[number];
  }>({
    color: PRODUCT_COLORS[0],
    product_type: PRODUCT_TYPE[0],
    product_size: PRODUCT_SIZE[0],
  });

  const [renderedDimensions, setRenderedDimensions] = useState(
    uploadedImages.map((image) => ({
      width: image?.width / 4,
      height: image?.height / 4,
      x: 200,
      y: 200,
    }))
  );

  useEffect(() => {
    setRenderedDimensions(
      uploadedImages.map((image) => ({
        width: image?.width / 4,
        height: image?.height / 4,
        x: 200,
        y: 200,
      }))
    );
  }, [uploadedImages]);

  const tshirtRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawImagesOnCanvas = (
    ctx: CanvasRenderingContext2D,
    templateImage: HTMLImageElement
  ) => {
    if (!tshirtRef.current || !containerRef.current) return;

    const { left: templateLeft, top: templateTop } =
      tshirtRef.current.getBoundingClientRect();
    const { left: containerLeft, top: containerTop } =
      containerRef.current.getBoundingClientRect();

    const leftOffset = templateLeft - containerLeft;
    const topOffset = templateTop - containerTop;

    const scaleX = templateImage.width / tshirtRef.current.clientWidth;
    const scaleY = templateImage.height / tshirtRef.current.clientHeight;

    const imagePromises = uploadedImages.map((image, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(image.file);
        img.onload = () => {
          const dims = renderedDimensions[index];

          const x = dims?.x
            ? (dims?.x - leftOffset) * scaleX
            : (200 - leftOffset) * scaleX;
          const y = dims?.y
            ? (dims?.y - topOffset) * scaleY
            : (200 - topOffset) * scaleY;
          const width = dims?.width ? dims.width * scaleX : image.width;
          const height = dims?.height ? dims.height * scaleY : image.height;
          ctx.drawImage(img, x, y, width, height);
          resolve();
        };
      });
    });

    try {
      Promise.all(imagePromises).then(() => {
        ctx.restore();

        const dataURL = canvasRef?.current?.toDataURL("image/png") as string;

        if (dataURL) {
          localStorage.setItem(
            "designConfiguration",
            JSON.stringify({ design: dataURL, options: options })
          );
          localStorage.removeItem("uploadedImages");
          router.push("/customize/preview");
          setIsProcessing(false);
        }
      });
    } catch (error) {
      setIsProcessing(false);
      return toast({
        title: "something went wrong",
        description: "please try again",
        variant: "destructive",
      });
    }
  };

  const saveConfiguration = () => {
    setIsProcessing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !tshirtRef.current) return;

    const templateImage = new Image();
    templateImage.src = `/${options.color.value}-${options.product_type.value}-template.png`;

    templateImage.onload = async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      canvas.width = templateImage.width;
      canvas.height = templateImage.height;

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(templateImage, 0, 0);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, templateImage.width, templateImage.height);
      ctx.clip();

      drawImagesOnCanvas(ctx, templateImage);
    };
  };

  return (
    <div className="relative mt-20 grid grid-cols-1 lg:grid-cols-4 mb-20 pb-20">
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <div
        ref={containerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative w-full bg-opacity-50 pointer-events-none aspect-[3/4]">
          <AspectRatio
            ref={tshirtRef}
            ratio={3 / 4}
            className="pointer-events-none relative z-10 aspect-[3/4] w-full"
          >
            <NextImage
              fill
              alt={`${options.product_type.label}-template`}
              src={`/${options.color.value}-${options.product_type.value}-template.png`}
              className="pointer-events-none z-10 select-none absolute inset-0 w-full h-full object-cover"
            />
          </AspectRatio>
        </div>

        {uploadedImages.map((image, index) => (
          <Rnd
            key={index}
            default={{
              x: renderedDimensions[index]?.x ?? 200,
              y: renderedDimensions[index]?.y ?? 200,
              height: renderedDimensions[index]?.height ?? image?.height / 4,
              width: renderedDimensions[index]?.width ?? image?.width / 4,
            }}
            onResizeStop={(_, __, ref, ___, { x, y }) => {
              setRenderedDimensions((dims) => {
                const newDims = [...dims];
                newDims[index] = {
                  ...newDims[index],
                  width: parseInt(ref.style.width.slice(0, -2)),
                  height: parseInt(ref.style.height.slice(0, -2)),
                  x,
                  y,
                };
                return newDims;
              });
            }}
            onDragStop={(_, data) => {
              const { x, y } = data;
              setRenderedDimensions((dims) => {
                const newDims = [...dims];
                newDims[index] = {
                  ...newDims[index],
                  x,
                  y,
                };
                return newDims;
              });
            }}
            className="absolute z-20"
            lockAspectRatio
          >
            <div className="relative w-full h-full">
              {image?.file && (
                <NextImage
                  src={URL.createObjectURL(image?.file)}
                  fill
                  alt="your image"
                  className="pointer-events-none z-50"
                />
              )}
            </div>
          </Rnd>
        ))}
      </div>

      <div className="h-[37.5rem] w-full col-span-full lg:col-span-2 flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />

          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight font-bold text-3xl">
              Customize Your Outfit
            </h2>

            <div className="w-full h-px bg-zinc-200 my-6" />

            <div className="relative mt-4 h-full flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <RadioGroup
                  value={options.color}
                  onChange={(val) => {
                    setOptions((prev) => ({
                      ...prev,
                      color: val,
                    }));
                  }}
                >
                  <Label>Color: {options.color.label}</Label>
                  <div className="mt-3 flex items-center space-x-3">
                    {PRODUCT_COLORS.map((color) => (
                      <RadioGroup.Option
                        key={color.label}
                        value={color}
                        className={({ active, checked }) =>
                          cn(
                            "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2 border-transparent ",
                            {
                              [`border-${color.tw}`]: active || checked,
                            }
                          )
                        }
                      >
                        <span
                          className={cn(
                            `bg-${color.tw}`,
                            "h-8 w-8 rounded-full border border-black border-opacity-10"
                          )}
                        />
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>

                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Product Type</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.product_type.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {PRODUCT_TYPE.map((product_type) => (
                        <DropdownMenuItem
                          key={product_type.label}
                          className={cn(
                            "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100 w-full",
                            {
                              "bg-zinc-100":
                                product_type.label ===
                                options.product_type.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({ ...prev, product_type }));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              product_type.label === options.product_type.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {product_type.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="relative flex flex-col gap-3 w-full">
                  <Label>Sizes</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.product_size.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {PRODUCT_SIZE.map((product_size) => (
                        <DropdownMenuItem
                          key={product_size.label}
                          className={cn(
                            "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100",
                            {
                              "bg-zinc-100":
                                product_size.label ===
                                options.product_size.label,
                            }
                          )}
                          onClick={() => {
                            setOptions((prev) => ({ ...prev, product_size }));
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              product_size.label === options.product_size.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {product_size.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-200" />
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center">
              <p className="font-medium whitespace-nowrap">
                {formatPrice((BASE_PRICE + options.product_type.price) / 100)}
              </p>
              <Button
                isLoading={isProcessing}
                disabled={isProcessing}
                loadingText="Saving"
                onClick={saveConfiguration}
                size="sm"
                className="w-full"
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Designer;
