"use client";

import { PatientsTable } from "@/components/PatientsTable";
import { usePdfExport } from "@/hooks";
import type { Patient, PatientsResponse } from "@/types/patients";
import {
	Button,
	Group,
	Paper,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { FileDown, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { deletePatient, getPatients } from "./actions";

export default function PatientsPage() {
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [patients, setPatients] = useState<PatientsResponse>({
		data: [],
		count: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	});
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { exportPatientsToPdf, exportPatientToPdf } = usePdfExport();
	useEffect(() => {
		startTransition(async () => {
			try {
				const response = await getPatients({
					search,
					page: currentPage,
					limit: 10,
				});
				setPatients(response);
				setError(null);
			} catch {
				setError("Erro ao carregar pacientes. Tente novamente mais tarde.");
			}
		});
	}, [search, currentPage]);
	const handleAddPatient = () => {
		router.push("/patients/form");
	};
	const handleExportToPdf = () => {
		if (patients.data.length === 0) {
			return;
		}

		const title = search
			? `Pacientes - Busca: "${search}"`
			: "Lista de Pacientes";

		exportPatientsToPdf(patients.data, { title });
	};

	const handleExportPatientToPdf = (patient: Patient) => {
		exportPatientToPdf(patient);
	};

	const handleEditPatient = (patient: Patient) => {
		router.push(`/patients/form?id=${patient.id}`);
	};

	const handleDeletePatient = async (id: string) => {
		startTransition(async () => {
			try {
				await deletePatient(id);
				// Recarregar a lista após exclusão
				const response = await getPatients({
					search,
					page: currentPage,
					limit: 10,
				});
				setPatients(response);
			} catch {
				setError("Erro ao excluir paciente. Tente novamente mais tarde.");
			}
		});
	};

	return (
		<Stack gap="lg" py="md">
			<Paper p="md" withBorder>
				<Group justify="space-between" align="center">
					<div>
						<Title order={2}>Pacientes</Title>
						<Text c="dimmed" size="sm">
							Gerencie o cadastro de pacientes do sistema
						</Text>
					</div>
					<Group>
						<Button
							variant="outline"
							leftSection={<FileDown size={16} />}
							onClick={handleExportToPdf}
							disabled={patients.data.length === 0}
						>
							Exportar PDF
						</Button>
						<Button leftSection={<Plus size={16} />} onClick={handleAddPatient}>
							Novo Paciente
						</Button>
					</Group>
				</Group>
			</Paper>

			<Paper p="md" withBorder>
				<Group align="end">
					<TextInput
						placeholder="Buscar por nome, CPF ou telefone..."
						leftSection={<Search size={16} />}
						value={search}
						onChange={(event) => setSearch(event.currentTarget.value)}
						style={{ flex: 1 }}
					/>
				</Group>
			</Paper>
			<Paper p="md" withBorder>
				<Group gap="xl">
					<div>
						<Text size="xl" fw={700} c="blue">
							{patients.count}
						</Text>
						<Text size="sm" c="dimmed">
							Total de Pacientes
						</Text>
					</div>
					<div>
						<Text size="xl" fw={700} c="green">
							{patients.data.length}
						</Text>
						<Text size="sm" c="dimmed">
							Nesta Página
						</Text>
					</div>
					{search && (
						<div>
							<Text size="xl" fw={700} c="orange">
								{patients.count}
							</Text>
							<Text size="sm" c="dimmed">
								Resultados da Busca
							</Text>
						</div>
					)}
				</Group>
			</Paper>
			{error && (
				<Paper p="md" withBorder bg="red.0">
					<Text c="red" size="sm">
						{error}
					</Text>
				</Paper>
			)}
			<PatientsTable
				patients={patients.data}
				loading={isPending}
				page={currentPage}
				totalPages={patients.totalPages}
				onPageChange={setCurrentPage}
				onEdit={handleEditPatient}
				onDelete={handleDeletePatient}
				onExportPdf={handleExportPatientToPdf}
			/>
		</Stack>
	);
}
