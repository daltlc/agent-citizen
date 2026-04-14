import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  href?: string;
  transitionName?: string;
}

export function Card({ className = "", children, href, transitionName, ...props }: CardProps) {
  const classes = `rounded-lg border border-gray-800 bg-gray-900/50 p-4 transition-colors ${
    href ? "hover:border-gray-700 hover:bg-gray-900" : ""
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
  return <h3 className={`font-semibold text-gray-100 ${className}`} {...props} />;
}

export function CardDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`mt-1 text-sm text-gray-400 ${className}`} {...props} />;
}
