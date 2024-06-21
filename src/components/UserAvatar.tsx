"use client";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NextImage from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";
import { FaUser } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const NavLink = ({
  redirectLink,
  label,
}: {
  redirectLink: string;
  label: string;
}) => {
  return (
    <Link
      href={redirectLink}
      className={cn(
        buttonVariants({
          size: "sm",
          variant: "ghost",
        }),
        "font-normal"
      )}
    >
      {label}
    </Link>
  );
};

const UserAvatar = ({
  userImage,
  isAdmin,
}: {
  userImage: string | null;
  isAdmin: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger>
        <div className="size-8 relative rounded-full bg-gray-500 flex items-center justify-center">
          {userImage ? (
            <NextImage
              src={userImage}
              alt="user-profile"
              fill
              className="rounded-full"
            />
          ) : (
            <FaUser className="size-1/2 text-white" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col px-0 py-1 w-fit">
        <Link
          href="/customize/upload"
          className={cn(
            buttonVariants({
              size: "sm",
              variant: "ghost",
            }),
            "font-normal md:hidden"
          )}
        >
          Customize
        </Link>
        <Separator className="md:hidden" />
        <NavLink redirectLink="/my/orders" label="Orders" />
        <Separator />
        {isAdmin ? (
          <NavLink redirectLink="/dashboard" label="Dashboard" />
        ) : null}
        <Separator />
        <NavLink redirectLink="/api/auth/logout" label="Sign Out" />
      </PopoverContent>
    </Popover>
  );
};

export default UserAvatar;
