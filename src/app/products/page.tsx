"use client";

import Filterbar from "@/components/Filterbar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { useState, useRef, useCallback } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import ProductsGrid from "../dashboard/products/ProductsGrid";
import { useDebounce } from "@uidotdev/usehooks";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const { toast } = useToast();
  const router = useRouter();

  const fetchProducts = async ({ pageParam = 0 }): Promise<any> => {
    const params = new URLSearchParams();

    if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);

    if (selectedColors.length > 0)
      params.append("colors", selectedColors.join(","));

    if (selectedTypes.length > 0)
      params.append("types", selectedTypes.join(","));

    try {
      const response = await axios.get(
        `/api/products?page=${pageParam}&${params.toString()}`
      );

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: [
      "shop-products",
      debouncedSearchQuery,
      selectedColors,
      selectedTypes,
    ],
    queryFn: ({ pageParam }) => fetchProducts({ pageParam }),
    initialPageParam: 0,
    refetchOnWindowFocus: false,
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

  // const queryClient = useQueryClient();

  // useEffect(() => {
  //   const invalidateAndRefetch = async () => {
  //     await queryClient.invalidateQueries({ queryKey: ["shop-products"] });
  //   };

  //   invalidateAndRefetch();
  // }, [searchQuery, selectedColors, selectedTypes]);

  const products = data ? data.pages.flatMap((page) => page?.products) : [];

  return (
    <div className="flex h-[calc(100vh-7rem)]">
      <div className="fixed z-50">
        <Filterbar
          selectedColors={selectedColors}
          selectedTypes={selectedTypes}
          onColorChange={handleColorChange}
          onTypeChange={handleTypeChange}
        />
      </div>
      <div className="flex-1 p-4 md:ml-40 lg:ml-52 h-full mt-8 -z-10 md:z-0">
        <MaxWidthWrapper>
          {/* SEARCH BAR */}
          <div className="fixed top-[4.5rem] w-full z-40 h-10 inset-0">
            <div className="flex justify-center items-center bg-white w-3/4 md:w-1/2 lg:w-1/4 mx-auto relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon
                  className={`transition-colors duration-300 text-md ease-in-out size-5 ${
                    isFocused ? "text-primary" : "text-gray-400"
                  }`}
                />
              </div>
              <Input
                type="text"
                placeholder="Search"
                className="w-full p-2 pl-10 pr-20 border-gray-300 rounded-md border-2 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary focus:outline-none transition-colors duration-300 ease-in-out"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={handleSearchChange}
                value={searchQuery}
              />
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="mt-10 h-full">
            <ProductsGrid
              isFetchingNextPage={isFetchingNextPage}
              isLoading={isLoading || isFetching}
              lastProductRef={lastProductRef}
              products={products}
            />
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
};

export default Page;
