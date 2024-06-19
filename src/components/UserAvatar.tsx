import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NextImage from "next/image";
import { User } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";

const UserAvatar = ({
  userImage,
  isAdmin,
}: {
  userImage: string | null;
  isAdmin: boolean;
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="size-8 relative rounded-full">
          {userImage ? (
            <NextImage
              src={userImage}
              alt="user-profile"
              fill
              className="rounded-full"
            />
          ) : (
            <User className="size-full" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col px-0 py-1 w-fit">
        {isAdmin ? (
          <Link
            href="/dashboard"
            className={buttonVariants({
              size: "sm",
              variant: "ghost",
            })}
          >
            Dashboard
          </Link>
        ) : null}
        <Separator className="my-1" />
        <Link
          href="/api/auth/logout"
          className={buttonVariants({
            size: "sm",
            variant: "ghost",
          })}
        >
          Sign out
        </Link>
      </PopoverContent>
    </Popover>
  );
};

export default UserAvatar;
