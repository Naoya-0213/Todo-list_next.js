// サインインページのクライアント側の処理
"use client";

// import { signin, signup } from "./action";
import ErrorPage from "../../error/page";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Database } from "@/app/lib/database.types";
import { createClient } from "../../../../utils/supabase/clients";
import LoadingSpinner from "../loading/loading";

// dataの型定義
type FormData = {
  email: string;
  password: string;
};

// zodの指定 入力データの検証およびバリデーション
const schema = z.object({
  email: z.string().email({ message: "メールアドレスの形式ではありません" }),
  password: z.string().min(6, { message: "6文字以上入力する必要があります" }),
});

// サインインページ
export default function Signin() {
  const router = useRouter();

  // supabase連携（別ページにて連携済み）
  const supabase = createClient<Database>();

  // 処理中のローディング
  const [loading, setLoading] = useState(false);

  // エラーメッセージ表示用
  const [message, setMessage] = useState("");

  // react-hook-form連携
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: { email: "", password: "" },
    // バリデーション（zod連携）
    resolver: zodResolver(schema),
  });

  // クリック送信
  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      // react-hook-formで受け取ったdata(email,password)をsupabaseへ渡す
      // error は supabase側からのエラー情報（messageがついてくるため、それを下記で表示）
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // エラーチェック
      if (error) {
        setMessage(`ログインに失敗しました:${error.message}`);
        return;
      }
    } catch (error) {
      setMessage("エラーが発生しました");
      return;
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="max-w-[400px] mx-auto">
      <div className="text-center font-bold text-xl mb-10">ログイン</div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* メールアドレス */}
        <div className="mb-3">
          <input
            type="email"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="メールアドレス"
            id="email"
            {...register("email", { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">
            {errors.email?.message}
          </div>
        </div>

        {/* パスワード */}
        <div className="mb-3">
          <input
            type="password"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="パスワード"
            id="password"
            {...register("password", { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">
            {errors.password?.message}
          </div>
        </div>

        {/* ログインボタン */}
        <div className="mb-5">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white"
            >
              ログイン
            </button>
          )}
        </div>
      </form>

      {/* ログインできなかった時のエラー表示 */}
      {message && (
        <div className="y-5 text-center text-sm text-red-500">{message}</div>
      )}

      {/* パスワード忘れた時の挙動 */}
      {/* <div className="text-center text-sm mb-5">
        <Link href="/auth/reset-password" className="text-gray-500 font-bold">
          パスワードを忘れた方はこちら
        </Link>
      </div> */}

      {/* サインアップ用のリンク */}
      {/* <div className="text-center text-sm mb-5">
        <Link href="/auth/signup" className="text-gray-500 font-bold">
          アカウントを作成する
        </Link>
      </div> */}
    </div>
  );
}
