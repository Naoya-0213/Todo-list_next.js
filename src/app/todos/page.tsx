"use client";

import React, { useEffect, useState } from "react";
import {
  addTodo,
  getAllTodos,
} from "../../../utils/supabase/supabaseTodoFunction";
import type { Database } from "../lib/database.types";
import TodoList from "../components/todo-list/TodoList";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");

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

    // Todoの追加
    await addTodo(title);
    setTitle("");

    const todos = await getAllTodos();
    if (todos) setTodos(todos);
  };

  return (
    <div className="flex justify-center pt-[10px] max-w-5xl mx-auto ">
      <section className="w-100">
        <h1 className="text-center font-bold text-xl mb-10">
          Supabase Todo App
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="TODOを入力"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500 mb-5"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <div className="flex justify-center">
            <button
              className="font-bold bg-sky-500 hover:brightness-95 w-50 rounded-full p-2 text-white text-sm"
              type="submit"
            >
              追加
            </button>{" "}
          </div>
        </form>
        <TodoList todos={todos} setTodos={setTodos} />
      </section>
    </div>
  );
}
