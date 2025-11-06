"use client";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function Login() {
  const params = useSearchParams();
  const err = params.get("error");
  return (
    <main className="min-h-screen grid place-items-center">
      <div className="p-8 rounded-xl shadow w-full max-w-sm border space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
        {err && <div className="text-sm text-red-600">Error: {err}</div>}
        <button
          className="w-full p-3 rounded border"
          onClick={() => signIn("github", { callbackUrl: "/protected" })}
        >
          Continue with GitHub
        </button>
      </div>
    </main>
  );
}
