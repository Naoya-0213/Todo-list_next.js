// １）supabaseからの情報取得用、ナビゲーションに渡す
// ２）全体layout.tsxで表示。

"use server";

import { createClient } from "../../../utils/supabase/server";
import type { Database } from "../lib/database.types";
import { Navigation } from "./navigation/navigation";

// 認証状態の監視
export const SupabaseLisner = async () => {
  const supabase = await createClient<Database>();

  // セッションに取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // プロフィールの取得
  let profile = null;
  if (session) {
    const { data: currentProfile } = await supabase
      .from("profiles") // テーブル指定
      .select("*") // すべてのカラムを取得
      .eq("id", session.user.id) // 条件：idが一致
      .single(); // 結果は1件だけ期待

    profile = currentProfile;

    // メールアドレスを変更した場合、プロフィールを更新
    if (currentProfile && currentProfile.email !== session.user.email) {
      const { data: updatedProfile } = await supabase
        .from("profiles")
        .update({ email: session.user.email }) // 新しいメアドに更新
        .match({ id: session.user.id }) // このidが対象
        .select("*")
        .single();

      profile = updatedProfile;
    }
  }

  return <Navigation session={session} profile={profile} />;
};
