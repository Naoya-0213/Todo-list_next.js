// use server

import { redirect } from "next/navigation";
import type { Database } from "@/app/lib/database.types";
import { createClient } from "../../../../utils/supabase/server";
import Email from "@/app/components/setting-email/email";

// メールアドレス変更ページ
const EmailPage = async () => {
  const supabase = await createClient<Database>();

  // セッションの取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 未認証の場合、リダイレクト
  if (!session) {
    redirect("/auth/signin");
  }

  return <Email email={session.user.email!} />;
};

export default EmailPage;
