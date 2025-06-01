"use client";

import { CRUD_ACTION_COLORS } from "@/constants";
import type { Vaccine } from "@/types/vaccines";
import {
	ActionIcon,
	Group,
	Pagination,
	Paper,
	Table,
	Text,
	Tooltip,
	rem,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { FaEdit, FaFileDownload, FaTrash } from "react-icons/fa";

interface VaccinesTableProps {
	vaccines: Vaccine[];
	loading: boolean;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onEdit: (vaccine: Vaccine) => void;
	onDelete: (id: string) => void;
	onExportPdf: (vaccine: Vaccine) => void;
}

function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("pt-BR");
}

export function VaccinesTable({
	vaccines,
	loading,
	page,
	totalPages,
	onPageChange,
	onEdit,
	onDelete,
	onExportPdf,
}: VaccinesTableProps) {
	const handleDelete = (vaccine: Vaccine) => {
		modals.openConfirmModal({
			title: "Confirmar exclusão",
			children: (
				<Text>
					Tem certeza que deseja excluir a vacina{" "}
					<strong>{vaccine.type}</strong> do fabricante{" "}
					<strong>{vaccine.manufacturer}</strong>?
				</Text>
			),
			labels: { confirm: "Excluir", cancel: "Cancelar" },
			confirmProps: { color: "red" },
			onConfirm: () => {
				onDelete(vaccine.id);
				notifications.show({
					title: "Sucesso",
					message: "Vacina excluída com sucesso",
					color: "green",
				});
			},
		});
	};

	if (loading) {
		return (
			<Paper p="md">
				<Text ta="center" c="dimmed">
					Carregando vacinas...
				</Text>
			</Paper>
		);
	}

	if (vaccines.length === 0 && !loading) {
		return (
			<Paper p="xl" ta="center">
				<Text c="dimmed" size="lg">
					Nenhuma vacina encontrada
				</Text>
				<Text c="dimmed" size="sm" mt="xs">
					Comece adicionando uma nova vacina ao catálogo
				</Text>
			</Paper>
		);
	}

	return (
		<Paper withBorder>
			<Table highlightOnHover>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Tipo</Table.Th>
						<Table.Th>Fabricante</Table.Th>
						<Table.Th>Data de Criação</Table.Th>
						<Table.Th w={120}>Ações</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{vaccines.map((vaccine) => (
						<Table.Tr key={vaccine.id}>
							<Table.Td>
								<Text fw={500}>{vaccine.type}</Text>
							</Table.Td>
							<Table.Td>
								<Text>{vaccine.manufacturer}</Text>
							</Table.Td>
							<Table.Td>
								<Text size="sm" c="dimmed">
									{formatDate(vaccine.created_at)}
								</Text>
							</Table.Td>
							<Table.Td>
								<Group gap="xs">
									<Tooltip label="Editar">
										<ActionIcon
											variant="subtle"
											color={CRUD_ACTION_COLORS.edit}
											size="sm"
											onClick={() => onEdit(vaccine)}
										>
											<FaEdit style={{ width: rem(16), height: rem(16) }} />
										</ActionIcon>
									</Tooltip>
									<Tooltip label="Exportar PDF">
										<ActionIcon
											variant="subtle"
											color={CRUD_ACTION_COLORS.export}
											size="sm"
											onClick={() => onExportPdf(vaccine)}
										>
											<FaFileDownload
												style={{ width: rem(16), height: rem(16) }}
											/>
										</ActionIcon>
									</Tooltip>
									<Tooltip label="Excluir">
										<ActionIcon
											variant="subtle"
											color={CRUD_ACTION_COLORS.delete}
											size="sm"
											onClick={() => handleDelete(vaccine)}
										>
											<FaTrash style={{ width: rem(16), height: rem(16) }} />
										</ActionIcon>
									</Tooltip>
								</Group>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>

			{totalPages > 1 && (
				<Group justify="center" p="md">
					<Pagination
						value={page}
						onChange={onPageChange}
						total={totalPages}
						disabled={loading}
					/>
				</Group>
			)}
		</Paper>
	);
}
