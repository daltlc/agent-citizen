"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface ZephyrContextValue {
  ready: boolean;
}

const ZephyrContext = createContext<ZephyrContextValue>({ ready: false });

export function useZephyrReady() {
  return useContext(ZephyrContext).ready;
}

export function ZephyrProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = "dark";

    import("zephyr-framework").then(() => {
      setReady(true);
    });
  }, []);

  return (
    <ZephyrContext.Provider value={{ ready }}>
      {children}
    </ZephyrContext.Provider>
  );
}
