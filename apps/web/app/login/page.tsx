import LoginForm from './LoginForm';
import Alert from '../components/Alert';

export const metadata = { title: 'ログイン | AI Web Service' };

function errorMessage(code?: string) {
  switch (code) {
    case 'OAuthSignin':
    case 'OAuthCallback':
    case 'Callback':
      return 'GitHub でのサインインに失敗しました。時間をおいて再度お試しください。';
    case 'OAuthAccountNotLinked':
      return '別のサインイン方法で登録済みの可能性があります。以前と同じ方法でお試しください。';
    case 'EmailCreateAccount':
      return 'メールリンクの作成に失敗しました。メールアドレスをご確認ください。';
    case 'SessionRequired':
      return 'このページにはログインが必要です。';
    case 'auth':
      return '認証が必要です。ログインしてください。';
    default:
      return code ? 'サインイン中にエラーが発生しました。' : undefined;
  }
}

// searchParams は Promise なので await する
export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const err = Array.isArray(sp?.error) ? sp!.error[0] : sp?.error;
  const msg = errorMessage(err);

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

          {/* エラーがあれば表示 */}
          {msg && <Alert kind="error" title={msg} />}

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
