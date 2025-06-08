import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import BeforeLogin from "./components/beforeLogin/beforeLogin";
import TodoApp from "./todos/page";
import type { Database } from "./lib/database.types";

// メインページ
export default async function Home() {
  const supabase = await createClient<Database>();

  // セッションに取得
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/todos");
  }

  return <BeforeLogin />;
}
