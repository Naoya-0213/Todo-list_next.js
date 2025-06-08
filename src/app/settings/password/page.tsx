// use server

import { redirect } from "next/navigation";
import type { Database } from "@/app/lib/database.types";
import { createClient } from "../../../../utils/supabase/server";
import Password from "@/app/components/setting-password/password";

// パスワード変更ページ
const PasswordPage = async () => {
  const supabase = await createClient<Database>();

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 未認証の場合、リダイレクト
  if (!session) {
    redirect("/auth/signin");
  }

  return <Password />;
};

export default PasswordPage;
