"use client";

import { signOut } from "@/app/auth/actions";
import { useAuth } from "@/contexts";
import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import { LogOut } from "lucide-react";

interface UserMenuProps {
	className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
	const { user } = useAuth();

	if (!user) return null;

	return (
		<div className={className}>
			<Group gap="sm">
				<Avatar
					src={user.user_metadata?.avatar_url}
					alt={user.user_metadata?.full_name || user.email || "Usuário"}
					size="sm"
				>
					{(user.user_metadata?.full_name ||
						user.email ||
						"U")[0].toUpperCase()}
				</Avatar>
				<div style={{ flex: 1 }}>
					<Text size="sm" fw={500}>
						{user.user_metadata?.full_name || "Usuário"}
					</Text>
					<Text size="xs" c="dimmed">
						{user.email}
					</Text>
				</div>{" "}
				<form action={signOut} style={{ display: "inline" }}>
					<UnstyledButton type="submit" p="xs">
						<LogOut size={16} />
					</UnstyledButton>
				</form>
			</Group>
		</div>
	);
}
