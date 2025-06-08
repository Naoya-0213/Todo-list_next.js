"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Password from "@/app/components/setting-password/password";
import { createClient } from "../../../../../utils/supabase/clients";

const ResetPasswordConfirmPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();

  const token = searchParams.get("code");
  const email = searchParams.get("email"); // ✅ emailも必要

  const [authDone, setAuthDone] = useState(false);

  useEffect(() => {
    if (!token || !email) {
      router.push("/auth/signin");
      return;
    }

    supabase.auth
      .verifyOtp({ type: "recovery", token, email }) // ✅ emailを追加
      .then(({ error }) => {
        if (error) {
          console.error("verifyOtp error:", error.message);
          router.push("/auth/signin");
        } else {
          setAuthDone(true);
        }
      });
  }, [token, email]);

  if (!authDone) {
    return <div className="text-center mt-10">認証中です...</div>;
  }

  return (
    <div className="max-w-[400px] mx-auto">
      <Password />
    </div>
  );
};

export default ResetPasswordConfirmPage;
