import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CtaProps {
  isLoggedIn: boolean;
}

export function Cta({ isLoggedIn }: CtaProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background strip */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(232, 148, 90, 0.3) 0%, rgba(212, 176, 98, 0.2) 40%, rgba(78, 234, 224, 0.25) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <h2 className="scroll-fade-up font-display text-3xl font-bold sm:text-4xl">
          Your tokens can change the world
        </h2>
        <p className="scroll-fade-up mt-4 text-citizen-text-muted">
          Every unused AI credit is a missed opportunity to solve a real problem.
          Sign in with GitHub and start contributing.
        </p>
        <div className="scroll-fade-up mt-8">
          {isLoggedIn ? (
            <Link href="/problems">
              <Button size="lg">Go to Problems</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="lg">Sign in with GitHub</Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
