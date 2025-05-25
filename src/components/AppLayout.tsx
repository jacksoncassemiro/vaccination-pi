"use client";

import { useAuth } from "@/contexts";
import {
	AppShell,
	Container,
	Group,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";

interface AppLayoutProps {
	children: ReactNode;
	showUserMenu?: boolean;
}

export function AppLayout({ children, showUserMenu = true }: AppLayoutProps) {
	const { user } = useAuth();
	const router = useRouter();

	const handleTitleClick = () => {
		router.push("/");
	};
	return (
		<AppShell header={{ height: 60 }} padding="md">
			<AppShell.Header>
				<Container size="md" h="100%">
					<Group h="100%" justify="space-between" align="center">
						{/* Logo e Nome do Sistema */}
						<Group gap="sm" align="center">
							<Logo size={32} clickable />
							<UnstyledButton onClick={handleTitleClick}>
								<Text
									size="lg"
									fw={600}
									c="var(--mantine-primary-color-filled)"
								>
									VacinaPI
								</Text>
							</UnstyledButton>
						</Group>

						{/* Controles do Header */}
						<Group gap="sm" align="center">
							{showUserMenu && user && <UserMenu />}
						</Group>
					</Group>
				</Container>
			</AppShell.Header>

			<AppShell.Main>
				<Container size="md">{children}</Container>
			</AppShell.Main>
		</AppShell>
	);
}
