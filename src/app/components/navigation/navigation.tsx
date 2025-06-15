"use client";

import Link from "next/link";
import Image from "next/image";
import useStore from "../../../../store";

export const Navigation = () => {
  const { user } = useStore(); // ✅ Zustandから直接取得

  return (
    <header className="shadow-lg shadow-gray-100">
      <div className="py-5 w-full max-w-5xl px-4 mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-xl cursor-pointer">
          TODO APP
        </Link>

        <div className="text-sm font-bold">
          {user.id ? ( // ✅ ログイン済みかどうか
            <div className="flex items-center space-x-5">
              <Link href="/settings/profile">
                <div className="relative w-10 h-10">
                  <Image
                    src={user.avatar_url || "/default.jpeg"}
                    className="rounded-full object-cover"
                    alt="avatar"
                    fill
                  />
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-5">
              <Link href="/auth/signin">ログイン</Link>
              <Link href="/auth/signup">サインアップ</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
