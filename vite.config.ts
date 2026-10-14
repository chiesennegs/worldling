import { defineConfig } from "vite";
export default defineConfig({
  base: process.env.WORLDLING_BASE_PATH || "/",
});
