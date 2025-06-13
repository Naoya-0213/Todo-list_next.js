import type { Database } from "@/app/lib/database.types";

type Todo = Database["public"]["Tables"]["todos"]["Row"];

export default function TodoDetail({ todo }: { todo: Todo }) {
  return (
    <div>
      <h2>{todo.title}</h2>
      <p>{todo.description}</p>
      {/* 他の詳細もここに表示可能 */}
    </div>
  );
}
