// サインインページのサーバー側の処理
// use server

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../../utils/supabase/server";
import type { Database } from "@/app/lib/database.types";

// サインイン
export async function signin(formData: FormData) {
  const supabase = await createClient<Database>();

  // 便宜上、ここでは型アサーション（型キャスト）を使っています
  // 実際には、入力値を検証（バリデーション）すべきです
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// サインアップ
export async function signup(formData: FormData) {
  const supabase = await createClient();

  // 便宜上、ここでは型アサーション（型キャスト）を使っています
  // 実際には、入力値を検証（バリデーション）すべきです
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
