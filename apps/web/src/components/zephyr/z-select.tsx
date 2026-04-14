"use client";

import { useRef, useEffect, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface ZSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  error?: string;
  id?: string;
  name?: string;
  className?: string;
}

export function ZSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  label,
  error,
  id,
  name,
  className = "",
}: ZSelectProps) {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = () => {
      const val = (el as unknown as { value: string }).value;
      onChange?.(val);
    };
    el.addEventListener("change", handleChange);
    return () => el.removeEventListener("change", handleChange);
  }, [onChange]);

  // Sync value from React to the custom element
  useEffect(() => {
    const el = ref.current;
    if (!el || value === undefined) return;
    (el as unknown as { value: string }).value = value;
  }, [value]);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  if (!mounted) {
    // SSR fallback: native select
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <select
          id={id}
          name={name}
          defaultValue={value}
          className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <z-select ref={ref} id={id} data-name={name}>
        <button
          slot="trigger"
          type="button"
          className={`w-full rounded-lg border bg-gray-900 px-3 py-2 text-left text-sm transition-colors focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 ${
            error ? "border-red-500" : "border-gray-700"
          } ${value ? "text-gray-100" : "text-gray-500"}`}
        >
          {selectedLabel}
        </button>
        <div slot="options" className="rounded-lg bg-gray-900 border border-gray-700 py-1 shadow-lg">
          {options.map((opt) => (
            <div
              key={opt.value}
              data-value={opt.value}
              className="cursor-pointer px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              tabIndex={0}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </z-select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
