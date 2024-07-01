import NextImage from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Rating as ProductRating, ShopProduct, User } from "@prisma/client";
import { Rating } from "react-simple-star-rating";

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

  return (
    <Card className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center relative">
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
            Add to Cart
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
