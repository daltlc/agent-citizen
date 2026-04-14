"use client";

import { useRef, useEffect, useState, type SelectHTMLAttributes } from "react";

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement> | { target: { name?: string; value: string } }) => void;
}

export function Select({
  className = "",
  label,
  error,
  id,
  name,
  options,
  placeholder,
  value,
  defaultValue,
  onChange,
  ...props
}: SelectProps) {
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
      onChange?.({ target: { name, value: val } } as React.ChangeEvent<HTMLSelectElement>);
    };
    el.addEventListener("change", handleChange);
    return () => el.removeEventListener("change", handleChange);
  }, [onChange, name]);

  // Sync controlled value
  useEffect(() => {
    const el = ref.current;
    if (!el || value === undefined) return;
    (el as unknown as { value: string }).value = String(value);
  }, [value]);

  const currentValue = String(value ?? defaultValue ?? "");
  const selectedLabel = options.find((o) => o.value === currentValue)?.label ?? placeholder ?? "Select...";

  // SSR and pre-mount: render native select for form compat
  if (!mounted) {
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
          defaultValue={currentValue}
          className={`w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-100 transition-colors focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 ${error ? "border-red-500" : ""} ${className}`}
          {...(props as SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {placeholder && (
            <option value="" className="text-gray-500">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      {/* Hidden native select for form submission fallback */}
      <input type="hidden" name={name} value={currentValue} />
      <z-select ref={ref} id={id}>
        <button
          slot="trigger"
          type="button"
          className={`w-full rounded-lg border bg-gray-900 px-3 py-2 text-left text-sm transition-colors focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 ${
            error ? "border-red-500" : "border-gray-700"
          } ${currentValue ? "text-gray-100" : "text-gray-500"} ${className}`}
        >
          {selectedLabel}
        </button>
        <div slot="options" className="rounded-lg border border-gray-700 bg-gray-900 py-1 shadow-lg">
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
