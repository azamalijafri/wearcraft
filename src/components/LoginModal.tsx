"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-[9999999]">
        <DialogHeader>
          <div className="relative mx-auto w-24 h-24 mb-2">
            {/* TODO: ADD LOGO */}
          </div>
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
            Log in to continue
          </DialogTitle>
          <DialogDescription className="text-base text-center py-2">
            Please login or create an account to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <Button
            onClick={() => {
              localStorage.setItem("redirectUrl", pathname);
              router.push("/api/auth/login");
            }}
            size={"sm"}
            variant={"outline"}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem("redirectUrl", pathname);
              router.push("/api/auth/register");
            }}
            size={"sm"}
          >
            Sign up
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
