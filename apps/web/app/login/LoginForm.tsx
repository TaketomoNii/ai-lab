'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; pw?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = 'メールアドレスを入力してください。';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = 'メールアドレスの形式が正しくありません。';
    if (!pw) next.pw = 'パスワードを入力してください。';
    else if (pw.length < 8) next.pw = '8文字以上で入力してください。';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 400)); // ← 実装時にAPIへ置換
      window.location.href = '/protected';
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* --- GitHub でログイン（Link使用） --- */}
      <Link
        href="/api/auth/signin?provider=github"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 font-medium text-white shadow-sm transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-black/20"
        aria-label="GitHubでログイン"
        prefetch={false}
      >
        🐙 GitHubでログイン
      </Link>

      <div className="relative my-3 text-center text-xs text-white/80">
        <span className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] px-2">または</span>
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/20" />
      </div>

      {/* --- メール＋パスワード --- */}
      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-4 rounded-2xl border border-white/30 backdrop-blur bg-white/95 p-6 shadow-md backdrop-blur"
      >
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-slate-800">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-slate-800">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type={showPw ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            aria-invalid={!!errors.pw}
            aria-describedby={errors.pw ? 'pw-error' : undefined}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="••••••••"
          />
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowPw((prev) => !prev)}
              className="text-xs text-slate-600 underline underline-offset-2 hover:text-slate-800"
              aria-pressed={showPw}
            >
              パスワードを表示/非表示
            </button>
          </div>
          {errors.pw && (
            <p id="pw-error" className="text-sm text-red-600">
              {errors.pw}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-slate-800">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-200"
            />
            ログイン状態を保持
          </label>
          <a
            href="/forgot-password"
            className="text-sm text-slate-700 underline underline-offset-2 hover:text-slate-900"
          >
            パスワードをお忘れですか？
          </a>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition disabled:opacity-50 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-busy={submitting}
        >
          {submitting ? '送信中…' : 'ログイン'}
        </button>
      </form>
    </div>
  );
}
