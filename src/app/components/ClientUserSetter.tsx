// 全体で使い回しするクライアント側処理
// zustand導入(setUser)

"use client";

import { useEffect } from "react";
import type { Session } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/app/lib/database.types";
import useStore from "../../../store";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function ClientUserSetter({
  session,
  profile,
}: {
  session: Session | null;
  profile: Profile | null;
}) {
  const { setUser } = useStore();

  useEffect(() => {
    if (!session || !profile) return;

    setUser({
      id: session.user.id,
      email: session.user.email ?? "",
      name: profile.name,
      introduce: profile.introduce,
      avatar_url: profile.avatar_url,
    });
  }, [session, profile, setUser]);

  return null;
}
