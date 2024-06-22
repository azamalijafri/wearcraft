"use client";

import { getWearCraftProducts } from "@/actions/product-actions";
import ProductCard from "@/components/products/ProductCard";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShopProduct, User } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo, useRef } from "react";

const Page = () => {
  const fetchProducts = async ({ pageParam = 0 }): Promise<any> => {
    const response = await fetch(`/api/products?page=${pageParam}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    console.log(response);

    return response.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["dashboard-products"],
      queryFn: ({ pageParam }) => fetchProducts({ pageParam }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) =>
        lastPage.nextPage ? allPages.length + 1 : undefined,
    });

  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  //   useInfiniteQuery("products", fetchProducts, {
  //     getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? false,
  //   });

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

  console.log(data?.pages[0]);

  console.log(data?.pages[0]?.products);

  // const products = useMemo(() => {
  //   return data?.pages ? JSON.parse(data?.pages[0]?.products?.value) : [];
  // }, [data]);

  const products = data ? data.pages.flatMap((page) => page.products) : [];

  console.log(products);

  if (!products) return <Loader className="animate-spin" />;

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {products?.map((product, index) => {
            if (index === products.length - 1) {
              return (
                <div ref={lastProductRef} key={product.id}>
                  <ProductCard product={product} />
                </div>
              );
            } else {
              return <ProductCard key={product.id} product={product} />;
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
