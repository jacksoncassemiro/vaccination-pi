"use client";

import {
	Button,
	Group,
	Paper,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { ReactNode } from "react";
import { FaFileDownload, FaPlus, FaSearch } from "react-icons/fa";

interface CrudPageLayoutProps {
	title: string;
	addButtonLabel: string;
	searchPlaceholder: string;
	searchValue: string;
	onSearchChange: (value: string) => void;
	onAdd: () => void;
	onExportAll?: () => void;
	children: ReactNode;
	error?: string | null;
	showExportButton?: boolean;
}

export function CrudPageLayout({
	title,
	addButtonLabel,
	searchPlaceholder,
	searchValue,
	onSearchChange,
	onAdd,
	onExportAll,
	children,
	error,
	showExportButton = true,
}: CrudPageLayoutProps) {
	return (
		<Stack gap="lg">
			{/* Header */}
			<Group justify="space-between">
				<Title order={2}>{title}</Title>
				<Group gap="sm">
					{showExportButton && onExportAll && (
						<Button
							variant="outline"
							leftSection={<FaFileDownload />}
							onClick={onExportAll}
						>
							Exportar PDF
						</Button>
					)}
					<Button leftSection={<FaPlus />} onClick={onAdd}>
						{addButtonLabel}
					</Button>
				</Group>
			</Group>

			{/* Search */}
			<Paper p="md" withBorder>
				<TextInput
					placeholder={searchPlaceholder}
					leftSection={<FaSearch />}
					value={searchValue}
					onChange={(event) => onSearchChange(event.currentTarget.value)}
				/>
			</Paper>

			{/* Error Message */}
			{error && (
				<Paper p="md" withBorder>
					<Text c="red" ta="center">
						{error}
					</Text>
				</Paper>
			)}

			{/* Content */}
			{children}
		</Stack>
	);
}
