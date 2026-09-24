import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  use: {
    baseURL: "http://localhost:3001",
    browserName: "chromium",
    channel: "chromium",
  },
  reporter: "list",
});
