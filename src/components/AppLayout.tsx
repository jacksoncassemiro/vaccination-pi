"use client";

import { useAuth } from "@/contexts";
import {
	AppShell,
	Burger,
	Container,
	Group,
	NavLink,
	ScrollArea,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Home, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ConnectionStatus } from "./ConnectionStatus";
import { Logo } from "./Logo";
import { UserMenu } from "./UserMenu";

interface AppLayoutProps {
	children: ReactNode;
	showUserMenu?: boolean;
}

export function AppLayout({ children, showUserMenu = true }: AppLayoutProps) {
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
	];

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{
				width: 280,
				breakpoint: "sm",
				collapsed: { mobile: !mobileOpened },
			}}
			padding="md"
		>
			{" "}
			<AppShell.Header>
				<Container size="md" h="100%">
					<Group h="100%" justify="space-between" align="center">
						{/* Logo + Burger (lado a lado) */}
						<Group gap="sm" align="center">
							{/* Burger menu apenas no mobile */}
							{user && (
								<Burger
									opened={mobileOpened}
									onClick={toggleMobile}
									hiddenFrom="sm"
									size="sm"
								/>
							)}
							<Logo size={32} clickable />
							{/* Nome do sistema - oculto em mobile */}
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

						{/* Controles do Header */}
						<Group gap="sm" align="center">
							{showUserMenu && user && <UserMenu />}
						</Group>
					</Group>
				</Container>
			</AppShell.Header>
			{/* Navbar lateral apenas para mobile */}
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
								<NavLink
									key={item.href}
									component="button"
									label={item.label}
									leftSection={<item.icon size={16} />}
									active={item.active}
									variant={item.active ? "filled" : "subtle"}
									onClick={() => {
										router.push(item.href);
										toggleMobile(); // Fechar navbar no mobile após navegação
									}}
								/>
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
