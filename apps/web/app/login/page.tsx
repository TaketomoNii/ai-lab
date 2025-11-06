import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-dvh bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] p-6">
      <div className="mx-auto flex max-w-7xl items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div aria-hidden className="mx-auto mb-2 h-12 w-12 rounded-xl bg-white/90 shadow-sm">
              🏢
            </div>
            <h1 className="text-lg font-semibold text-white drop-shadow">
              クラウド人事・給与 管理システム
            </h1>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
