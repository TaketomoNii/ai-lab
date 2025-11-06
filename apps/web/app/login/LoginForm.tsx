'use client';
import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
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
      // ここで実際のサインイン処理へ接続（例：/api/auth/signin）。
      // 今回はモック。実装時は fetch などに差し替え。
      await new Promise((r) => setTimeout(r, 600));
      // 成功後の遷移は /protected など
      window.location.href = '/protected';
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
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
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          aria-invalid={!!errors.pw}
          aria-describedby={errors.pw ? 'pw-error' : undefined}
          className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          placeholder="••••••••"
        />
        {errors.pw && (
          <p id="pw-error" className="text-sm text-red-600">
            {errors.pw}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
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
          className="text-sm text-slate-600 underline underline-offset-2 hover:text-slate-800"
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
  );
}
