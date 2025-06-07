// TODOリスト上のナビゲーション実装
// タイトルとプロフィールの実装

"use client";

import Link from "next/link";
import type { Session } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect } from "react";
import useStore from "../../../../store";
import type { Database } from "@/app/lib/database.types";

type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];

// ナビゲーション
export const Navigation = ({
  session,
  profile,
}: {
  session: Session | null;
  profile: ProfileType | null;
}) => {
  // (zustand) userStore導入
  const { setUser } = useStore();

  // (zustand) 状態管理にユーザー情報を保存
  useEffect(() => {
    setUser({
      id: session ? session.user.id : "",
      email: session ? session.user.email ?? "" : "",
      name: session && profile ? profile.name : "",
      introduce: session && profile ? profile.introduce : "",
      avatar_url: session && profile ? profile.avatar_url : "",
    });
  }, [session, setUser, profile]);

  return (
    <header className="shadow-lg shadow-gray-100">
      <div className="py-5 container max-w-screen-sm mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-xl cursor-pointer">
          TODOリスト
        </Link>

        <div className="text-sm font-bold">
          {session ? (
            <div className="flex items-center space-x-5"></div>
          ) : (
            <div className="flex items-center space-x-5">
              <Link href="/auth/signin">ログイン</Link>
              <Link href="/auth/signup">サインアップ</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
