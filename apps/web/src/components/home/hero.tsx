import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JumpInButton } from "@/components/home/jump-in-button";

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
            <JumpInButton />
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
            {/* Orbiting dot on middle ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-orbit">
                <div className="h-2.5 w-2.5 rounded-full bg-citizen-warm shadow-[0_0_8px_rgba(232,148,90,0.6)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
