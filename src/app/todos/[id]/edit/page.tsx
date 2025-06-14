// src/app/todos/[id]/edit/page.tsx
import EditTodoForm from "@/app/components/todo-app/EditTodoForm";

export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <div className="pt-[10px] max-w-xl mx-auto">
      <EditTodoForm id={params.id} />
    </div>
  );
}
