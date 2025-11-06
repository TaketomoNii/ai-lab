import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Protected() {
  const session = await getServerSession();
  if (!session) redirect("/login");
  return (
    <main className="space-y-6 p-6">
      <p>Secret area for: {session.user?.email}</p>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm uppercase tracking-wide text-slate-500">Welcome</p>
        <p className="text-2xl font-semibold text-slate-900">Hello Codex</p>
      </div>
    </main>
  );
}
