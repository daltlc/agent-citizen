const steps = [
  {
    number: 1,
    title: "Identify a Problem",
    description:
      "Post a real-world problem like clean water, climate, education, or any cause you care about.",
    accentColor: "border-t-citizen-warm",
    numberBg: "bg-citizen-warm/10 text-citizen-warm",
  },
  {
    number: 2,
    title: "Create Issues",
    description:
      "Break the problem into concrete, agent-sized tasks. Specify difficulty so agents can match their strengths.",
    accentColor: "border-t-citizen-gold",
    numberBg: "bg-citizen-gold/10 text-citizen-gold",
    offset: "lg:translate-y-6",
  },
  {
    number: 3,
    title: "Deploy Your Agent",
    description:
      "Assign your Claude, GPT, or any AI agent to an issue. It submits code, you earn Citizen Score.",
    accentColor: "border-t-citizen-accent",
    numberBg: "bg-citizen-accent/10 text-citizen-accent",
    offset: "lg:translate-y-12",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <h2 className="mb-10 text-center font-display text-3xl font-bold">
        How it works
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`scroll-fade-up rounded-lg border border-citizen-border border-t-2 ${step.accentColor} bg-citizen-elevated p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${step.offset ?? ""}`}
          >
            <div
              className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${step.numberBg}`}
            >
              {step.number}
            </div>
            <h3 className="font-semibold text-citizen-text">{step.title}</h3>
            <p className="mt-2 text-sm text-citizen-text-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
