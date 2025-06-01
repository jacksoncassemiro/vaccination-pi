import { Button, Container, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { FaHome, FaSearch } from "react-icons/fa";

export default function NotFound() {
	return (
		<Container size="md" style={{ paddingTop: "2rem" }}>
			<Stack align="center" gap="lg">
				<Title
					order={1}
					ta="center"
					style={{ fontSize: "6rem", fontWeight: 900 }}
					c="blue"
				>
					404
				</Title>
				<Title order={2} ta="center">
					Página não encontrada
				</Title>
				<Text c="dimmed" ta="center" size="lg">
					A página que você está procurando não existe ou foi movida.
				</Text>
				<Stack gap="sm">
					<Button
						component={Link}
						href="/"
						leftSection={<FaHome size={16} />}
						size="md"
					>
						Voltar ao início
					</Button>
					<Button
						component={Link}
						href="/"
						leftSection={<FaSearch size={16} />}
						variant="outline"
						size="md"
					>
						Buscar no sistema
					</Button>
				</Stack>
			</Stack>
		</Container>
	);
}
