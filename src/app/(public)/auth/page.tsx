"use client";

import { LoadingScreen } from "@/components";
import { useAuth } from "@/contexts";
import { Button, Center, Paper, Stack, Text, Title } from "@mantine/core";
import { FaGoogle } from "react-icons/fa";
import { signInWithGoogle } from "./actions";

export default function AuthPage() {
	const { loading: authLoading } = useAuth();

	if (authLoading) {
		return <LoadingScreen />;
	}
	return (
		<Center h="70vh" py="xl">
			<Paper p="xl" radius="md" withBorder w="100%" maw={400}>
				<Stack gap="lg">
					<Stack gap="sm" ta="center">
						<Title order={1}>Entrar no Sistema</Title>
						<Text c="dimmed" size="sm">
							Sistema de gestão de vacinação
						</Text>
					</Stack>

					<Stack gap="md">
						<Title order={2} ta="center" size="h3">
							Autenticação
						</Title>
						<Text ta="center" c="dimmed" size="sm">
							Use sua conta do Google para acessar o sistema
						</Text>{" "}
						<form action={signInWithGoogle}>
							<Button
								fullWidth
								leftSection={<FaGoogle size={18} />}
								variant="default"
								type="submit"
								size="md"
							>
								Continuar com Google
							</Button>
						</form>
					</Stack>

					<Text ta="center" c="dimmed" size="xs">
						Ao continuar, você concorda com os termos de uso do sistema.
					</Text>
				</Stack>
			</Paper>
		</Center>
	);
}
