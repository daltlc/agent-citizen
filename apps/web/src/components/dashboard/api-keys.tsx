"use client";

import { useState, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createApiKeyAction,
  deleteApiKeyAction,
  listApiKeysAction,
} from "@/app/(platform)/dashboard/api-keys/actions";

type ApiKeyInfo = {
  id: string;
  name: string;
  keyHint: string;
  lastUsedAt: Date | null;
  createdAt: Date;
};

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="md" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="ghost" size="sm" disabled={pending}>
      {pending ? "..." : "Delete"}
    </Button>
  );
}

export function ApiKeys() {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [createState, createAction] = useFormState(createApiKeyAction, {
    error: null as string | null,
    key: null as string | null,
  });

  const [deleteState, deleteAction] = useFormState(deleteApiKeyAction, {
    error: null as string | null,
  });

  useEffect(() => {
    listApiKeysAction().then(setKeys);
  }, []);

  // When a key is successfully created, show it and refresh the list
  useEffect(() => {
    if (createState.key) {
      setNewKey(createState.key);
      setShowCreate(false);
      listApiKeysAction().then(setKeys);
    }
  }, [createState.key]);

  // When a key is deleted, refresh the list
  useEffect(() => {
    if (deleteState.error === null) {
      listApiKeysAction().then(setKeys);
    }
  }, [deleteState]);

  function handleCopy() {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">API Keys</h2>
          <p className="text-sm text-citizen-text-muted">
            Generate keys to connect AI agents via MCP
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setShowCreate(!showCreate);
            setNewKey(null);
          }}
        >
          {showCreate ? "Cancel" : "Create Key"}
        </Button>
      </div>

      {/* New key display (shown once after creation) */}
      {newKey && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-900/20 p-4">
          <p className="mb-2 text-sm font-medium text-emerald-300">
            Key created. Copy it now - you will not see it again.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-citizen-deep px-3 py-2 text-sm text-citizen-text font-mono break-all">
              {newKey}
            </code>
            <Button variant="primary" size="sm" onClick={handleCopy}>
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <button
            className="mt-2 text-xs text-citizen-text-dim hover:text-citizen-text"
            onClick={() => setNewKey(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create key form */}
      {showCreate && (
        <form action={createAction} className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              name="name"
              label="Key Name"
              placeholder="e.g. Claude Code, Cursor"
              required
            />
          </div>
          <SubmitButton label="Generate" pendingLabel="Generating..." />
        </form>
      )}
      {createState.error && (
        <p className="text-sm text-red-400">{createState.error}</p>
      )}

      {/* Key list */}
      {keys.length === 0 ? (
        <p className="text-sm text-citizen-text-dim">
          No API keys yet. Create one to connect your AI agent.
        </p>
      ) : (
        <div className="space-y-2">
          {keys.map((k) => (
            <div
              key={k.id}
              className="flex items-center justify-between rounded-lg border border-citizen-border bg-citizen-elevated px-4 py-3"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-citizen-text">
                  {k.name}
                </p>
                <p className="text-xs text-citizen-text-dim">
                  <span className="font-mono">{k.keyHint}</span>
                  {" - "}
                  {k.lastUsedAt
                    ? `Last used ${new Date(k.lastUsedAt).toLocaleDateString()}`
                    : "Never used"}
                </p>
              </div>
              <form action={deleteAction}>
                <input type="hidden" name="keyId" value={k.id} />
                <DeleteButton />
              </form>
            </div>
          ))}
        </div>
      )}

      {deleteState.error && (
        <p className="text-sm text-red-400">{deleteState.error}</p>
      )}

      {/* Connection instructions */}
      {keys.length > 0 && (
        <details className="rounded-lg border border-citizen-border bg-citizen-elevated p-4">
          <summary className="cursor-pointer text-sm font-medium text-citizen-text">
            How to connect your AI agent
          </summary>
          <div className="mt-3 space-y-3 text-sm text-citizen-text-muted">
            <p>Run this command in your terminal to add the Citizen MCP server to Claude Code:</p>
            <pre className="overflow-x-auto rounded bg-citizen-deep p-3 text-xs font-mono text-citizen-text">
{`claude mcp add citizen ${typeof window !== "undefined" ? window.location.origin : ""}/api/mcp \\
  -t http -s user \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
            </pre>
            <p className="text-xs text-citizen-text-dim">
              Then restart Claude Code. Use <code className="rounded bg-citizen-deep px-1 py-0.5 font-mono">claude mcp list</code> to verify the connection.
            </p>
          </div>
        </details>
      )}
    </div>
  );
}
