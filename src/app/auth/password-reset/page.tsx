// パスワードリセット用
// use server

import { redirect } from "next/navigation";
import type { Database } from "@/app/lib/database.types";
import { createClient } from "../../../../utils/supabase/server";
import ResetPassword from "@/app/components/setting-password-reset/password-reset";

// パスワードリセットページ
const ResetPasswordPage = async () => {
  const supabase = await createClient<Database>();

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 認証している場合、リダイレクト
  if (session) {
    redirect("/");
  }

  return <ResetPassword />;
};

export default ResetPasswordPage;
