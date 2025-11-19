import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const supabaseUrl = env.VITE_SUPABASE_URL;

  const edgeTarget = (() => {
    if (!supabaseUrl) return undefined;
    try {
      const url = new URL(supabaseUrl);
      const host = url.host.replace(".supabase.co", ".functions.supabase.co");
      return `${url.protocol}//${host}`;
    } catch {
      return undefined;
    }
  })();

  return {
    plugins: [tailwindcss(), react()],
    server: edgeTarget
      ? {
          proxy: {
            "/api": {
              target: edgeTarget,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          },
        }
      : undefined,
  };
});
