"use client";

import TodoForm from "../components/todo-app/TodoForm";

export default function TodoApp() {
  return (
    <div className="flex justify-center pt-[10px] max-w-5xl mx-auto ">
      <section className="w-100">
        <h1 className="text-center font-bold text-xl mb-10">
          Supabase Todo App
        </h1>
        <TodoForm />
      </section>
    </div>
  );
}
