"use client";

import { Box, useMantineTheme } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface LogoProps {
	size?: number;
	clickable?: boolean;
}

export function Logo({ size = 32, clickable = false }: LogoProps) {
	const theme = useMantineTheme();
	const router = useRouter();

	const handleClick = () => {
		if (clickable) {
			router.push("/");
		}
	};

	return (
		<Box
			w={size}
			h={size}
			style={{
				borderRadius: theme.radius.md,
				boxShadow: theme.shadows.sm,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				userSelect: "none",
				cursor: clickable ? "pointer" : "default",
				transition: "all 0.2s ease",
				overflow: "hidden",
				"&:hover": clickable
					? {
							transform: "scale(1.05)",
							boxShadow: theme.shadows.md,
					  }
					: {},
			}}
			onClick={handleClick}
		>
			<Image
				src="/logo.svg"
				alt="VacinaPI Logo"
				width={size}
				height={size}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "contain",
				}}
				priority
			/>
		</Box>
	);
}
