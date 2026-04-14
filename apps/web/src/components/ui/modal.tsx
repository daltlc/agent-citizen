"use client";

import { type ReactNode } from "react";
import { ZModal } from "@/components/zephyr/z-modal";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <ZModal open={open} onClose={onClose}>
      <div className="w-full max-w-lg rounded-lg border border-gray-800 bg-gray-900 p-6">
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-gray-100">{title}</h2>
        )}
        {children}
      </div>
    </ZModal>
  );
}
