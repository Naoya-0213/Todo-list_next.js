import Link from "next/link";
import React from "react";

const BeforeLogin = () => {
  return (
    <div className="mt-[20px]">
      {/* ログイン用のリンク */}
      <div className="text-center text-sm mb-5">
        <Link href="/auth/signin" className="text-gray-500 font-bold">
          ログインはこちら
        </Link>
      </div>

      {/* サインアップ用のリンク */}
      <div className="text-center text-sm mb-5">
        <Link href="/auth/signup" className="text-gray-500 font-bold">
          アカウントを作成する
        </Link>
      </div>
    </div>
  );
};

export default BeforeLogin;
