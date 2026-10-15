import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Protected() {
  const session = await getSession();
  if (!session) redirect("/login");
  return <main className="p-6">Secret area for: {session.user?.email}</main>;
}
