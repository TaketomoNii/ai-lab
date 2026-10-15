"use client";
import { signIn } from "next-auth/react";

export default function LoginButtons({ callbackUrl, devLogin }: { callbackUrl: string; devLogin: boolean }) {
  return (
    <div className="space-y-2">
      <button className="w-full rounded border p-3 hover:bg-gray-50" onClick={() => signIn("github", { callbackUrl })}>
        GitHub でログイン
      </button>
      {devLogin && (
        <button className="w-full rounded border border-dashed p-3 text-gray-600 hover:bg-gray-50" onClick={() => signIn("dev", { callbackUrl })}>
          開発用ログイン
        </button>
      )}
    </div>
  );
}
