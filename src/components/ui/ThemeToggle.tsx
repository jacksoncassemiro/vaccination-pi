"use client";

import {
	ActionIcon,
	Tooltip,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import { FaDesktop, FaMoon, FaSun } from "react-icons/fa";

interface ThemeToggleProps {
	size?: "xs" | "sm" | "md" | "lg" | "xl";
	variant?:
		| "filled"
		| "light"
		| "outline"
		| "transparent"
		| "white"
		| "subtle"
		| "default";
}

export function ThemeToggle({
	size = "md",
	variant = "default",
}: ThemeToggleProps) {
	const { colorScheme, setColorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme("light", {
		getInitialValueInEffect: false,
	});

	const toggleTheme = () => {
		// Ciclo: light -> dark -> auto -> light
		if (colorScheme === "light") {
			setColorScheme("dark");
		} else if (colorScheme === "dark") {
			setColorScheme("auto");
		} else {
			setColorScheme("light");
		}
	};
	// Determina qual ícone mostrar baseado no esquema atual
	const getIcon = () => {
		if (colorScheme === "auto") {
			return <FaDesktop size={16} />;
		}
		return computedColorScheme === "dark" ? (
			<FaSun size={16} />
		) : (
			<FaMoon size={16} />
		);
	};

	// Determina o texto do tooltip
	const getTooltipText = () => {
		if (colorScheme === "light") {
			return "Mudar para modo escuro";
		} else if (colorScheme === "dark") {
			return "Mudar para modo automático";
		} else {
			return "Mudar para modo claro";
		}
	};

	return (
		<Tooltip label={getTooltipText()} position="bottom">
			<ActionIcon
				onClick={toggleTheme}
				variant={variant}
				size={size}
				aria-label="Toggle color scheme"
			>
				{getIcon()}
			</ActionIcon>
		</Tooltip>
	);
}
