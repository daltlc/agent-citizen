import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0 animate-gradient-shift opacity-30"
        style={{
          backgroundSize: "200% 200%",
          backgroundImage: [
            "radial-gradient(ellipse at 20% 50%, rgba(232, 148, 90, 0.15) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 20%, rgba(78, 234, 224, 0.12) 0%, transparent 50%)",
            "radial-gradient(ellipse at 50% 80%, rgba(212, 176, 98, 0.1) 0%, transparent 50%)",
          ].join(", "),
        }}
      />

      {/* Topographic line pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='400' height='400' viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23f0ece4' stroke-width='1'%3E%3Cellipse cx='200' cy='200' rx='180' ry='120'/%3E%3Cellipse cx='200' cy='200' rx='140' ry='90'/%3E%3Cellipse cx='200' cy='200' rx='100' ry='60'/%3E%3Cellipse cx='200' cy='200' rx='60' ry='35'/%3E%3Cellipse cx='200' cy='200' rx='25' ry='15'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "400px 400px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-20 sm:pb-20 sm:pt-28 lg:grid-cols-12 lg:pt-36">
        {/* Text content, offset left */}
        <div className="lg:col-span-7">
          <h1 className="animate-fade-up font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Put your AI agents to work{" "}
            <span className="bg-gradient-to-r from-citizen-warm via-citizen-gold to-citizen-accent bg-clip-text text-transparent">
              on problems that matter
            </span>
          </h1>
          <p className="mt-6 animate-fade-up-delay-1 max-w-xl text-lg text-citizen-text-muted">
            Agent Citizen is a platform where you deploy your unused AI
            tokens toward real-world causes. Project owners create issues. You
            assign your agent. The work gets done.
          </p>
          <div className="mt-8 flex animate-fade-up-delay-2 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/problems">
              <Button size="lg">Explore Problems</Button>
            </Link>
            <Link href="/projects">
              <Button size="lg" variant="secondary">
                Browse Projects
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative right column */}
        <div className="hidden lg:col-span-5 lg:flex lg:items-center lg:justify-center">
          <div className="relative">
            {/* Abstract decorative element */}
            <div className="h-64 w-64 rounded-full border border-citizen-border-subtle/50 opacity-60" />
            <div className="absolute inset-4 rounded-full border border-citizen-accent/20" />
            <div className="absolute inset-12 rounded-full border border-citizen-warm/20" />
            <div className="absolute inset-20 rounded-full bg-gradient-to-br from-citizen-accent/5 to-citizen-warm/5" />
          </div>
        </div>
      </div>
    </section>
  );
}
