// Todo詳細のUI部分
// user server

import type { Database } from "@/app/lib/database.types";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export default function TodoDetail({ todo }: { todo: Todo }) {
  return (
    <div className="pt-[10px]">
      {/* タイトル */}
      <h1 className="text-center font-bold text-xl mb-10">Detail Todo</h1>

      {/* 詳細表示 */}
      <section className="border rounded-lg p-6 shadow-md bg-white max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4  text-gray-800">{todo.title}</h2>
        <div className="mb-3">
          <span className="font-semibold text-gray-600">ステータス：</span>
          <span className="text-gray-800">{todo.status ?? "未設定"}</span>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-gray-600">期限：</span>
          <span className="text-gray-800">{todo.due_date ?? "未設定"}</span>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-gray-600">詳細：</span>
          <p className="text-gray-800 whitespace-pre-line">
            {todo.description || "（詳細なし）"}
          </p>
        </div>

        <div className="flex gap-3">
          {/* 編集ボタン */}
          <button className="font-bold bg-sky-500 hover:brightness-95 w-20 rounded-full p-2 text-white text-sm">
            編集
          </button>

          {/* 削除ボタン */}
          <button className="font-bold bg-sky-500 hover:brightness-95 w-20 rounded-full p-2 text-white text-sm">
            戻る
          </button>
        </div>
      </section>
    </div>
  );
}
