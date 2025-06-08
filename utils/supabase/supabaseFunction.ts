import type { Database } from "@/app/lib/database.types";
import { createClient } from "./clients";

// 取得
export const getAllTodos = async () => {
  const supabase = await createClient<Database>();
  const todos = await supabase.from("todos").select("*");
  return todos.data;
};

// 追加
export const addTodo = async (title: string) => {
  const supabase = await createClient<Database>();
  await supabase.from("todos").insert({ title: title });
};

// 削除（idはstring型に修正）
export const deleteTodo = async (id: string) => {
  const supabase = await createClient<Database>();
  await supabase.from("todos").delete().eq("id", id);
};
