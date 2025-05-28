"use client";

import { theme as baseTheme } from "@/constants/theme";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type {
	ThemeContextType,
	ThemeProviderProps,
} from "@/types/contexts/themeContext";
import {
	MantineColorScheme,
	MantineProvider,
	useComputedColorScheme,
	useMantineColorScheme,
} from "@mantine/core";
import { createContext, useContext } from "react";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: ThemeProviderProps) {
	// Usar o hook otimizado com useSyncExternalStore
	const [colorScheme, setColorScheme] = useLocalStorage<MantineColorScheme>(
		"mantine-color-scheme",
		"auto"
	);

	const toggleColorScheme = () => {
		const newScheme = colorScheme === "dark" ? "light" : "dark";
		setColorScheme(newScheme);
	};

	const value: ThemeContextType = {
		colorScheme,
		toggleColorScheme,
		setColorScheme,
	};

	return (
		<ThemeContext.Provider value={value}>
			<MantineProvider theme={baseTheme} defaultColorScheme={colorScheme}>
				{children}
			</MantineProvider>
		</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextType {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme deve ser usado dentro de um ThemeProvider");
	}
	return context;
}

// Hook para acessar o color scheme computado do Mantine
export function useColorScheme() {
	const { colorScheme } = useMantineColorScheme();
	const computedColorScheme = useComputedColorScheme("light");

	return {
		colorScheme,
		computedColorScheme,
		isDark: computedColorScheme === "dark",
		isLight: computedColorScheme === "light",
	};
}
