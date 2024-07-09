"use client";

import NextImage from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Rating as ProductRating, ShopProduct, User } from "@prisma/client";
import { Rating } from "react-simple-star-rating";
import { ShoppingBasketIcon, Trash2, Upload } from "lucide-react";
import ConfirmationModal from "../modals/ConfirmationModal";
import { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { deleteProduct, publishProduct } from "@/actions/product-actions";

const ProductCard = ({
  product,
  addToCart,
}: {
  product: ShopProduct & { user: User } & { ratings: ProductRating[] };
  addToCart?: boolean;
}) => {
  let rating = product?.ratings?.reduce((acc, rating) => {
    return acc + rating.value;
  }, 0);

  rating = product?.ratings?.length > 0 ? rating / product.ratings.length : 0;

  const [isOpen, setIsOpen] = useState(false);
  const [alteringId, setAlteringId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState<"publish" | "delete" | "">("");
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const isdashboard = pathname.includes("dashboard");
  const ismyproduct = pathname.includes("my");
  const isshop = pathname.includes("shop");

  const queryKey = isdashboard ? "dashboard-products" : "my-products";

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteProduct({ productId: alteringId });
      queryClient.refetchQueries({ queryKey: [queryKey] });
      toast({
        title: "Request Success",
        description: "Product has been successfully deleted!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "something went wrong",
        description: "pls try again",
      });
    } finally {
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setIsLoading(true);
      await publishProduct({ productId: alteringId });
      queryClient.refetchQueries({ queryKey: [queryKey] });
      toast({
        title: "Request Success",
        description: "Product has been successfully published!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "something went wrong",
        description: "pls try again",
      });
    } finally {
      setIsOpen(false);
      setIsLoading(false);
    }
  };

  const handlefunc = modalType == "publish" ? handlePublish : handleDelete;

  return (
    <Card className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center relative">
      {(isdashboard || ismyproduct) && (
        <div
          className="absolute top-3 right-3 bg-red-600 p-1 rounded-md hover:bg-red-400 transition-all cursor-pointer z-50"
          onClick={(event) => {
            event.stopPropagation();
            setModalType("delete");
            setIsOpen(true);
            setAlteringId(product?.id);
          }}
        >
          <Trash2 className="size-5 text-white" />
        </div>
      )}
      <ConfirmationModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isLoading={isLoading}
        handleFunc={handlefunc}
      />
      <Link
        target="_blank"
        href={`/product/${product?.id}`}
        className="size-48 relative cursor-pointer"
      >
        <NextImage
          src={product?.imageUrl}
          alt="product-img"
          fill
          className="m-auto object-contain"
        />
      </Link>

      <hr className="w-full mb-3" />
      <div className="flex flex-col w-full text-zinc-800 items-center">
        <h3 className="truncate font-extrabold text-sm">{product?.title}</h3>
        <Rating
          initialValue={rating}
          size={15}
          readonly={true}
          SVGstyle={{ display: "inline" }}
          fillColor="#FF6A00"
        />
        {addToCart && (
          <Button className="w-full mt-4" size={"sm"}>
            Add to Cart <ShoppingBasketIcon className="h-4 w-4 ml-1.5 inline" />
          </Button>
        )}
        {ismyproduct && !product?.isPublished && (
          <Button
            className="w-full mt-4"
            size={"sm"}
            onClick={(event) => {
              event.stopPropagation();
              setModalType("publish");
              setIsOpen(true);
              setAlteringId(product?.id);
            }}
          >
            Publish <Upload className="h-4 w-4 ml-1.5 inline" />
          </Button>
        )}
      </div>
      {!product?.byWearCraft && (
        <p className="text-gray-700 mb-2 absolute top-2 left-2 text-xs font-semibold">
          By {product?.user?.name}
        </p>
      )}
    </Card>
  );
};

export default ProductCard;
