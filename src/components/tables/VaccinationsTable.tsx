"use client";

import { CRUD_ACTION_COLORS } from "@/constants";
import type { VaccinationRecordWithDetails } from "@/types/vaccinations";
import { formatDateToBrazilian } from "@/utils/formatters";
import {
	ActionIcon,
	Group,
	Pagination,
	Paper,
	Stack,
	Table,
	Text,
	Tooltip,
	rem,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { FaEdit, FaFileDownload, FaTrash } from "react-icons/fa";

interface VaccinationsTableProps {
	vaccinations: VaccinationRecordWithDetails[];
	loading: boolean;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onEdit: (vaccination: VaccinationRecordWithDetails) => void;
	onDelete: (id: string) => void;
	onExportPdf: (vaccination: VaccinationRecordWithDetails) => void;
}

export function VaccinationsTable({
	vaccinations,
	loading,
	page,
	totalPages,
	onPageChange,
	onEdit,
	onDelete,
	onExportPdf,
}: VaccinationsTableProps) {
	const handleDelete = (vaccination: VaccinationRecordWithDetails) => {
		modals.openConfirmModal({
			title: "Confirmar exclusão",
			children: (
				<Text>
					Tem certeza que deseja excluir o registro de vacinação de{" "}
					<strong>{vaccination.patient.full_name}</strong> com a vacina{" "}
					<strong>{vaccination.vaccine.type}</strong>?
				</Text>
			),
			labels: { confirm: "Excluir", cancel: "Cancelar" },
			confirmProps: { color: "red" },
			onConfirm: () => {
				onDelete(vaccination.id);
				notifications.show({
					title: "Sucesso",
					message: "Vacinação excluída com sucesso",
					color: "green",
				});
			},
		});
	};

	if (loading) {
		return (
			<Paper p="md">
				<Text ta="center" c="dimmed">
					Carregando vacinações...
				</Text>
			</Paper>
		);
	}

	if (vaccinations.length === 0 && !loading) {
		return (
			<Paper p="xl" ta="center">
				<Text c="dimmed" size="lg">
					Nenhuma vacinação encontrada
				</Text>
				<Text c="dimmed" size="sm" mt="xs">
					Comece registrando uma nova vacinação
				</Text>
			</Paper>
		);
	}

	return (
		<Stack gap="md">
			<Paper withBorder>
				<Table.ScrollContainer minWidth="100%">
					<Table highlightOnHover>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Paciente</Table.Th>
								<Table.Th>Vacina</Table.Th>
								<Table.Th>Data da Dose</Table.Th>
								<Table.Th>Lote</Table.Th>
								<Table.Th>Local</Table.Th>
								<Table.Th w={120}>Ações</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{vaccinations.map((vaccination) => (
								<Table.Tr key={vaccination.id}>
									<Table.Td>
										<div>
											<Text fw={500}>{vaccination.patient.full_name}</Text>
											<Text size="sm" c="dimmed">
												CPF: {vaccination.patient.cpf}
											</Text>
										</div>
									</Table.Td>
									<Table.Td>
										<div>
											<Text fw={500}>{vaccination.vaccine.type}</Text>
											<Text size="sm" c="dimmed">
												{vaccination.vaccine.manufacturer}
											</Text>
										</div>
									</Table.Td>
									<Table.Td>
										<Text>{formatDateToBrazilian(vaccination.dose_date)}</Text>
									</Table.Td>
									<Table.Td>
										<Text>{vaccination.batch_number}</Text>
									</Table.Td>
									<Table.Td>
										<Text>{vaccination.location}</Text>
									</Table.Td>
									<Table.Td>
										<Group gap="xs">
											<Tooltip label="Editar">
												<ActionIcon
													variant="subtle"
													color={CRUD_ACTION_COLORS.edit}
													size="sm"
													onClick={() => onEdit(vaccination)}
												>
													<FaEdit style={{ width: rem(16), height: rem(16) }} />
												</ActionIcon>
											</Tooltip>
											<Tooltip label="Exportar PDF">
												<ActionIcon
													variant="subtle"
													color={CRUD_ACTION_COLORS.export}
													size="sm"
													onClick={() => onExportPdf(vaccination)}
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
													onClick={() => handleDelete(vaccination)}
												>
													<FaTrash
														style={{ width: rem(16), height: rem(16) }}
													/>
												</ActionIcon>
											</Tooltip>
										</Group>
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Table.ScrollContainer>
			</Paper>

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
		</Stack>
	);
}
