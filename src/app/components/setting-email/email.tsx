"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import LoadingSpinner from "../loading/loading";
import type { Database } from "@/app/lib/database.types";
import { createClient } from "../../../../utils/supabase/clients";
type Schema = z.infer<typeof schema>;

// 入力データの検証ルールを定義
const schema = z.object({
  email: z.string().email({ message: "メールアドレスの形式ではありません。" }),
});

// メールアドレス変更
const Email = ({ email }: { email: string }) => {
  const router = useRouter();
  const supabase = createClient<Database>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: { email: "" },
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      // メールアドレス変更メールを送信
      const { error: updateUserError } = await supabase.auth.updateUser(
        { email: data.email },
        { emailRedirectTo: `${location.origin}/auth/callback` }
      );

      // エラーチェック
      if (updateUserError) {
        setMessage("エラーが発生しました。" + updateUserError.message);
        return;
      }

      setMessage("確認用のURLを記載したメールを送信しました。");

      // ログアウト
      const { error: signOutError } = await supabase.auth.signOut();

      // エラーチェック
      if (signOutError) {
        setMessage("エラーが発生しました。" + signOutError.message);
        return;
      }

      router.push("/auth/signin");
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
        <div className="text-center font-bold text-xl mb-10">
          メールアドレス変更
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {/* 現在のメールアドレス */}
          <div className="mb-5 ">
            <div className="text-sm mb-1 font-bold">現在のメールアドレス</div>
            <div>{email}</div>
          </div>

          {/* 新しいメールアドレス */}
          <div className="mb-5">
            <div className="text-sm mb-1 font-bold">新しいメールアドレス</div>
            <input
              type="email"
              className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
              placeholder="新しいメールアドレス"
              id="email"
              {...register("email", { required: true })}
            />
            <div className="my-3 text-center text-sm text-red-500">
              {errors.email?.message}
            </div>
          </div>

          {/* 変更ボタン */}
          <div className="mb-5">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <button
                type="submit"
                className="font-bold bg-sky-500 hover:brightness-95 w-full rounded-full p-2 text-white text-sm"
              >
                変更
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

export default Email;
