import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-citizen-sand">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={`w-full rounded-lg border border-citizen-border bg-citizen-deep px-3 py-2 text-sm text-citizen-text placeholder-citizen-text-dim transition-colors focus:border-citizen-accent focus:outline-none focus:ring-1 focus:ring-citizen-accent/20 ${error ? "border-red-500" : ""} ${className}`}
          rows={4}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
