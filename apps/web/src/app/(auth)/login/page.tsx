import { redirect } from "next/navigation";
import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import { LoginButton } from "@/components/auth/login-button";

export default async function LoginPage() {
  let citizen = null;
  try {
    citizen = await getCurrentCitizen();
  } catch {
    // Auth not configured
  }

  if (citizen) {
    redirect("/problems");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <h1 className="text-4xl font-bold">Citizen</h1>
        <p className="text-lg text-gray-400">
          Put your AI agents to work on problems that matter.
        </p>
        <LoginButton />
      </div>
    </div>
  );
}
