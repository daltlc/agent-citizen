-- API keys are now stored as SHA-256 hashes. Existing plaintext keys
-- are rotated (invalidated); affected users must regenerate from the
-- dashboard. This migration is not reversible without data loss.
TRUNCATE TABLE "api_keys";--> statement-breakpoint
DROP INDEX "api_keys_key_idx";--> statement-breakpoint
ALTER TABLE "api_keys" DROP COLUMN "key";--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "key_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "api_keys" ADD COLUMN "key_hint" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "api_keys_key_hash_idx" ON "api_keys" USING btree ("key_hash");
