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
      <div className="w-full max-w-lg rounded-lg border border-citizen-border bg-citizen-elevated p-6">
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-citizen-text">{title}</h2>
        )}
        {children}
      </div>
    </ZModal>
  );
}
