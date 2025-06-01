"use client";

import { ScrollArea, Stack, Text, UnstyledButton } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { FaHome, FaSyringe, FaUsers } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

/**
 * Componente de navegação mobile para usuários autenticados.
 */
export function AuthNavbar() {
	const router = useRouter();
	const pathname = usePathname();

	const navigationItems = [
		{
			label: "Início",
			href: "/",
			icon: FaHome,
			active: pathname === "/",
		},
		{
			label: "Pacientes",
			href: "/patients",
			icon: FaUsers,
			active: pathname.startsWith("/patients"),
		},
		{
			label: "Vacinas",
			href: "/vaccines",
			icon: MdSecurity,
			active: pathname.startsWith("/vaccines"),
		},
		{
			label: "Vacinações",
			href: "/vaccinations",
			icon: FaSyringe,
			active: pathname.startsWith("/vaccinations"),
		},
	];

	return (
		<>
			<Text size="xs" tt="uppercase" fw={700} c="dimmed" mb="sm">
				Navegação
			</Text>

			<ScrollArea style={{ flex: 1 }}>
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
								padding: "8px 12px",
								textAlign: "left",
								width: "100%",
							}}
							disabled={item.active}
							onClick={() => {
								router.push(item.href);
							}}
						>
							{item.label}
						</UnstyledButton>
					))}
				</Stack>
			</ScrollArea>

			<Text size="xs" c="dimmed" ta="center" mt="auto" pt="md">
				© 2025 VacinaPI
			</Text>
		</>
	);
}

/**
 * Componente de navegação desktop para usuários autenticados.
 */
export function AuthDesktopNav() {
	const router = useRouter();
	const pathname = usePathname();

	const navigationItems = [
		{
			label: "Início",
			href: "/",
			icon: FaHome,
			active: pathname === "/",
		},
		{
			label: "Pacientes",
			href: "/patients",
			icon: FaUsers,
			active: pathname.startsWith("/patients"),
		},
		{
			label: "Vacinas",
			href: "/vaccines",
			icon: MdSecurity,
			active: pathname.startsWith("/vaccines"),
		},
		{
			label: "Vacinações",
			href: "/vaccinations",
			icon: FaSyringe,
			active: pathname.startsWith("/vaccinations"),
		},
	];

	return (
		<>
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
						padding: "8px 12px",
					}}
					disabled={item.active}
					onClick={() => {
						router.push(item.href);
					}}
				>
					{item.label}
				</UnstyledButton>
			))}
		</>
	);
}
