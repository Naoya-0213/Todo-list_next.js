import { createClient } from "../../utils/supabase/server";
import BeforeLogin from "./components/beforeLogin/beforeLogin";
import TodoApp from "./components/todos/TodoApp";
import type { Database } from "./lib/database.types";

// メインページ
export default async function Home() {
  const supabase = await createClient<Database>();

  // セッションに取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="text-center text-x1">
      {session ? <TodoApp /> : <BeforeLogin />}
    </div>
  );
}
