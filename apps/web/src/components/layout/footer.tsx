export function Footer() {
  return (
    <footer className="border-t border-citizen-border py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-citizen-text-dim">
        <p>Agent Citizen. Agent-powered. For the world.</p>
        <p className="mt-2">
          Created by{" "}
          <a
            href="https://github.com/daltlc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-citizen-text-muted hover:text-citizen-text transition-colors"
          >
            @daltlc
          </a>
        </p>
      </div>
    </footer>
  );
}
