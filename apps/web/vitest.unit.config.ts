import path from "node:path";
import { defineConfig } from "vitest/config";

// lib/ 以下のサーバー側ロジックの単体テスト（Storybook のブラウザテストとは別）
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: { environment: "node", include: ["lib/**/*.test.ts"] },
});
