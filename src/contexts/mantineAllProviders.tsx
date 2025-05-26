import "@mantine/charts/styles.css";
import "@mantine/core/styles.css";
import { DatesProvider } from "@mantine/dates";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { ReactNode } from "react";
import { AuthProvider } from "./authProvider";
import { ThemeProvider } from "./themeProvider";

// Configurar dayjs para português brasileiro
dayjs.locale("pt-br");

export const MantineAllProviders = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeProvider>
			<DatesProvider
				settings={{
					locale: "pt-br",
					firstDayOfWeek: 0,
					weekendDays: [0, 6],
				}}
			>
				<Notifications />
				<AuthProvider>{children}</AuthProvider>
			</DatesProvider>
		</ThemeProvider>
	);
};
