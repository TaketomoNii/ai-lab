import Card from '../components/Card';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Protected() {
  const session = await getServerSession();
  if (!session) redirect('/login');
  return (
    <main className="space-y-6 p-6">
      <p>Secret area for: {session.user?.email}</p>
      <Card subtitle="Welcome" title="Hello Codex" />
    </main>
  );
}
