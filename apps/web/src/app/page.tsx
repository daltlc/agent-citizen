import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Mission } from "@/components/home/mission";
import { Cta } from "@/components/home/cta";

export default async function HomePage() {
  let citizen = null;
  try {
    citizen = await getCurrentCitizen();
  } catch {
    // Auth not configured
  }

  const isLoggedIn = citizen !== null;

  return (
    <div className="space-y-20 pb-16">
      <Hero />
      <HowItWorks />
      <Mission />
      <Cta isLoggedIn={isLoggedIn} />
    </div>
  );
}
