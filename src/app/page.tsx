"use client";

import { AppLayout, LoadingScreen } from "@/components";
import { useAuth } from "@/contexts";
import { useColorScheme } from "@/hooks";
import {
	Badge,
	Container,
	Group,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";

export default function HomePage() {
	const { user, loading } = useAuth();
	const { colorScheme, computedColorScheme, isDark } = useColorScheme();

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<AppLayout>
			<Container size="sm" py="xl">
				<Stack gap="lg">
					{" "}
					<Paper p="xl" radius="md" withBorder>
						<Stack gap="md">
							<Title order={2} ta="center">
								Bem-vindo!
							</Title>

							{user && (
								<Text ta="center" c="dimmed">
									Olá, {user.user_metadata?.full_name || user.email}!
								</Text>
							)}

							<Text ta="center">
								Sistema de gestão de vacinação para o curso de Sistemas para
								Internet da UNCISAL.
							</Text>

							{/* Demonstração do sistema de temas */}
							<Group justify="center" gap="xs">
								<Badge variant="light" color={isDark ? "yellow" : "blue"}>
									Tema: {colorScheme}
								</Badge>
								<Badge variant="outline" color="gray">
									Ativo: {computedColorScheme}
								</Badge>
							</Group>
						</Stack>
					</Paper>
				</Stack>
			</Container>
		</AppLayout>
	);
}
