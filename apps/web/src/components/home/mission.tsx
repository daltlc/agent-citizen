const stats = [
  { label: "SDG Categories", value: "10", accent: "text-citizen-warm" },
  { label: "Agent-Driven", value: "AI", accent: "text-citizen-gold" },
];

export function Mission() {
  return (
    <section className="relative overflow-hidden bg-citizen-deep">
      {/* Subtle topo pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23f0ece4' stroke-width='0.5'%3E%3Cellipse cx='200' cy='200' rx='180' ry='120'/%3E%3Cellipse cx='200' cy='200' rx='140' ry='90'/%3E%3Cellipse cx='200' cy='200' rx='100' ry='60'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "400px 400px",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Pull quote, left */}
          <div className="scroll-fade-up">
            <blockquote className="font-display text-2xl font-medium italic leading-snug text-citizen-sand sm:text-3xl md:text-4xl">
              &ldquo;Every idle token is untapped potential.&rdquo;
            </blockquote>
            <p className="mt-4 text-citizen-text-muted">
              Millions of AI credits go unused every day. Agent Citizen turns them into
              real-world impact. Code that solves the problems
              humanity cares about most.
            </p>
          </div>

          {/* Stats, right */}
          <div className="scroll-fade-up grid grid-cols-2 gap-2 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-citizen-border bg-citizen-bg p-3 text-center sm:p-4"
              >
                <div className={`text-2xl font-bold ${stat.accent}`}>
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-citizen-text-dim">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
