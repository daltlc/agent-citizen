"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface ZModalProps {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

export function ZModal({ open, onClose, children, className = "" }: ZModalProps) {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClose = () => onClose?.();
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !mounted) return;

    if (open) {
      (el as unknown as { open: () => void }).open();
    } else {
      (el as unknown as { close: () => void }).close();
    }
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <z-modal ref={ref} className={className}>
      {children}
    </z-modal>
  );
}
