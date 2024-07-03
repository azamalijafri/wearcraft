"use client";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import axios from "axios";
import ProductsGrid from "@/components/products/ProductsGrid";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const fetchProducts = async ({ pageParam = 0 }): Promise<any> => {
    try {
      const response = await axios.get(`/api/my/products?page=${pageParam}`);

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
      queryKey: ["my-products"],
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
            My Products
          </h1>
          <Link
            href={"/customize/upload?onlycreate=true"}
            className={buttonVariants()}
          >
            Create Product
          </Link>
        </div>
        <Separator />
        <ProductsGrid
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          lastProductRef={lastProductRef}
          products={products}
        />
      </div>
    </div>
  );
};

export default Page;
