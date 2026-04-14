import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  href?: string;
  transitionName?: string;
}

export function Card({ className = "", children, href, transitionName, ...props }: CardProps) {
  const classes = `rounded-lg border border-citizen-border bg-citizen-elevated p-4 transition-all duration-200 ${
    href ? "hover:border-citizen-border-subtle hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:-translate-y-0.5" : ""
  } ${className}`;

  const transitionStyle = transitionName
    ? { viewTransitionName: transitionName }
    : undefined;

  if (href) {
    return (
      <a href={href} className={`block ${classes}`} style={transitionStyle} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <div className={classes} style={transitionStyle} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`font-semibold text-citizen-text ${className}`} {...props} />;
}

export function CardDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`mt-1 text-sm text-citizen-text-muted ${className}`} {...props} />;
}
