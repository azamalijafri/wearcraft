"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  handleFunc: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  setIsOpen,
  isLoading,
  handleFunc,
}) => {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-[9999999]">
        <DialogHeader className="py-10">
          <DialogTitle className="text-xl text-center font-bold text-gray-900">
            Are you sure you want to perform this action?
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <Button
            onClick={handleFunc}
            size={"sm"}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Yes
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            size={"sm"}
            variant={"outline"}
          >
            No
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
