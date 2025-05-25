import { Center, Container, Loader, Stack, Text } from "@mantine/core";

interface LoadingScreenProps {
	message?: string;
	height?: string | number;
}

export function LoadingScreen({
	message = "Carregando...",
	height = "50vh",
}: LoadingScreenProps) {
	return (
		<Container size="sm" py="xl">
			<Center h={height}>
				<Stack gap="md" align="center">
					<Loader size="lg" />
					<Text ta="center" c="dimmed">
						{message}
					</Text>
				</Stack>
			</Center>
		</Container>
	);
}
