"use client";

import {
	AppShell,
	Container,
	Group,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ConnectionStatus } from "./ConnectionStatus";
import { Logo } from "./Logo";

interface AppPublicLayoutProps {
	children: ReactNode;
}

export function AppPublicLayout({ children }: AppPublicLayoutProps) {
	const router = useRouter();
	const handleTitleClick = () => {
		router.push("/auth");
	};

	return (
		<AppShell header={{ height: 60 }} padding={{ base: "xs", sm: "md" }}>
			<AppShell.Header>
				<Container size="md" h="100%">
					<Group h="100%" justify="space-between" align="center">
						<Group gap="xs" align="center">
							<Logo size={26} clickable />
							<UnstyledButton onClick={handleTitleClick} visibleFrom="sm">
								<Text
									size="lg"
									fw={600}
									c="var(--mantine-primary-color-filled)"
								>
									VacinaPI
								</Text>
							</UnstyledButton>
						</Group>
					</Group>
				</Container>
			</AppShell.Header>
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
