import "@mantine/charts/styles.css";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { ReactNode } from "react";
import { AuthProvider } from "./authProvider";
import { ThemeProvider } from "./themeProvider";

export const MantineAllProviders = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeProvider>
			<ModalsProvider>
				<Notifications />
				<AuthProvider>{children}</AuthProvider>
			</ModalsProvider>
		</ThemeProvider>
	);
};
