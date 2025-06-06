// ログインページ実装
// use client側の components/login の読み込み
// use server

import { redirect } from "next/navigation";
import { createClient } from "../../../../utils/supabase/clients";
import Signin from "@/app/components/signin/page";
import type { Database } from "@/app/lib/database.types";

// 認証状態の監視
export default async function signinPage() {
  const supabase = await createClient<Database>();

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 認証している場合、リダイレクト
  if (session) {
    redirect("/");
  }

  return <Signin />;
}
