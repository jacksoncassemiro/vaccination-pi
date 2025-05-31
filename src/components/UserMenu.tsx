"use client";

import { signOut } from "@/app/(public)/auth/actions";
import { useAuth } from "@/contexts";
import {
	Avatar,
	Group,
	Menu,
	Text,
	UnstyledButton,
	useMantineColorScheme,
} from "@mantine/core";
import {
	FaChevronDown,
	FaDesktop,
	FaMoon,
	FaSignOutAlt,
	FaSun,
} from "react-icons/fa";

interface UserMenuProps {
	className?: string;
}

interface UserButtonProps extends React.ComponentPropsWithoutRef<"button"> {
	image?: string;
	name: string;
	email: string;
	icon?: React.ReactNode;
}

// React 19: ref como prop - sem forwardRef
function UserButton({ image, name, email, icon, ...others }: UserButtonProps) {
	return (
		<UnstyledButton
			style={{
				padding: "var(--mantine-spacing-xs) 0",
				color: "var(--mantine-color-text)",
				borderRadius: "var(--mantine-radius-sm)",
				transition: "background-color 0.15s ease",
			}}
			styles={{
				root: {
					"&:hover": {
						backgroundColor: "var(--mantine-color-gray-light-hover)",
					},
				},
			}}
			{...others}
		>
			<Group gap="sm">
				<Avatar src={image} size="sm">
					{name[0].toUpperCase()}
				</Avatar>

				<div style={{ flex: 1 }}>
					<Text size="sm" fw={500}>
						{name}
					</Text>
					<Text c="dimmed" size="xs">
						{email}
					</Text>
				</div>

				{icon || <FaChevronDown size={14} />}
			</Group>
		</UnstyledButton>
	);
}

export function UserMenu({ className }: UserMenuProps) {
	const { user } = useAuth();
	const { colorScheme, setColorScheme } = useMantineColorScheme();

	if (!user) return null;

	const handleThemeChange = (newScheme: "light" | "dark" | "auto") => {
		setColorScheme(newScheme);
	};
	const getThemeIcon = (scheme: "light" | "dark" | "auto") => {
		switch (scheme) {
			case "light":
				return <FaSun size={14} />;
			case "dark":
				return <FaMoon size={14} />;
			case "auto":
				return <FaDesktop size={14} />;
		}
	};

	const getThemeLabel = (scheme: "light" | "dark" | "auto") => {
		switch (scheme) {
			case "light":
				return "Tema Claro";
			case "dark":
				return "Tema Escuro";
			case "auto":
				return "Tema Automático";
		}
	};

	return (
		<div className={className}>
			<Menu
				shadow="md"
				width={200}
				position="bottom-end"
				withArrow
				arrowPosition="side"
			>
				<Menu.Target>
					<UserButton
						image={user.user_metadata?.avatar_url}
						name={user.user_metadata?.full_name || "Usuário"}
						email={user.email || ""}
					/>
				</Menu.Target>

				<Menu.Dropdown>
					<Menu.Label>Preferências</Menu.Label>
					<Menu.Item
						leftSection={getThemeIcon("light")}
						onClick={() => handleThemeChange("light")}
						rightSection={colorScheme === "light" ? "✓" : undefined}
					>
						{getThemeLabel("light")}
					</Menu.Item>
					<Menu.Item
						leftSection={getThemeIcon("dark")}
						onClick={() => handleThemeChange("dark")}
						rightSection={colorScheme === "dark" ? "✓" : undefined}
					>
						{getThemeLabel("dark")}
					</Menu.Item>
					<Menu.Item
						leftSection={getThemeIcon("auto")}
						onClick={() => handleThemeChange("auto")}
						rightSection={colorScheme === "auto" ? "✓" : undefined}
					>
						{getThemeLabel("auto")}
					</Menu.Item>
					<Menu.Divider />
					<Menu.Label>Conta</Menu.Label>{" "}
					<Menu.Item
						leftSection={<FaSignOutAlt size={14} />}
						color="red"
						onClick={async () => {
							await signOut();
						}}
					>
						Sair
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</div>
	);
}
