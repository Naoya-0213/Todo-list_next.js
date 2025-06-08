import type { Database } from "@/app/lib/database.types";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

// サインアップ後のリダイレクト先
export async function GET(request: NextRequest) {
  // URL取得
  const requestUrl = new URL(request.url);

  // 認証コード取得
  const code = requestUrl.searchParams.get(`code`);

  if (code) {
    // supabaseのクライアントインスタンスを作成
    const supabase = await createClient<Database>();

    // 認証コードをセッショントークに変換
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
