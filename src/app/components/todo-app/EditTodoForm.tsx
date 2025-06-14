"use client";

import { useEffect, useState } from "react";
import type { Database } from "@/app/lib/database.types";
import { useRouter } from "next/navigation";
import {
  getTodoById,
  updateTodo,
} from "../../../../utils/supabase/supabaseTodoFunction";
import LoadingSpinner from "../loading/loading";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export default function EditTodoForm({ id }: { id: string }) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [status, setStatus] = useState<string>("未完了");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchTodo = async () => {
      const todo = await getTodoById(id);
      if (todo) {
        setTodo(todo);
        setStatus(todo.status ?? "未完了");
        setTitle(todo.title);
        setDescription(todo.description ?? "");
        setDueDate(todo.due_date ? todo.due_date.split("T")[0] : "");
      }
    };

    fetchTodo();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo) return;

    await updateTodo(todo.id, title, description, dueDate, status);
    router.push(`/todos/${todo.id}`);
  };

  if (!todo) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-4 py-6">
      <h1 className="text-center font-bold text-xl mb-6">Todo Edit</h1>

      <div className="flex gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-4 py-3 text-gray-500 flex-1"
        >
          <option value="未完了">未完了</option>
          <option value="着手">着手</option>
          <option value="完了">完了</option>
        </select>

        <input
          type="text"
          placeholder="TODOを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-lg px-4 py-3 text-gray-500 flex-3"
        />
      </div>

      <input
        type="date"
        placeholder="年/月/日"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border rounded-lg px-4 py-3 text-gray-500"
      />

      <textarea
        placeholder="詳細を入力"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded-lg px-4 py-3 text-gray-500 h-24 resize-none"
      />

      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-sky-500 text-white font-bold rounded-full py-3 px-10"
        >
          保存
        </button>
      </div>
    </form>
  );
}
