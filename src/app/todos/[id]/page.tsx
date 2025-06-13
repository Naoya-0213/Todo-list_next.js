// クライアントコンポーネントを使う

import TodoDetailClient from "@/app/components/todo-app/TodoDetailClient";

export default function TodoDetailPage({ params }: { params: { id: string } }) {
  return <TodoDetailClient id={params.id} />;
}
