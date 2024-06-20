"use client";

import { sidebarItems } from "@/constants/sidebar-items";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    toggleSidebar();
  }, [pathname]);

  return (
    <div className="z-max">
      <button
        className="p-2 text-gray-700 rounded-md md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? (
          <XIcon className="w-6 h-6" />
        ) : (
          <MenuIcon className="w-6 h-6" />
        )}
      </button>
      <div
        className={`fixed inset-0 z-max flex flex-col items-start justify-start py-4 bg-primary transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative h-full md:h-[calc(100vh-3.5rem)] w-3/4 md:w-32 lg:w-40`}
      >
        <nav className="w-full h-full md:mt-0 mt-[3.5rem]">
          <ul className="flex flex-col gap-3">
            {sidebarItems.map((item) => (
              <li key={item.id} className="w-full">
                <Link
                  href={item.href}
                  className={cn(
                    `flex gap-2 items-center w-full transition-all p-2 md:text-sm lg:text-base ${
                      pathname === item.href
                        ? "text-primary bg-white font-medium"
                        : "text-white"
                    }`
                  )}
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
