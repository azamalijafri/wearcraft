"use client";

import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const NoAuthNavLinks = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <Button
        onClick={() => {
          localStorage.setItem("redirectUrl", pathname);
          router.push("/api/auth/register");
        }}
        size={"sm"}
        variant={"ghost"}
      >
        Sign up
      </Button>

      <Button
        onClick={() => {
          localStorage.setItem("redirectUrl", pathname);
          router.push("/api/auth/login");
        }}
        size={"sm"}
        variant={"ghost"}
      >
        Login
      </Button>

      <div className="h-8 w-px bg-zinc-200 hidden sm:block" />

      <div className="h-full flex items-center space-x-4">
        <Link
          href="/products"
          className={buttonVariants({
            size: "sm",
            className: "hidden sm:flex items-center gap-1",
          })}
        >
          Shop
          <ShoppingBag className="ml-1.5 h-5 w-5" />
        </Link>
        <Link
          href="/customize/upload"
          className={buttonVariants({
            size: "sm",
            className: "hidden sm:flex items-center gap-1",
          })}
        >
          Customize
          <ArrowRight className="ml-1.5 h-5 w-5" />
        </Link>
      </div>
    </>
  );
};

export default NoAuthNavLinks;
