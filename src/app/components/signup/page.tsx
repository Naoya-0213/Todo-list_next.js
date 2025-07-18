"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import * as z from "zod";
import type { Database } from "@/app/lib/database.types";
import LoadingSpinner from "../loading/loading";

type Schema = z.infer<typeof schema>;

// 入力データの検証ルールを定義
const schema = z.object({
  name: z.string().min(2, { message: "2文字以上入力する必要があります。" }),
  email: z.string().email({ message: "メールアドレスの形式ではありません。" }),
  password: z.string().min(6, { message: "6文字以上入力する必要があります。" }),
});

// サインアップページ
const Signup = () => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // react-hook-form連携
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    // 初期値
    defaultValues: { name: "", email: "", password: "" },
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);

    try {
      // サインアップ
      const { error: errorSignUp } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      //  エラーチェック
      if (errorSignUp) {
        setMessage("エラーが発生しました" + errorSignUp.message);
        return;
      }

      // プロフィールの名前の更新
      // const { error: updateError } = await supabase
      //   .from(`profiles`)
      //   .update({ name: data.name })
      //   .eq("email", data.email);

      // // エラーチェック
      // if (updateError) {
      //   setMessage("エラーが発生しました。" + updateError.message);
      //   return;
      // }

      // 入力フォームクリア
      reset();
      setMessage(
        "本登録用のURLを記載したメールを送信しました。メールをご確認の上、メール本文中のURLをクリックして、本登録を行ってください。"
      );
    } catch (error) {
      setMessage("エラーが発生しました");
      return;
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="max-w-[400px] mx-auto pt-[10px]">
      <div className="text-center font-bold text-xl mb-10">サインアップ</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 名前 */}
        <div className="mb-3">
          <input
            type="text"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="名前"
            id="name"
            {...register("name", { required: true })}
          />
          <div className="my-3 text-center text-sm text-red-500">
            {errors.name?.message}
          </div>
        </div>

        {/* メールアドレス */}
        <div className="mb-3">
          <input
            type="text"
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

        {/* サインアップボタン */}
        <div className="mb-5 ">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white"
            >
              サインアップ
            </button>
          )}
        </div>
      </form>

      {/* ログインできなかったための表示 */}
      {message && (
        <div className="my-5 text-center text-sm text-red-500">{message}</div>
      )}

      <div className="text-center text-sm">
        <Link href="/auth/signin" className="text-gray-500 font-bold">
          ログインはこちら
        </Link>
      </div>
    </div>
  );
};

export default Signup;
