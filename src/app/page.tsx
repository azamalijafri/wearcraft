import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Check } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-slate-50">
      <MaxWidthWrapper className="pt-10 lg:grid lg:grid-cols-3  lg:gap-x-0 xl:gap-x-8 lg:pt-24 ">
        <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
          <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="absolute w-28 left-0 -top-20 hidden lg:block">
              {/* TODO: ADD SITE LOGO */}
              {/* <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t via-slate-50/50 from-slate-50 h-28' />
                <img src='/snake-1.png' className='w-full' /> */}
            </div>
            <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl">
              Create Your{" "}
              <span className="bg-orange-500 px-2 text-white">Custom</span>{" "}
              Hoodies & T-Shirts.
            </h1>
            <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
              Elevate Your Wardrobe with Personalized Apparel. Create Your Own
              Custom Hoodies & T-Shirts and Make a Statement Everywhere You Go!
            </p>
            <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
              <div className="space-y-2">
                <li className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  Ensuring top-notch quality in products and services.
                </li>
                <li className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  Consistent delivery on promises and deadlines.
                </li>
                <li className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  Operating with integrity and honesty.
                </li>
              </div>
            </ul>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
