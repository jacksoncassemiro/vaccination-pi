"use client";

import { LoadingScreen } from "@/components";
import { useAuth } from "@/contexts";
import { browserClient } from "@/utils/supabase/client";
import {
	Button,
	Center,
	Container,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Chrome } from "lucide-react";
import { useState } from "react";

export default function AuthPage() {
	const [loading, setLoading] = useState(false);
	const { loading: authLoading } = useAuth();
	const supabase = browserClient();

	const handleGoogleSignIn = async () => {
		try {
			setLoading(true);

			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});

			if (error) {
				notifications.show({
					title: "Erro na autenticação",
					message: error.message,
					color: "red",
				});
			}
		} catch (error) {
			console.error("Erro:", error);
			notifications.show({
				title: "Erro inesperado",
				message: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
				color: "red",
			});
		} finally {
			setLoading(false);
		}
	};

	if (authLoading) {
		return <LoadingScreen />;
	}

	return (
		<Container size="sm" py="xl">
			<Center h="70vh">
				<Paper p="xl" radius="md" withBorder w="100%" maw={400}>
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
							</Title>

							<Text ta="center" c="dimmed" size="sm">
								Use sua conta do Google para acessar o sistema
							</Text>

							<Button
								fullWidth
								leftSection={<Chrome size={18} />}
								variant="default"
								onClick={handleGoogleSignIn}
								loading={loading}
								size="md"
							>
								Continuar com Google
							</Button>
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
