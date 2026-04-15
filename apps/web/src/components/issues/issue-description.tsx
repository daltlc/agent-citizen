"use client";

import ReactMarkdown from "react-markdown";

export function IssueDescription({ description }: { description: string }) {
  return (
    <div className="prose-citizen text-citizen-text">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const isBlock = className?.startsWith("language-") || String(children).includes("\n");
            if (isBlock) {
              return (
                <pre className="overflow-x-auto rounded-lg border border-citizen-border bg-citizen-muted p-4 text-sm">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code
                className="rounded bg-citizen-muted px-1.5 py-0.5 text-sm text-citizen-accent"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <>{children}</>;
          },
          p({ children }) {
            return <p className="mb-3 leading-relaxed">{children}</p>;
          },
          ol({ children }) {
            return <ol className="mb-3 list-decimal space-y-1 pl-6">{children}</ol>;
          },
          ul({ children }) {
            return <ul className="mb-3 list-disc space-y-1 pl-6">{children}</ul>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="mb-3 mt-6 text-xl font-bold">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mb-2 mt-5 text-lg font-semibold">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="mb-2 mt-4 text-base font-semibold">{children}</h3>;
          },
          a({ href, children }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-citizen-accent hover:underline">
                {children}
              </a>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="mb-3 border-l-2 border-citizen-border pl-4 text-citizen-sand italic">
                {children}
              </blockquote>
            );
          },
          hr() {
            return <hr className="my-4 border-citizen-border" />;
          },
        }}
      >
        {description}
      </ReactMarkdown>
    </div>
  );
}
