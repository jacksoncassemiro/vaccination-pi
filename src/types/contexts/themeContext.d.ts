import type { MantineColorScheme } from "@mantine/core";
import { ReactNode } from "react";

export interface ThemeContextType {
	colorScheme: MantineColorScheme;
	toggleColorScheme: () => void;
	setColorScheme: (scheme: MantineColorScheme) => void;
}

export interface ThemeProviderProps {
	children: ReactNode;
}
