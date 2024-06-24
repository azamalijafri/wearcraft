"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Filter, MenuIcon, XIcon } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const PRODUCT_COLORS = ["Black", "White", "Red", "Green"];
const PRODUCT_TYPE = ["T-shirt", "Hoodie"];

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

  // const handleColorChange = (color: string) => {
  //   setSelectedColors((prev) =>
  //     prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
  //   );
  // };

  // const handleTypeChange = (type: string) => {
  //   setSelectedTypes((prev) =>
  //     prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
  //   );
  // };

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
        } md:translate-x-0 md:relative h-full md:h-[calc(100vh-3.5rem)] w-3/4 md:w-32 lg:w-52 bg-white mt-14 md:mt-0`}
      >
        <div className="flex flex-col items-center justify-center relative">
          <XIcon
            className="w-6 h-6 absolute -right-14 top-0 md:hidden"
            onClick={toggleFilterbar}
          />
          <div className="relative flex flex-col gap-3 items-start w-full">
            <div className="w-full flex flex-col gap-y-2">
              <h3 className="font-semibold">Product Type</h3>
              {PRODUCT_TYPE.map((type) => (
                <div key={type} className="flex items-center">
                  <Checkbox
                    id={type}
                    checked={selectedTypes.includes(type)}
                    onCheckedChange={() => onTypeChange(type)}
                    className="mr-2"
                  />
                  <Label htmlFor={type}>{type}</Label>
                </div>
              ))}
            </div>
            <div className="w-full mt-4 flex flex-col gap-y-2">
              <h3 className="font-semibold">Colors</h3>
              {PRODUCT_COLORS.map((color) => (
                <div key={color} className="flex items-center">
                  <Checkbox
                    id={color}
                    checked={selectedColors.includes(color)}
                    onCheckedChange={() => onColorChange(color)}
                    className="mr-2"
                  />
                  <Label htmlFor={color}>{color}</Label>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full flex gap-x-2" size={"sm"}>
              <span>Filter</span>
              <Filter className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filterbar;
