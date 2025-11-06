'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const Schema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください。')
    .email('メールアドレスの形式が正しくありません。'),
  password: z.string().min(8, '8文字以上で入力してください。'),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof Schema>;

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: '', password: '', remember: false },
    mode: 'onBlur',
  });

  const onSubmit = async () => {
    // 実装時は実API/NextAuthのCredentialsなどに置換
    await new Promise((r) => setTimeout(r, 400));
    router.push('/protected');
  };

  const onError = (errs: typeof errors) => {
    const keys = Object.keys(errs) as Array<keyof FormValues>;
    if (keys.length) setFocus(keys[0]);
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      {/* GitHub 公式風ボタン（光学中心を保つ 3カラム） */}
      <Link
        href="/api/auth/signin?provider=github&callbackUrl=/protected"
        className="grid w-full grid-cols-[1.25rem,1fr,1.25rem] items-center rounded-lg bg-[#24292F] px-4 py-2 font-medium text-white shadow-sm transition hover:bg-[#1F2328] focus:outline-none focus:ring-2 focus:ring-[#24292F]/30"
        aria-label="GitHubでログイン"
        prefetch={false}
      >
        <span aria-hidden className="block h-5 w-5 justify-self-start">
          <svg
            viewBox="0 0 16 16"
            width="20"
            height="20"
            aria-hidden="true"
            className="fill-current"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38
            0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
            -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
            0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27
            1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95
            .29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            />
          </svg>
        </span>
        <span className="justify-self-center">Sign in with GitHub</span>
        <span aria-hidden className="block h-5 w-5 justify-self-end opacity-0">
          <svg width="20" height="20" />
        </span>
      </Link>

      <div className="relative my-3 text-center text-xs text-white/80">
        <span className="bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] px-2">または</span>
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/20" />
      </div>

      {/* E-mail / Password フォーム（Zod + RHF） */}
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-4 rounded-2xl border border-white/40 bg-white/95 p-6 shadow-md backdrop-blur"
        aria-describedby={Object.keys(errors).length ? 'form-errors' : undefined}
      >
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-slate-800">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-slate-800">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'pw-error' : undefined}
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none ring-0 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="••••••••"
          />
          {errors.password && (
            <p id="pw-error" className="text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-slate-800">
            <input
              id="remember"
              type="checkbox"
              {...register('remember')}
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
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-sm transition disabled:opacity-50 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? '送信中…' : 'ログイン'}
        </button>

        {Object.keys(errors).length > 0 && (
          <p id="form-errors" className="sr-only" aria-live="polite">
            入力エラーがあります。各入力欄の直後に説明があります。
          </p>
        )}
      </form>
    </div>
  );
}
