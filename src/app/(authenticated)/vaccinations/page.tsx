"use client";

import { VaccinationsTable } from "@/components";
import { usePdfExport } from "@/hooks";
import type {
	VaccinationRecordWithDetails,
	VaccinationsResponse,
} from "@/types/vaccinations";
import {
	Button,
	Group,
	Paper,
	Stack,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FaFileDownload, FaPlus, FaSearch } from "react-icons/fa";
import { deleteVaccination, getVaccinations } from "./actions";

export default function VaccinationsPage() {
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [vaccinations, setVaccinations] = useState<VaccinationsResponse>({
		data: [],
		count: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	});
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { exportVaccinationsToPdf, exportVaccinationToPdf } = usePdfExport();

	useEffect(() => {
		startTransition(async () => {
			try {
				const response = await getVaccinations({
					search,
					page: currentPage,
					limit: 10,
				});
				setVaccinations(response);
				setError(null);
			} catch {
				setError("Erro ao carregar vacinações. Tente novamente mais tarde.");
			}
		});
	}, [search, currentPage]);

	const handleAddVaccination = () => {
		router.push("/vaccinations/form");
	};

	const handleExportToPdf = () => {
		if (vaccinations.data.length === 0) {
			return;
		}

		const title = search
			? `Vacinações - Busca: "${search}"`
			: "Registro de Vacinações";

		exportVaccinationsToPdf(vaccinations.data, { title });
	};

	const handleExportVaccinationToPdf = (
		vaccination: VaccinationRecordWithDetails
	) => {
		exportVaccinationToPdf(vaccination);
	};

	const handleEditVaccination = (vaccination: VaccinationRecordWithDetails) => {
		router.push(`/vaccinations/form?id=${vaccination.id}`);
	};

	const handleDeleteVaccination = async (id: string) => {
		startTransition(async () => {
			try {
				await deleteVaccination(id);
				// Recarregar a lista após exclusão
				const response = await getVaccinations({
					search,
					page: currentPage,
					limit: 10,
				});
				setVaccinations(response);
			} catch {
				setError("Erro ao excluir vacinação. Tente novamente mais tarde.");
			}
		});
	};

	return (
		<Stack gap="lg" py="md">
			<Paper p="md" withBorder>
				<Group justify="space-between" align="center">
					<div>
						<Title order={2}>Vacinações</Title>
						<Text c="dimmed" size="sm">
							Gerencie os registros de vacinação dos pacientes
						</Text>
					</div>
					<Group>
						<Button
							variant="outline"
							leftSection={<FaFileDownload size={16} />}
							onClick={handleExportToPdf}
							disabled={vaccinations.data.length === 0}
						>
							Exportar PDF
						</Button>
						<Button
							leftSection={<FaPlus size={16} />}
							onClick={handleAddVaccination}
						>
							Nova Vacinação
						</Button>
					</Group>
				</Group>
			</Paper>

			<Paper p="md" withBorder>
				<Group align="end">
					<TextInput
						placeholder="Buscar por paciente, vacina, lote ou local..."
						leftSection={<FaSearch size={16} />}
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
							{vaccinations.count}
						</Text>
						<Text size="sm" c="dimmed">
							Total de Vacinações
						</Text>
					</div>
					<div>
						<Text size="xl" fw={700} c="green">
							{vaccinations.data.length}
						</Text>
						<Text size="sm" c="dimmed">
							Nesta Página
						</Text>
					</div>
					{search && (
						<div>
							<Text size="xl" fw={700} c="orange">
								{vaccinations.count}
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

			<VaccinationsTable
				vaccinations={vaccinations.data}
				loading={isPending}
				page={currentPage}
				totalPages={vaccinations.totalPages}
				onPageChange={setCurrentPage}
				onEdit={handleEditVaccination}
				onDelete={handleDeleteVaccination}
				onExportPdf={handleExportVaccinationToPdf}
			/>
		</Stack>
	);
}
