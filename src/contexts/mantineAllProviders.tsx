import { theme } from "@/constants";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { ReactNode } from "react";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

export const MantineAllProviders = ({ children }: { children: ReactNode }) => {
	return (
		<MantineProvider defaultColorScheme="dark" theme={theme}>
			<ModalsProvider>
				<Notifications />
				{children}
			</ModalsProvider>
		</MantineProvider>
	);
};
