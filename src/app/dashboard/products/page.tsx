"use client";

import ProductCard from "@/components/products/ProductCard";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import axios from "axios";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const fetchProducts = async ({ pageParam = 0 }): Promise<any> => {
    try {
      const response = await axios.get(
        `/api/dashboard/products?page=${pageParam}`
      );
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      toast({
        title: "something went wrong",
        description: error.response.data.message,
        variant: "destructive",
      });
      router.push("/");
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["dashboard-products"],
      queryFn: ({ pageParam }) => fetchProducts({ pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage?.nextPage ?? undefined;
      },
    });

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastProductRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log(hasNextPage);

          fetchNextPage();
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  const products = data ? data.pages.flatMap((page) => page?.products) : [];

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-4 sm:py-4 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Our Products
          </h1>
          <Link
            href={"/customize/upload?onlycreate=true&bywearcraft=true"}
            className={buttonVariants()}
          >
            Create Product
          </Link>
        </div>
        <Separator />
        {!isLoading && !products && (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="font-bold">No Products Found</h1>
          </div>
        )}
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader className="animate-spin size-8" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {products &&
              products?.map((product, index) => {
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
        {isFetchingNextPage && (
          <Loader className="animate-spin h-6 w-full mt-4" />
        )}
      </div>
    </div>
  );
};

export default Page;
