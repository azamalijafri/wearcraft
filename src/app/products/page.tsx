"use client";

import Filterbar from "@/components/Filterbar";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

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

  const fetchFilteredItems = async () => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.append("search", searchQuery);
    }

    if (selectedColors.length > 0) {
      params.append("colors", selectedColors.join(","));
    }

    if (selectedTypes.length > 0) {
      params.append("types", selectedTypes.join(","));
    }
  };

  return (
    <div className="flex h-full">
      <div className="fixed">
        <Filterbar
          selectedColors={selectedColors}
          selectedTypes={selectedTypes}
          onColorChange={handleColorChange}
          onTypeChange={handleTypeChange}
        />
      </div>
      <div className="flex-1 p-4 md:ml-32 lg:ml-52 h-full mt-8 -z-10 md:z-0">
        <MaxWidthWrapper>
          <div className="flex justify-center items-center bg-white w-full mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon
                className={`transition-colors duration-300 text-md ease-in-out size-5 ${
                  isFocused ? "text-zinc-800" : "text-gray-400"
                }`}
              />
            </div>
            <Input
              type="text"
              placeholder="Search"
              className="w-full p-2 pl-10 pr-20 border-gray-300 rounded-md shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-zinc-800 focus:outline-none transition-colors duration-300 ease-in-out"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleSearchChange}
            />
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
};

export default Page;
