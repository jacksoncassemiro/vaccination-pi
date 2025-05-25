"use client";

import { Button, Container, Stack, Text, Title } from "@mantine/core";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log do erro para serviço de monitoramento
		console.error("Application Error:", error);
	}, [error]);

	return (
		<Container size="sm" style={{ paddingTop: "2rem" }}>
			<Stack align="center" gap="lg">
				<AlertTriangle size={64} color="red" />
				<Title order={2} ta="center">
					Algo deu errado!
				</Title>
				<Text c="dimmed" ta="center">
					Ocorreu um erro inesperado. Nossa equipe foi notificada e está
					trabalhando para resolver o problema.
				</Text>
				{process.env.NODE_ENV === "development" && (
					<Text
						size="sm"
						c="red"
						ta="center"
						style={{ fontFamily: "monospace" }}
					>
						{error.message}
					</Text>
				)}
				<Button
					leftSection={<RefreshCw size={16} />}
					onClick={() => reset()}
					variant="outline"
				>
					Tentar novamente
				</Button>
			</Stack>
		</Container>
	);
}
