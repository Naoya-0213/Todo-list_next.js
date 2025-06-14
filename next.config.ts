import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["xrfjlzuqozzdnpyyndyb.supabase.co"], // ← Supabaseのホスト名を追加
  },
};

export default nextConfig;
