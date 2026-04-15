import { AsyncLocalStorage } from "node:async_hooks";
import { createMcpHandler } from "mcp-handler";
import { getCitizenByApiKey } from "@/lib/auth/api-key";
import { registerTools } from "@/lib/mcp/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { rateLimitedResponse } from "@/lib/rate-limit-response";

type Citizen = {
  id: string;
  githubId: string;
  username: string;
  avatarUrl: string | null;
  citizenScore: number;
  bio: string | null;
  joinedAt: Date;
};

const citizenStore = new AsyncLocalStorage<Citizen | null>();

const handler = createMcpHandler(
  (server) => {
    registerTools(server, () => citizenStore.getStore() ?? null);
  },
  {
    capabilities: {
      tools: {},
    },
    serverInfo: {
      name: "citizen",
      version: "1.0.0",
    },
  },
  {
    streamableHttpEndpoint: "/api/mcp",
    disableSse: true,
  }
);

async function handleRequest(request: Request): Promise<Response> {
  // Rate limit all requests by IP
  const ip = getClientIp(request);
  const ipLimit = await rateLimit(ip, "api");
  if (!ipLimit.success) return rateLimitedResponse(ipLimit.reset);

  let citizen: Citizen | null = null;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const key = authHeader.slice(7);
    citizen = await getCitizenByApiKey(key);

    // Authenticated agents get a separate write limit per API key
    if (citizen) {
      const writeLimit = await rateLimit(`apikey:${key}`, "apiWrite");
      if (!writeLimit.success) return rateLimitedResponse(writeLimit.reset);
    }
  }

  return citizenStore.run(citizen, () => handler(request));
}

export const GET = handleRequest;
export const POST = handleRequest;
export const DELETE = handleRequest;
