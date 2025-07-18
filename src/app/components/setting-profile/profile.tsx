"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import * as z from "zod";
import LoadingSpinner from "../loading/loading";
import type { Database } from "@/app/lib/database.types";
import useStore from "../../../../store";
import { createClient } from "../../../../utils/supabase/clients";

type Schema = z.infer<typeof schema>;

// 入力データの検証ルールを定義
const schema = z.object({
  name: z.string().min(2, { message: "2文字以上入力する必要があります。" }),
  introduce: z.string().min(0),
});

// プロフィール
const Profile = () => {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [fileMessage, setFileMessage] = useState("");

  // 初期画像の設定
  const [avatarUrl, setAvatarUrl] = useState("/default.jpeg");
  const { user } = useStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // 初期値
    defaultValues: {
      name: user.name ? user.name : "",
      introduce: user.introduce ? user.introduce : "",
    },
    // 入力値の検証
    resolver: zodResolver(schema),
  });

  // アバター画像の取得
  useEffect(() => {
    if (user && user.avatar_url) {
      setAvatarUrl(user.avatar_url);
    }
  }, [user]);

  // 画像アップロード
  const onUploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      setFileMessage("");

      if (!files || files.length === 0) {
        setFileMessage("画像をアップロードしてください。");
        return;
      }

      const file = files[0];
      const fileSize = file.size / 1024 / 1024;
      const fileType = file.type;

      if (fileSize > 2) {
        setFileMessage("画像サイズを2MB以下にする必要があります。");
        return;
      }

      if (fileType !== "image/jpeg" && fileType !== "image/png") {
        setFileMessage("画像はjpgまたはpng形式である必要があります。");
        return;
      }

      setAvatar(file);

      // ✅ プレビュー表示用のURLを生成
      const previewUrl = URL.createObjectURL(file);
      setAvatarUrl(previewUrl);
    },
    []
  );

  // 送信
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      let avatar_url = user.avatar_url;

      if (avatar) {
        // supabaseストレージに画像アップロード
        const { data: storageData, error: storageError } =
          await supabase.storage
            .from("profile")
            .upload(`${user.id}/${uuidv4()}`, avatar);

        // エラーチェック
        if (storageError) {
          setMessage("エラーが発生しました。" + storageError.message);
          return;
        }

        if (avatar_url) {
          const fileName = avatar_url.split("/").slice(-1)[0];

          // 古い画像を削除
          await supabase.storage
            .from("profile")
            .remove([`${user.id}/${fileName}`]);
        }

        // 画像のURLを取得
        const { data: urlData } = await supabase.storage
          .from("profile")
          .getPublicUrl(storageData.path);

        avatar_url = urlData.publicUrl;
      }

      // プロフィールアップデート
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          name: data.name,
          introduce: data.introduce,
          avatar_url,
        })
        .eq("id", user.id);

      // エラーチェック
      if (updateError) {
        setMessage("エラーが発生しました。" + updateError.message);
        return;
      }

      setMessage("プロフィールを更新しました。");
    } catch (error) {
      setMessage("エラーが発生しました。" + error);
      return;
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="pt-[10px]">
      <div className="text-center font-bold text-xl mb-10">プロフィール</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center items-center flex-col"
      >
        {/* アバター画像 */}
        <div className="mb-3">
          <div className="flex flex-col text-sm items-center justify-center mb-5">
            <div className="relative w-24 h-24 mb-5">
              <Image
                src={avatarUrl}
                className="rounded-full object-cover"
                alt="avatar"
                fill
              />
            </div>

            {/* アバター画像配置 */}
            <label
              htmlFor="avatar"
              className="font-bold bg-sky-500 hover:brightness-95 py-2 px-4 rounded-full p-2 text-white text-sm"
            >
              画像を選択
            </label>
            <input
              type="file"
              id="avatar"
              onChange={onUploadImage}
              className="hidden"
            />
            {/* ファイルが未選択のときの表示 */}
            {!avatar && (
              <p className="text-red-500 text-sm mt-2">選択されていません</p>
            )}

            {fileMessage && (
              <div className="text-center text-red-500 my-5">{fileMessage}</div>
            )}
          </div>
        </div>

        {/* 名前 */}
        <div className="mb-3 w-2/3">
          <div className="text-sm mb-1 font-bold">名前</div>
          <input
            type="text"
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="名前"
            id="name"
            {...register("name", { required: true })}
            required
          />
          <div className="my-3 text-center text-sm text-red-500">
            {errors.name?.message}
          </div>
        </div>

        {/* 自己紹介 */}
        <div className="mb-3  w-2/3">
          <div className="text-sm mb-1 font-bold">自己紹介</div>
          <textarea
            className="border rounded-md w-full py-2 px-3 focus:outline-none focus:border-sky-500"
            placeholder="自己紹介"
            id="introduce"
            {...register("introduce")}
            rows={5}
          />
        </div>

        {/* 変更ボタン */}
        <div className="mb-5 w-2/3 flex justify-center">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <button
              type="submit"
              className="font-bold bg-sky-500 hover:brightness-95 w-50 rounded-full p-2 text-white text-sm"
            >
              変更
            </button>
          )}
        </div>
      </form>

      {/* メッセージ */}
      {message && (
        <div className="my-5 text-center text-red-500 mb-5">{message}</div>
      )}
    </div>
  );
};

export default Profile;
