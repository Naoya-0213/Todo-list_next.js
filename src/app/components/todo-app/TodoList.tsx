"use client";

import React, { useState } from "react";
import type { Database } from "@/app/lib/database.types";
import {
  deleteTodo,
  getAllTodos,
  updateTodoStatus,
} from "../../../../utils/supabase/supabaseTodoFunction";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoList = ({ todos, setTodos }: Props) => {
  // 詳細クリック表示
  const [openDescriptionId, setOpenDescriptionId] = useState<string | null>(
    null
  );

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
              className="flex flex-col gap-3 items-start border border-black p-4 rounded-md mb-3"
            >
              {/* タイトル */}
              <div className="flex gap-3 justify-center items-center">
                {/* ステータス */}
                <select
                  value={todo.status ?? "未着手"}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    if (newStatus !== todo.status) {
                      await updateTodoStatus(todo.id, newStatus); // supabaseへ保存
                      const updatedTodos = await getAllTodos();
                      if (updatedTodos) setTodos(updatedTodos);
                    }
                  }}
                  className="border rounded-md p-2"
                >
                  <option value="未着手">未着手</option>
                  <option value="着手">着手</option>
                  <option value="完了">完了</option>
                </select>
                <h3 className="font-bold text-xl">{todo.title}</h3>
              </div>

              {/* 詳細ボタン */}
              <button
                onClick={() =>
                  setOpenDescriptionId(
                    openDescriptionId === todo.id ? null : todo.id
                  )
                }
                className="font-bold bg-sky-500 hover:brightness-95 w-20 rounded-full p-2 text-white text-sm"
              >
                {openDescriptionId === todo.id ? "閉じる" : "詳細"}
              </button>
              <span>
                {openDescriptionId === todo.id && <p>{todo.description}</p>}
              </span>

              <div className="flex gap-3">
                <label htmlFor="due_date" className="font-bold">
                  期限
                </label>
                <p id="due_date">{todo.due_date}</p>
              </div>

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
