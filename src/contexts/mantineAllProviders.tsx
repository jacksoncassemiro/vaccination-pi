import { theme } from "@/constants";
import "@mantine/charts/styles.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { ReactNode } from "react";
import { AuthProvider } from "./authProvider";

export const MantineAllProviders = ({ children }: { children: ReactNode }) => {
	return (
		<MantineProvider defaultColorScheme="dark" theme={theme}>
			<ModalsProvider>
				<Notifications />
				<AuthProvider>{children}</AuthProvider>
			</ModalsProvider>
		</MantineProvider>
	);
};
