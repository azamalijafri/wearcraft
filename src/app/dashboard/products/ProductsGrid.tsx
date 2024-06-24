import ProductCard from "@/components/products/ProductCard";
import { Rating as ProductRating, ShopProduct, User } from "@prisma/client";
import { Frown, Loader } from "lucide-react";
import React from "react";

type ProductType = ShopProduct & { user: User } & { ratings: ProductRating[] };

const ProductsGrid = ({
  isLoading,
  isFetchingNextPage,
  products,
  lastProductRef,
}: {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  products: ProductType[];
  lastProductRef: any;
}) => {
  return (
    <div className="h-full">
      {!isLoading && (!products || products.length == 0) && (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="font-bold text-lg md:text-xl lg:text-2xl flex flex-col items-center gap-y-4 text-zinc-700">
            <Frown className="size-14" />
            No Products Found
          </h1>
        </div>
      )}
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin size-8" />
        </div>
      ) : (
        <>
          {products && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-10">
              {products?.map((product, index) => {
                if (index === products.length - 1) {
                  return (
                    <div ref={lastProductRef} key={product?.id}>
                      <ProductCard product={product} />
                    </div>
                  );
                } else {
                  return <ProductCard key={product.id} product={product} />;
                }
              })}
            </div>
          )}
        </>
      )}
      {isFetchingNextPage && (
        <Loader className="animate-spin h-6 w-full mt-4" />
      )}
    </div>
  );
};

export default ProductsGrid;
