"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/app/lib/database.types";
import {
  getTodoById,
  updateTodo,
} from "../../../../utils/supabase/supabaseTodoFunction";
import LoadingSpinner from "../loading/loading";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

// Zodスキーマ
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
      if (!dateStr) return true;
      const today = new Date();
      const selected = new Date(dateStr);
      today.setHours(0, 0, 0, 0);
      selected.setHours(0, 0, 0, 0);
      return selected >= today;
    },
    { message: "期限は今日以降の日付を選択してください" }
  ),
  status: z.enum(["未完了", "途中", "完了"]),
});

type Schema = z.infer<typeof schema>;

export default function EditTodoForm({ id }: { id: string }) {
  const router = useRouter();
  const [todo, setTodo] = useState<Todo | null>(null);

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

  useEffect(() => {
    const fetchTodo = async () => {
      const todo = await getTodoById(id);
      if (todo) {
        setTodo(todo);
        reset({
          title: todo.title,
          description: todo.description ?? "",
          dueDate: todo.due_date?.split("T")[0] ?? "",
          status: ["未完了", "途中", "完了"].includes(todo.status ?? "")
            ? (todo.status as "未完了" | "途中" | "完了")
            : "未完了",
        });
      }
    };
    fetchTodo();
  }, [id, reset]);

  const onSubmit: SubmitHandler<Schema> = async (data) => {
    if (!todo) return;
    await updateTodo(
      todo.id,
      data.title,
      data.description,
      data.dueDate,
      data.status
    );
    router.push(`/todos/${todo.id}`);
  };

  if (!todo) return <LoadingSpinner />;

  return (
    <form
      className="flex flex-col gap-3 px-4 py-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-center font-bold text-xl mb-6">Todo Edit</h1>

      <div className="flex gap-3">
        <select
          {...register("status")}
          className="border rounded-lg px-4 py-3 flex-1"
        >
          <option value="未完了">未完了</option>
          <option value="途中">途中</option>
          <option value="完了">完了</option>
        </select>

        <div className="flex-3 w-full">
          <input
            type="text"
            placeholder="TODOを入力"
            {...register("title")}
            className="border rounded-lg px-4 py-3 w-full"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
      </div>

      <div>
        <input
          type="date"
          placeholder="年/月/日"
          {...register("dueDate")}
          className="border rounded-lg px-4 py-3 w-full"
        />
        {errors.dueDate && (
          <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
        )}
      </div>

      <div>
        <textarea
          placeholder="詳細を入力"
          {...register("description")}
          className="border rounded-lg px-4 py-3 w-full h-24 resize-none"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

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
