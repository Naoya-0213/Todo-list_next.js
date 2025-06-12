"use client";

import React from "react";
import type { Database } from "@/app/lib/database.types";
import {
  deleteTodo,
  getAllTodos,
} from "../../../../utils/supabase/supabaseTodoFunction";

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
              className="flex flex-col gap-5 items-start border border-black p-4 rounded-md mb-4"
            >
              {/* タイトル */}
              <div className="flex flex-col">
                <p>{todo.status}</p>
                <h3 className="font-bold text-xl">{todo.title}</h3>
              </div>

              {/* 詳細ボタン */}
              <button className="font-bold bg-sky-500 hover:brightness-95 w-20 rounded-full p-2 text-white text-sm">
                詳細
              </button>
              <p>{todo.description}</p>

              <p>期限：{todo.due_date}</p>

              <div className="flex gap-3">
                {/* 編集ボタン */}
                <button
                  // onClick={() => handleDelete(todo.id)}
                  className="font-bold bg-sky-500 hover:brightness-95 w-20 rounded-full p-2 text-white text-sm"
                >
                  編集
                </button>

                {/* 削除ボタン */}
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="font-bold bg-sky-500 hover:brightness-95 w-20 rounded-full p-2 text-white text-sm"
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
