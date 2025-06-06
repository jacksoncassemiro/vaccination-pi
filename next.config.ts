import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		optimizePackageImports: [
			"@mantine/charts",
			"@mantine/core",
			"@mantine/form",
			"@mantine/hooks",
			"@mantine/modals",
			"@mantine/notifications",
		],
	},
};

export default nextConfig;
