"use server";

import { getCurrentCitizen } from "@/lib/auth/get-citizen";
import {
  createApiKey,
  deleteApiKey,
  getApiKeysByCitizenId,
} from "@/lib/auth/api-key";
import { rateLimitAction } from "@/lib/rate-limit";
import { z } from "zod";

const createKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name too long"),
});

export async function createApiKeyAction(
  _prev: unknown,
  formData: FormData
) {
  const citizen = await getCurrentCitizen();
  if (!citizen) return { error: "Not authenticated", key: null };

  const limited = await rateLimitAction(citizen.id);
  if (limited) return { error: limited, key: null };

  const parsed = createKeySchema.safeParse({
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, key: null };
  }

  const result = await createApiKey(citizen.id, parsed.data.name);
  return { error: null, key: result.key };
}

export async function deleteApiKeyAction(
  _prev: unknown,
  formData: FormData
) {
  const citizen = await getCurrentCitizen();
  if (!citizen) return { error: "Not authenticated" };

  const limited = await rateLimitAction(citizen.id);
  if (limited) return { error: limited };

  const keyId = formData.get("keyId") as string;
  if (!keyId) return { error: "Missing key ID" };

  const deleted = await deleteApiKey(keyId, citizen.id);
  if (!deleted) return { error: "Key not found or not yours" };

  return { error: null };
}

export async function listApiKeysAction() {
  const citizen = await getCurrentCitizen();
  if (!citizen) return [];

  return getApiKeysByCitizenId(citizen.id);
}
