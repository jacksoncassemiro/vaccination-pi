"use client";

import type { Patient } from "@/types/patients";
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

interface PatientsTableProps {
	patients: Patient[];
	loading: boolean;
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onEdit: (patient: Patient) => void;
	onDelete: (id: string) => Promise<void>;
	onExportPdf?: (patient: Patient) => void;
}

function formatCpf(cpf: string): string {
	return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatPhone(phone: string): string {
	const cleaned = phone.replace(/\D/g, "");
	if (cleaned.length === 11) {
		return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
	}
	return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
}

function calculateAge(birthDate: string): number {
	const today = new Date();
	const birth = new Date(birthDate);
	let age = today.getFullYear() - birth.getFullYear();
	const monthDiff = today.getMonth() - birth.getMonth();

	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
		age--;
	}

	return age;
}

export function PatientsTable({
	patients,
	loading,
	page,
	totalPages,
	onPageChange,
	onEdit,
	onDelete,
	onExportPdf,
}: PatientsTableProps) {
	const handleDelete = (patient: Patient) => {
		modals.openConfirmModal({
			title: "Excluir Paciente",
			children: (
				<Text size="sm">
					Tem certeza que deseja excluir o paciente{" "}
					<strong>{patient.full_name}</strong>? Esta ação não pode ser desfeita.
				</Text>
			),
			labels: { confirm: "Excluir", cancel: "Cancelar" },
			confirmProps: { color: "red" },
			onConfirm: async () => {
				try {
					await onDelete(patient.id);
					notifications.show({
						title: "Sucesso",
						message: "Paciente excluído com sucesso!",
						color: "green",
					});
				} catch (error) {
					notifications.show({
						title: "Erro",
						message:
							error instanceof Error
								? error.message
								: "Erro ao excluir paciente",
						color: "red",
					});
				}
			},
		});
	};

	if (loading) {
		return (
			<Paper p="md">
				<Text ta="center" c="dimmed">
					Carregando pacientes...
				</Text>
			</Paper>
		);
	}

	if (patients.length === 0) {
		return (
			<Paper p="xl">
				<Text ta="center" c="dimmed" size="lg">
					Nenhum paciente encontrado
				</Text>
				<Text ta="center" c="dimmed" size="sm" mt="xs">
					Adicione um novo paciente para começar
				</Text>
			</Paper>
		);
	}

	return (
		<Stack gap="md">
			<Paper shadow="xs" withBorder>
				<Table.ScrollContainer minWidth={800}>
					<Table verticalSpacing="sm" horizontalSpacing="md">
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Nome</Table.Th>
								<Table.Th>CPF</Table.Th>
								<Table.Th>Idade</Table.Th>
								<Table.Th>Telefone</Table.Th>
								<Table.Th>Cidade</Table.Th>
								<Table.Th>Ações</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{patients.map((patient) => (
								<Table.Tr key={patient.id}>
									<Table.Td>
										<div>
											<Text fw={500} size="sm">
												{patient.full_name}
											</Text>
											<Text size="xs" c="dimmed">
												{patient.neighborhood}, {patient.city} - {patient.state}
											</Text>
										</div>
									</Table.Td>
									<Table.Td>
										<Text size="sm" ff="monospace">
											{formatCpf(patient.cpf)}
										</Text>
									</Table.Td>
									<Table.Td>
										<Text size="sm">
											{calculateAge(patient.birth_date)} anos
										</Text>
									</Table.Td>
									<Table.Td>
										<Text size="sm">{formatPhone(patient.phone)}</Text>
									</Table.Td>
									<Table.Td>
										<Text size="sm">
											{patient.city} - {patient.state}
										</Text>
									</Table.Td>
									<Table.Td>
										<Group gap="xs">
											<Tooltip label="Editar paciente">
												<ActionIcon
													variant="subtle"
													color="blue"
													size="sm"
													onClick={() => onEdit(patient)}
												>
													<FaEdit style={{ width: rem(16), height: rem(16) }} />
												</ActionIcon>
											</Tooltip>
											{onExportPdf && (
												<Tooltip label="Exportar PDF">
													<ActionIcon
														variant="subtle"
														color="green"
														size="sm"
														onClick={() => onExportPdf(patient)}
													>
														{" "}
														<FaFileDownload
															style={{ width: rem(16), height: rem(16) }}
														/>
													</ActionIcon>
												</Tooltip>
											)}
											<Tooltip label="Excluir paciente">
												<ActionIcon
													variant="subtle"
													color="red"
													size="sm"
													onClick={() => handleDelete(patient)}
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
				<Group justify="center">
					<Pagination
						value={page}
						onChange={onPageChange}
						total={totalPages}
						size="sm"
					/>
				</Group>
			)}
		</Stack>
	);
}
