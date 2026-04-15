import { NextResponse } from "next/server";

/**
 * Returns a 429 Too Many Requests response with Retry-After header.
 */
export function rateLimitedResponse(reset: number): NextResponse {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);

  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: { "Retry-After": String(Math.max(retryAfter, 1)) },
    }
  );
}
