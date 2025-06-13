// Todo詳細のsupabaseからのデータ取得を担当

"use client";

import { useEffect, useState } from "react";
import TodoDetail from "./TodoDetail";

import type { Database } from "@/app/lib/database.types";
import { getTodoById } from "../../../../utils/supabase/supabaseTodoFunction";
import LoadingSpinner from "../loading/loading";
type Todo = Database["public"]["Tables"]["todos"]["Row"];

export default function TodoDetailClient({ id }: { id: string }) {
  const [todo, setTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodoById(id).then((res) => setTodo(res));
  }, [id]);

  if (!todo) return <LoadingSpinner />;
  return <TodoDetail todo={todo} />;
}
