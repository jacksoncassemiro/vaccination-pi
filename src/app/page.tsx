"use client";

import { LoadingScreen, UserMenu } from "@/components";
import { useAuth } from "@/contexts";
import { Container, Group, Paper, Stack, Text, Title } from "@mantine/core";

export default function HomePage() {
	const { user, loading } = useAuth();

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<Container size="sm" py="xl">
			<Stack gap="lg">
				<Group justify="space-between" align="center">
					<Title ta="center" order={1}>
						VacinaPI
					</Title>
					<UserMenu />
				</Group>

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
					</Stack>
				</Paper>
			</Stack>
		</Container>
	);
}
