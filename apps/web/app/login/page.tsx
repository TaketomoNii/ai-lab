import LoginForm from './LoginForm';

export const metadata = {
  title: 'ログイン | AI Web Service',
};

export default function LoginPage() {
  // 画面上部のナビ高さ(約56px=3.5rem)を差し引いて縦横センターに配置
  return (
    <main className="min-h-dvh bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] px-6">
      <div className="mx-auto grid min-h-[calc(100dvh-3.5rem)] max-w-7xl place-items-center">
        <div className="w-full max-w-md text-center">
          <div className="mb-6">
            <div
              aria-hidden
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/95 shadow-sm"
            >
              🏢
            </div>
            <h1 className="text-xl font-semibold text-white drop-shadow">AI Web Service</h1>
          </div>

          {/* OAuthボタン + フォーム */}
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
