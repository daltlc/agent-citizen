/* eslint-disable @typescript-eslint/no-empty-interface */

declare module "zephyr-framework/dashboard/zephyr-dashboard.js";
declare module "zephyr-framework/runtime/zephyr-runtime.js";

type ZephyrHTMLAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare namespace JSX {
  interface IntrinsicElements {
    "z-accordion": ZephyrHTMLAttributes;
    "z-accordion-item": ZephyrHTMLAttributes;
    "z-modal": ZephyrHTMLAttributes;
    "z-tabs": ZephyrHTMLAttributes;
    "z-select": ZephyrHTMLAttributes;
    "z-combobox": ZephyrHTMLAttributes;
    "z-carousel": ZephyrHTMLAttributes;
    "z-toast": ZephyrHTMLAttributes;
    "z-dropdown": ZephyrHTMLAttributes;
    "z-datepicker": ZephyrHTMLAttributes;
    "z-file-upload": ZephyrHTMLAttributes;
    "z-infinite-scroll": ZephyrHTMLAttributes;
    "z-sortable": ZephyrHTMLAttributes;
    "z-virtual-list": ZephyrHTMLAttributes;
    "z-stat": ZephyrHTMLAttributes;
    "z-dashboard": ZephyrHTMLAttributes;
    "z-dashboard-panel": ZephyrHTMLAttributes;
    "z-data-grid": ZephyrHTMLAttributes;
    "z-chart": ZephyrHTMLAttributes;
    "z-stream": ZephyrHTMLAttributes;
    "z-stream-entry": ZephyrHTMLAttributes;
    "z-command": ZephyrHTMLAttributes;
    "z-ticker": ZephyrHTMLAttributes;
  }
}

interface ZephyrToastFn {
  (message: string, duration?: number): void;
}

interface ZephyrGlobal {
  toast: ZephyrToastFn;
  agent: {
    getState: () => unknown[];
    describe: (selector: string) => unknown;
    act: (selector: string, action: string, params?: unknown) => unknown;
    setState: (selector: string, attrs: Record<string, unknown>) => unknown;
    getSchema: () => unknown;
    getPrompt: () => string;
    observe: (callback: (change: unknown) => void) => void;
    headless: (enable: boolean) => void;
    render: (selector: string, spec: unknown) => unknown;
    compose: (selector: string, spec: unknown) => unknown;
    stream: (selector: string, entry: unknown) => unknown;
  };
}

declare global {
  interface Window {
    Zephyr: ZephyrGlobal;
  }
}
