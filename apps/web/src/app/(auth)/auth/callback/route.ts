import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const ip = getClientIp(request);
  const limit = await rateLimit(ip, "auth");
  if (!limit.success) {
    return NextResponse.redirect(`${origin}/login?error=rate_limited`);
  }

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
