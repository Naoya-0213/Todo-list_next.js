import React from "react";
import {
  deleteTodo,
  getAllTodos,
} from "../../../../../utils/supabase/supabaseFunction";

import type { Database } from "@/app/lib/database.types";
type Todo = Database["public"]["Tables"]["todos"]["Row"];

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoList = (props: Props) => {
  const { todos, setTodos } = props;

  // 削除
  const handleDelete = async (id: string) => {
    await deleteTodo(id);

    const todos = await getAllTodos();
    if (todos) setTodos(todos);
  };

  return (
    <div>
      <ul className="mx-auto">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex bg-orange-200 rounded-md mt-2 p-2 justify-between"
          >
            <li className="font-medium">✅　{todo.title}</li>
            <span
              className="cursor-pointer"
              onClick={() => handleDelete(todo.id)}
            >
              ✖︎
            </span>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
