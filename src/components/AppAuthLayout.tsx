"use client";

import { useAuth } from "@/contexts";
import {
	AppShell,
	Burger,
	Container,
	Group,
	ScrollArea,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Home, Shield, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ConnectionStatus } from "./ConnectionStatus";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";

interface AppAuthLayoutProps {
	children: ReactNode;
	showUserMenu?: boolean;
}

export function AppAuthLayout({
	children,
	showUserMenu = true,
}: AppAuthLayoutProps) {
	const { user } = useAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
	const handleTitleClick = () => {
		router.push("/");
	};
	const navigationItems = [
		{
			label: "Início",
			href: "/",
			icon: Home,
			active: pathname === "/",
		},
		{
			label: "Pacientes",
			href: "/patients",
			icon: Users,
			active: pathname.startsWith("/patients"),
		},
		{
			label: "Vacinas",
			href: "/vaccines",
			icon: Shield,
			active: pathname.startsWith("/vaccines"),
		},
	];

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { desktop: true, mobile: !mobileOpened },
			}}
			padding={{ base: "xs", sm: "md" }}
		>
			<AppShell.Header>
				<Container size="md" h="100%">
					<Group h="100%" justify="space-between" align="center">
						<Group gap="xs" align="center">
							{user && (
								<Burger
									opened={mobileOpened}
									onClick={toggleMobile}
									hiddenFrom="sm"
									size="sm"
								/>
							)}
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
						{user && (
							<Group gap={8} visibleFrom="sm">
								{navigationItems.map((item) => (
									<UnstyledButton
										key={item.href}
										size="compact-md"
										component="button"
										style={{
											color: item.active
												? "var(--mantine-color-dimmed)"
												: "var(--mantine-color-text)",
											cursor: item.active ? "default" : "pointer",
										}}
										disabled={item.active}
										onClick={() => {
											router.push(item.href);
											toggleMobile();
										}}
									>
										{item.label}
									</UnstyledButton>
								))}
							</Group>
						)}
						<Group gap="xs" align="center">
							{showUserMenu && user && <UserMenu />}
						</Group>
					</Group>
				</Container>
			</AppShell.Header>
			{user && (
				<AppShell.Navbar p="md">
					<AppShell.Section>
						<Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="sm">
							Navegação
						</Text>
					</AppShell.Section>

					<AppShell.Section grow component={ScrollArea}>
						<Stack gap={0}>
							{navigationItems.map((item) => (
								<UnstyledButton
									key={item.href}
									size="compact-md"
									component="button"
									style={{
										color: item.active
											? "var(--mantine-color-dimmed)"
											: "var(--mantine-color-text)",
										cursor: item.active ? "default" : "pointer",
									}}
									disabled={item.active}
									onClick={() => {
										router.push(item.href);
										toggleMobile();
									}}
								>
									{item.label}
								</UnstyledButton>
							))}
						</Stack>
					</AppShell.Section>

					<AppShell.Section>
						<Text size="xs" c="dimmed" ta="center">
							© 2025 VacinaPI
						</Text>
					</AppShell.Section>
				</AppShell.Navbar>
			)}
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
