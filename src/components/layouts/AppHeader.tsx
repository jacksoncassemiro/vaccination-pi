"use client";

import { Container, Group, Text, UnstyledButton } from "@mantine/core";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Logo } from "..";

interface AppHeaderProps {
	/** Título da aplicação */
	title?: string;
	/** Ação ao clicar no título/logo */
	onTitleClick?: () => void;
	/** Conteúdo adicional do lado esquerdo */
	leftContent?: ReactNode;
	/** Conteúdo adicional do lado direito */
	rightContent?: ReactNode;
}

/**
 * Header reutilizável para todos os layouts da aplicação.
 * Fornece logo, título e áreas para conteúdo customizado.
 */
export function AppHeader({
	title = "VacinaPI",
	onTitleClick,
	leftContent,
	rightContent,
}: AppHeaderProps) {
	const router = useRouter();

	const handleTitleClick = () => {
		if (onTitleClick) {
			onTitleClick();
		} else {
			router.push("/");
		}
	};

	return (
		<Container size="md" h="100%">
			<Group h="100%" justify="space-between" align="center">
				<Group gap="xs" align="center">
					{leftContent}
					<Logo size={26} clickable />
					<UnstyledButton onClick={handleTitleClick} visibleFrom="sm">
						<Text size="lg" fw={600} c="var(--mantine-primary-color-filled)">
							{title}
						</Text>
					</UnstyledButton>
				</Group>

				{rightContent && (
					<Group gap="xs" align="center">
						{rightContent}
					</Group>
				)}
			</Group>
		</Container>
	);
}
