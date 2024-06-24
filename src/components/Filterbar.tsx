"use client";

import { useState } from "react";
import { Filter, MenuIcon, XIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { PRODUCT_COLORS, PRODUCT_TYPE } from "@/constants/product-options";

const Filterbar = ({
  selectedColors,
  selectedTypes,
  onColorChange,
  onTypeChange,
}: {
  selectedColors: string[];
  selectedTypes: string[];
  onColorChange: (val: string) => void;
  onTypeChange: (val: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleFilterbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="z-max">
      <button
        className="p-2 text-gray-700 rounded-md md:hidden"
        onClick={toggleFilterbar}
      >
        {!isOpen && <MenuIcon className="w-6 h-6" />}
      </button>
      <div
        className={`fixed border-r-2 inset-0 z-max flex flex-col items-center justify-start py-4 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative h-full md:h-[calc(100vh-3.5rem)] w-3/4 md:w-40 lg:w-52 bg-white mt-14 md:mt-0`}
      >
        <div className="flex flex-col items-center justify-center relative md:mt-10">
          <XIcon
            className="w-6 h-6 absolute -right-14 top-0 md:hidden"
            onClick={toggleFilterbar}
          />
          <div className="relative flex flex-col gap-3 items-start w-full">
            <div className="w-full flex flex-col gap-y-2">
              <h3 className="font-semibold">Product Type</h3>
              {PRODUCT_TYPE.map((type) => (
                <div key={type.value} className="flex items-center">
                  <Checkbox
                    id={type.value}
                    checked={selectedTypes.includes(type.value)}
                    onCheckedChange={() => onTypeChange(type.value)}
                    className="mr-2"
                  />
                  <Label htmlFor={type.value}>{type.label}</Label>
                </div>
              ))}
            </div>
            <div className="w-full mt-4 flex flex-col gap-y-2">
              <h3 className="font-semibold">Colors</h3>
              {PRODUCT_COLORS.map((color) => (
                <div key={color.value} className="flex items-center">
                  <Checkbox
                    id={color.value}
                    checked={selectedColors.includes(color.value)}
                    onCheckedChange={() => onColorChange(color.value)}
                    className="mr-2"
                  />
                  <Label htmlFor={color.value}>{color.label}</Label>
                </div>
              ))}
            </div>
            {/* <Button
              className="mt-4 w-full flex gap-x-2"
              size={"sm"}
              onClick={() => filterProducts({ pageParam: 0 })}
            >
              <span>Filter</span>
              <Filter className="size-3" />
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filterbar;
