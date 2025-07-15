"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../../utils/supabase/clients";
import LoadingSpinner from "../loading/loading";

// ログアウト
const Signout = () => {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 送信
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ログアウト
      const { error } = await supabase.auth.signOut();

      // エラーチェック
      if (error) {
        setMessage("エラーが発生しました。" + error.message);
        return;
      }

      router.push("/");
    } catch (error) {
      setMessage("エラーが発生しました。" + error);
      return;
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="flex justify-center pt-[10px]">
      <div className="w-2/3">
        <div className="text-center mb-5">ログアウトしますか？</div>
        {/* ログアウトボタン */}
        <form onSubmit={onSubmit}>
          <div className="mb-5">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <button
                type="submit"
                className="font-bold bg-red-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
              >
                ログアウト
              </button>
            )}
          </div>
        </form>

        {message && (
          <div className="my-5 text-center text-sm text-red-500">{message}</div>
        )}
      </div>
    </div>
  );
};

export default Signout;
