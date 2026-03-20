import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const configuredApiUrl = env.VITE_API_URL;
	const parsedApiUrl = configuredApiUrl ? new URL(configuredApiUrl) : null;
	const apiOrigin = parsedApiUrl?.origin;
	const apiPathPrefix = parsedApiUrl?.pathname?.replace(/\/$/, "") || "";

	return {
		server: {
			host: "::",
			port: 8080,
			hmr: {
				overlay: false,
			},
			proxy: apiOrigin
				? {
					"/api": {
						target: apiOrigin,
						changeOrigin: true,
						rewrite: (requestPath) => requestPath.replace(/^\/api/, `${apiPathPrefix}` || ""),
					},
				}
				: undefined,
		},
		plugins: [react()],
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern-compiler",
				},
			},
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	};
});
