"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

interface ZInfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  children: ReactNode;
  className?: string;
}

export function ZInfiniteScroll({
  onLoadMore,
  hasMore,
  children,
  className = "",
}: ZInfiniteScrollProps) {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleLoadMore = () => onLoadMore();
    el.addEventListener("loadmore", handleLoadMore);
    return () => el.removeEventListener("loadmore", handleLoadMore);
  }, [onLoadMore]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!hasMore) {
      (el as unknown as { complete: () => void }).complete();
    }
  }, [hasMore]);

  if (!mounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <z-infinite-scroll ref={ref} className={className}>
      {children}
    </z-infinite-scroll>
  );
}
