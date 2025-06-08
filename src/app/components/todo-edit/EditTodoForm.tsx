// src/app/components/EditTodoForm.tsx

"use client";

import { useEffect, useState } from "react";

import type { Database } from "@/app/lib/database.types";
import { useRouter } from "next/navigation";
import {
  getTodoById,
  updateTodo,
} from "../../../../utils/supabase/supabaseFunction";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export default function EditTodoForm({ id }: { id: string }) {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTodo = async () => {
      const result = await getTodoById(id);
      if (result) {
        setTodo(result);
        setTitle(result.title);
      }
    };
    fetchTodo();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await updateTodo(id, title);
    router.push("/todos"); // 完了後に戻す
  };

  if (!todo) return <p>読み込み中...</p>;

  return (
    <form onSubmit={handleUpdate}>
      <h2 className="text-lg font-bold mb-4">TODOの編集</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        更新
      </button>
    </form>
  );
}
