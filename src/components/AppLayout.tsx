"use client";

import { useAuth } from "@/contexts";
import { AppShell, Group, Text, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

interface AppLayoutProps {
	children: ReactNode;
	showUserMenu?: boolean;
	showThemeToggle?: boolean;
}

export function AppLayout({
	children,
	showUserMenu = true,
	showThemeToggle = true,
}: AppLayoutProps) {
	const { user } = useAuth();
	const router = useRouter();

	const handleTitleClick = () => {
		router.push("/");
	};

	return (
		<AppShell header={{ height: 60 }} padding="md">
			<AppShell.Header>
				<Group h="100%" px="md" justify="space-between" align="center">
					{/* Logo e Nome do Sistema */}
					<Group gap="sm" align="center">
						<Logo size={32} clickable />
						<UnstyledButton onClick={handleTitleClick}>
							<Text size="lg" fw={600} c="var(--mantine-primary-color-filled)">
								VacinaPI
							</Text>
						</UnstyledButton>
					</Group>

					{/* Controles do Header */}
					<Group gap="sm" align="center">
						{showThemeToggle && <ThemeToggle size="sm" variant="subtle" />}
						{showUserMenu && user && <UserMenu />}
					</Group>
				</Group>
			</AppShell.Header>

			<AppShell.Main>{children}</AppShell.Main>
		</AppShell>
	);
}
