import type { Database } from "@/app/lib/database.types";
import { createClient } from "./clients";

// 🔐 共通：ログイン中のユーザーを取得
const getCurrentUser = async (supabase: ReturnType<typeof createClient>) => {
  const result = await supabase.auth.getUser();
  
  if (result.error || !result.data.user) {
    console.error("ユーザー情報の取得に失敗");
    return null;
  }
  return result.data.user;
};

// ✅ 自分のTODOをすべて取得
export const getAllTodos = async () => {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return [];

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("TODO取得エラー:", error.message);
    return [];
  }

  return data;
};

// ✅ 自分のTODOを追加
export const addTodo = async (title: string) => {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return;

  const { error } = await supabase.from("todos").insert({
    title,
    user_id: user.id,
  });

  if (error) {
    console.error("TODO追加失敗:", error.message);
  }
};

// ✅ 自分のTODOを削除
export const deleteTodo = async (id: string) => {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return;

  const { error } = await supabase
    .from("todos")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("削除失敗:", error.message);
  }
};

// ✅ 自分のTODOを1件取得（編集画面用）
export const getTodoById = async (id: string) => {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return null;

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("取得失敗:", error.message);
    return null;
  }

  return data;
};

// ✅ 自分のTODOを更新（編集画面用）
export const updateTodo = async (id: string, title: string) => {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);
  if (!user) return;

  const { error } = await supabase
    .from("todos")
    .update({ title })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("更新失敗:", error.message);
  }
};
