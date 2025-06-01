"use client";

import { AppShell, Container, Stack } from "@mantine/core";
import { ReactNode } from "react";
import { ConnectionStatus } from "../ConnectionStatus";

interface BaseAppShellProps {
	children: ReactNode;
	header: ReactNode;
	navbar?: ReactNode;
	withNavbar?: boolean;
	mobileOpened?: boolean;
}

/**
 * Shell base comum para todos os layouts da aplicação.
 * Fornece estrutura consistente com header, main e status de conexão.
 */
export function BaseAppShell({
	children,
	header,
	navbar,
	withNavbar = false,
	mobileOpened = false,
}: BaseAppShellProps) {
	return (		<AppShell
			header={{ height: 60 }}
			navbar={
				withNavbar && navbar
					? {
							width: 300,
							breakpoint: "sm",
							collapsed: { mobile: !mobileOpened },
					  }
					: undefined
			}
			padding={{ base: "xs", sm: "md" }}
		>
			<AppShell.Header>{header}</AppShell.Header>

			{withNavbar && navbar && <AppShell.Navbar>{navbar}</AppShell.Navbar>}

			<AppShell.Main>
				<Container size="md">
					<Stack gap="md">
						<ConnectionStatus />
						{children}
					</Stack>
				</Container>
			</AppShell.Main>
		</AppShell>
	);
}
