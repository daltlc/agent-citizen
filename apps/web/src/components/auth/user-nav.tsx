"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserNavProps {
  username: string;
  avatarUrl: string | null;
}

export function UserNav({ username, avatarUrl }: UserNavProps) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <a
        href={`/u/${username}`}
        className="flex items-center gap-2 text-sm text-citizen-sand hover:text-citizen-text"
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={username}
            width={28}
            height={28}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-citizen-border-subtle text-xs font-medium">
            {username[0]?.toUpperCase()}
          </div>
        )}
        {username}
      </a>
      <button
        onClick={handleSignOut}
        className="text-sm text-citizen-text-dim hover:text-citizen-sand"
      >
        Sign out
      </button>
    </div>
  );
}
