import NextImage from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { ShopProduct, User } from "@prisma/client";
import { Rating } from "react-simple-star-rating";

const ProductCard = ({
  product,
  addToCart,
}: {
  product: ShopProduct & { user: User };
  addToCart?: boolean;
}) => {
  return (
    <Card className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center relative">
      <Link
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
        <h3 className="truncate font-extrabold lg:text-lg">{product?.title}</h3>
        <Rating
          initialValue={product?.rating}
          size={15}
          readonly={true}
          SVGstyle={{ display: "inline" }}
          fillColor="#FF6A00"
        />
        {addToCart && <Button className="w-full mt-4">Add to Cart</Button>}
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
