// src/app/todos/[id]/edit/page.tsx

import EditTodoForm from "@/app/components/todo-edit/EditTodoForm";

type Props = {
  params: {
    id: string;
  };
};

export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4">
      <EditTodoForm id={params.id} />
    </div>
  );
}
