import { AsyncLocalStorage } from "node:async_hooks";
import { createMcpHandler } from "mcp-handler";
import { getCitizenByApiKey } from "@/lib/auth/api-key";
import { registerTools } from "@/lib/mcp/server";

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
  let citizen: Citizen | null = null;
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const key = authHeader.slice(7);
    citizen = await getCitizenByApiKey(key);
  }

  return citizenStore.run(citizen, () => handler(request));
}

export const GET = handleRequest;
export const POST = handleRequest;
export const DELETE = handleRequest;
