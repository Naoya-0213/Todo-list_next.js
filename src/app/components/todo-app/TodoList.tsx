"use client";

import React, { useState } from "react";
import type { Database } from "@/app/lib/database.types";
import {
  deleteTodo,
  getAllTodos,
  updateTodoStatus,
} from "../../../../utils/supabase/supabaseTodoFunction";
import { useRouter } from "next/navigation";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

// 型定義
type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoList = ({ todos, setTodos }: Props) => {
  // ページ遷移設定
  const router = useRouter();

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
              <div className="flex flex-col gap-3 justify-center">
                {/* ステータス */}
                <select
                  value={todo.status ?? "未着手"}
                  onChange={(e) => {
                    const newStatus = e.target.value;

                    // ローカル状態だけ更新（即時UIに反映）
                    setTodos((prevTodos) =>
                      prevTodos.map((t) =>
                        t.id === todo.id ? { ...t, status: newStatus } : t
                      )
                    );

                    // Supabaseにも保存（非同期）
                    updateTodoStatus(todo.id, newStatus);
                  }}
                  className="border rounded-md p-2 w-22"
                >
                  <option value="未着手">未完了</option>
                  <option value="着手">途中</option>
                  <option value="完了">完了</option>
                </select>
                {/* タイトル */}
                <h3 className="font-bold text-xl">{todo.title}</h3>
              </div>

              {/* 期限 */}
              <div className="flex gap-3">
                <label htmlFor="due_date" className="font-bold">
                  期限
                </label>
                <p id="due_date">{todo.due_date}</p>
              </div>

              <div className="flex gap-3">
                {/* 詳細ボタン */}
                <button
                  onClick={() => router.push(`/todos/${todo.id}`)}
                  className="font-bold bg-sky-500 hover:brightness-95 w-20 rounded-full p-2 text-white text-sm"
                >
                  詳細
                </button>
                <span>
                  {openDescriptionId === todo.id && <p>{todo.description}</p>}
                </span>

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
