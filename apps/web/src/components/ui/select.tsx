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
          <label htmlFor={id} className="block text-sm font-medium text-citizen-sand">
            {label}
          </label>
        )}
        <select
          id={id}
          name={name}
          defaultValue={currentValue}
          className={`w-full rounded-lg border border-citizen-border bg-citizen-deep px-3 py-2 text-sm text-citizen-text transition-colors focus:border-citizen-accent focus:outline-none focus:ring-1 focus:ring-citizen-accent/20 ${error ? "border-red-500" : ""} ${className}`}
          {...(props as SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {placeholder && (
            <option value="" className="text-citizen-text-dim">{placeholder}</option>
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
        <label htmlFor={id} className="block text-sm font-medium text-citizen-sand">
          {label}
        </label>
      )}
      {/* Hidden native select for form submission fallback */}
      <input type="hidden" name={name} value={currentValue} />
      <z-select ref={ref} id={id}>
        <button
          slot="trigger"
          type="button"
          className={`w-full rounded-lg border bg-citizen-deep px-3 py-2 text-left text-sm transition-colors focus:border-citizen-accent focus:outline-none focus:ring-1 focus:ring-citizen-accent/20 ${
            error ? "border-red-500" : "border-citizen-border"
          } ${currentValue ? "text-citizen-text" : "text-citizen-text-dim"} ${className}`}
        >
          {selectedLabel}
        </button>
        <div slot="options" className="rounded-lg border border-citizen-border bg-citizen-elevated py-1 shadow-lg">
          {options.map((opt) => (
            <div
              key={opt.value}
              data-value={opt.value}
              className="cursor-pointer px-3 py-2 text-sm text-citizen-text-muted hover:bg-citizen-muted hover:text-citizen-text transition-colors"
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
