"use client";

import React from "react";
import type { Database } from "@/app/lib/database.types";
import {
  deleteTodo,
  getAllTodos,
} from "../../../../utils/supabase/supabaseFunction";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoList = ({ todos, setTodos }: Props) => {
  const handleDelete = async (id: string) => {
    await deleteTodo(id);
    const updatedTodos = await getAllTodos();
    if (updatedTodos) setTodos(updatedTodos);
  };

  return (
    <div className="mt-4">
      {todos.length === 0 ? (
        <p className="text-center text-gray-500">まだTODOがありません。</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex justify-between items-center bg-orange-200 p-2 rounded-md mb-2"
            >
              <span>{todo.title}</span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-red-600 hover:underline"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
