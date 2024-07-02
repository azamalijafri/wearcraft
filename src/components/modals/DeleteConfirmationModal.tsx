"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { db } from "@/lib/db";
import axios from "axios";
import { useToast } from "../ui/use-toast";

interface DeleteConfirmationModalProps {
  productId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  handleDelete: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  productId,
  isOpen,
  setIsOpen,
  isLoading,
  handleDelete,
}) => {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-[9999999]">
        <DialogHeader className="py-10">
          <DialogTitle className="text-xl text-center font-bold text-gray-900">
            Are you sure you want to delete this product?
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <Button
            onClick={handleDelete}
            size={"sm"}
            variant={"destructive"}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            size={"sm"}
            variant={"outline"}
          >
            Cancle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
