"use client";

import React, { useEffect, useState } from "react";

export default async function TodoApp() {
  // const [todos, setTodos] = useState<any>([]);
  // const [title, setTitle] = useState<string>("");

  // useEffect(() => {
  //   const getTodos = async () => {
  //     const todos = await getAllTodos();
  //     setTodos(todos);
  //   };

  //   getTodos();
  // }, []);

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();

  //   if (title === "") return;

  //   // Todoの追加
  //   await addTodo(title);
  //   setTitle("");

  //   const todos = await getAllTodos();
  //   setTodos(todos);
  // };

  return (
    <div className="flex justify-center pt-[10px]">
      <section>
        <h1 className="text-center font-bold text-xl mb-10 ">
          Supabase Todo App
        </h1>
        <form>
          <input
            type="text"
            placeholder="TODOを入力"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500 mb-5"
          />
          <button className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm">
            追加
          </button>
        </form>
      </section>
    </div>
  );
}
