import React, { useEffect, useState } from "react";
import {
  addTodo,
  getAllTodos,
} from "../../../../utils/supabase/supabaseTodoFunction";
import type { Database } from "@/app/lib/database.types";
import TodoList from "./TodoList";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
type Schema = z.infer<typeof schema>;
type Todo = Database["public"]["Tables"]["todos"]["Row"];

// 入力データの検証ルールを定義（Zod）
const schema = z.object({
  title: z
    .string()
    .min(2, { message: "2文字以上入力する必要があります。" })
    .max(50, { message: "タイトルは50字以内で入力してください。" }),
  description: z
    .string()
    .max(100, { message: "詳細は100字以内で入力してください。" }),
  dueDate: z.string().refine(
    (dateStr) => {
      if (!dateStr) return true; // 未入力は許可
      const today = new Date();
      const selected = new Date(dateStr);
      // 今日の0:00と比較（時刻の誤差を避ける）
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      return selected >= today;
    },
    {
      message: "期限は今日以降の日付を選択してください",
    }
  ),
  status: z.enum(["未完了", "途中", "完了"]),
});

export default function TodoForm() {
  const [todos, setTodos] = useState<Todo[]>([]);

  // React hook form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      status: "未完了",
    },
  });

  // タイトル・期限・詳細のsupabaseへ保存
  useEffect(() => {
    const getTodos = async () => {
      const todos = await getAllTodos();
      if (todos) setTodos(todos);
    };

    getTodos();
  }, []);

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    await addTodo(data.title, data.dueDate, data.description, data.status);
    reset();
    const todos = await getAllTodos();
    if (todos) setTodos(todos);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-3 ">
          {/* ステータス */}
          <select
            {...register("status")}
            className="border rounded-md w-auto py-2 px-3 focus:outline-none focus:border-sky-500 mb-3"
          >
            <option value="未完了">未完了</option>
            <option value="途中">途中</option>
            <option value="完了">完了</option>
          </select>
          {/* タイトル */}
          <input
            {...register("title")}
            type="text"
            placeholder="TODOを入力"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500 mb-3"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* 期限 */}
        <input
          {...register("dueDate")}
          type="date"
          className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500 mb-3"
          placeholder="期限を入力"
        />
        {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}

        {/* 詳細 */}
        <textarea
          {...register("description")}
          placeholder="詳細を入力"
          className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500 mb-3"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

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
