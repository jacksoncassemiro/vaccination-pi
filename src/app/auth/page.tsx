"use client";

import { LoadingScreen, ThemeToggle } from "@/components";
import { useAuth } from "@/contexts";
import {
	Box,
	Button,
	Center,
	Container,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { Chrome } from "lucide-react";
import { signInWithGoogle } from "./actions";

export default function AuthPage() {
	const { loading: authLoading } = useAuth();

	if (authLoading) {
		return <LoadingScreen />;
	}

	return (
		<Container size="sm" py="xl">
			<Center h="70vh">
				<Paper p="xl" radius="md" withBorder w="100%" maw={400} pos="relative">
					{/* Theme Toggle no canto superior direito */}
					<Box pos="absolute" top="md" right="md">
						<ThemeToggle size="sm" variant="subtle" />
					</Box>

					<Stack gap="lg">
						<Stack gap="sm" ta="center">
							<Title order={1}>VacinaPI</Title>
							<Text c="dimmed" size="sm">
								Sistema de gestão de vacinação
							</Text>
						</Stack>

						<Stack gap="md">
							<Title order={2} ta="center" size="h3">
								Entrar ou Criar Conta
							</Title>{" "}
							<Text ta="center" c="dimmed" size="sm">
								Use sua conta do Google para acessar o sistema
							</Text>
							<form action={signInWithGoogle}>
								<Button
									fullWidth
									leftSection={<Chrome size={18} />}
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
		</Container>
	);
}
