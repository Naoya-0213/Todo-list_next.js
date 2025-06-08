// import type { Database } from "@/app/lib/database.types";
// import { createClient } from "./clients";

// const supabase = await createClient<Database>();

// // 取得
// export const getAllTodos = async () => {
//   const todos = await supabase.from("Todos").select("*");
//   return todos.data;
// };

// // 追加
// export const addTodo = async (title: string) => {
//   await supabase.from("Todo_Next.js_Supabase").insert({ title: title });
// };

// // 削除
// export const deleteTodo = async (id: number) => {
//   await supabase.from("Todo_Next.js_Supabase").delete().eq("id", id);
// };
