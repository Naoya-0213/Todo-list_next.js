import React, { useEffect, useState } from "react";
import {
  addTodo,
  getAllTodos,
} from "../../../../utils/supabase/supabaseTodoFunction";
import type { Database } from "@/app/lib/database.types";
import TodoList from "./TodoList";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export default function TodoForm() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("未着手");

  // タイトル・期限・詳細のsupabaseへ保存
  useEffect(() => {
    const getTodos = async () => {
      const todos = await getAllTodos();
      if (todos) setTodos(todos);
    };

    getTodos();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title === "") return;

    // タイトル・期限・詳細の追加
    await addTodo(title, dueDate, description, status);
    setTitle("");
    setDueDate("");
    setDescription("");

    const todos = await getAllTodos();
    if (todos) setTodos(todos);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 ">
          {/* ステータス */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-md w-auto py-2 px-3 focus:outline-none focus:border-sky-500 mb-3"
          >
            <option value="未着手">未着手</option>
            <option value="着手">着手</option>
            <option value="完了">完了</option>
          </select>
          {/* タイトル */}
          <input
            type="text"
            placeholder="TODOを入力"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500 mb-3"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>

        {/* 期限 */}
        <input
          type="date"
          className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500 mb-3"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="期限を入力"
        />

        {/* 詳細 */}
        <textarea
          placeholder="詳細を入力"
          className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500 mb-3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-center">
          <button
            className="font-bold bg-sky-500 hover:brightness-95 w-50 rounded-full p-2 text-white text-sm"
            type="submit"
          >
            追加
          </button>
        </div>
      </form>
      <TodoList todos={todos} setTodos={setTodos} />
    </div>
  );
}
