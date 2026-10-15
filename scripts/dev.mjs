// apps/web（Next.js, :3000）と apps/editor（Vite, :5173）を同時に起動する。
// ブラウザでは http://localhost:3000 を開く（/editor は Vite へ転送される）。
import { spawn } from "node:child_process";

const procs = [
  { name: "web", args: ["--prefix", "apps/web", "run", "dev"] },
  { name: "editor", args: ["--prefix", "apps/editor", "run", "dev"] },
].map(({ name, args }) => {
  const child = spawn("npm", args, { stdio: ["ignore", "pipe", "pipe"] });
  const prefix = (line) => `[${name}] ${line}`;
  for (const stream of [child.stdout, child.stderr]) {
    stream.on("data", (buf) => {
      for (const line of buf.toString().split("\n")) if (line) console.log(prefix(line));
    });
  }
  child.on("exit", (code) => {
    console.log(prefix(`exited with code ${code}`));
    shutdown(code ?? 1);
  });
  return child;
});

let stopping = false;
function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const p of procs) p.kill("SIGTERM");
  process.exit(code);
}
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
