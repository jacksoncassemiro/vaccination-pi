"use client";

import { VaccinesTable } from "@/components/VaccinesTable";
import { usePdfExport } from "@/hooks";
import type { Vaccine, VaccinesResponse } from "@/types/vaccines";
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
import { deleteVaccine, getVaccines } from "./actions";

export default function VaccinesPage() {
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [vaccines, setVaccines] = useState<VaccinesResponse>({
		data: [],
		count: 0,
		page: 1,
		limit: 10,
		totalPages: 0,
	});
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { exportVaccinesToPdf, exportVaccineToPdf } = usePdfExport();

	useEffect(() => {
		startTransition(async () => {
			try {
				const response = await getVaccines({
					search,
					page: currentPage,
					limit: 10,
				});
				setVaccines(response);
				setError(null);
			} catch {
				setError("Erro ao carregar vacinas. Tente novamente mais tarde.");
			}
		});
	}, [search, currentPage]);

	const handleAddVaccine = () => {
		router.push("/vaccines/form");
	};

	const handleExportToPdf = () => {
		if (vaccines.data.length === 0) {
			return;
		}

		const title = search
			? `Vacinas - Busca: "${search}"`
			: "Catálogo de Vacinas";

		exportVaccinesToPdf(vaccines.data, { title });
	};

	const handleExportVaccineToPdf = (vaccine: Vaccine) => {
		exportVaccineToPdf(vaccine);
	};

	const handleEditVaccine = (vaccine: Vaccine) => {
		router.push(`/vaccines/form?id=${vaccine.id}`);
	};

	const handleDeleteVaccine = async (id: string) => {
		startTransition(async () => {
			try {
				await deleteVaccine(id);
				// Recarregar a lista após exclusão
				const response = await getVaccines({
					search,
					page: currentPage,
					limit: 10,
				});
				setVaccines(response);
			} catch {
				setError("Erro ao excluir vacina. Tente novamente mais tarde.");
			}
		});
	};

	return (
		<Stack gap="lg" py="md">
			<Paper p="md" withBorder>
				<Group justify="space-between" align="center">
					<div>
						<Title order={2}>Vacinas</Title>
						<Text c="dimmed" size="sm">
							Gerencie o catálogo de vacinas disponíveis no sistema
						</Text>
					</div>
					<Group>
						<Button
							variant="outline"
							leftSection={<FaFileDownload size={16} />}
							onClick={handleExportToPdf}
							disabled={vaccines.data.length === 0}
						>
							Exportar PDF
						</Button>
						<Button
							leftSection={<FaPlus size={16} />}
							onClick={handleAddVaccine}
						>
							Nova Vacina
						</Button>
					</Group>
				</Group>
			</Paper>

			<Paper p="md" withBorder>
				<Group align="end">
					<TextInput
						placeholder="Buscar por tipo ou fabricante..."
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
							{vaccines.count}
						</Text>
						<Text size="sm" c="dimmed">
							Total de Vacinas
						</Text>
					</div>
					<div>
						<Text size="xl" fw={700} c="green">
							{vaccines.data.length}
						</Text>
						<Text size="sm" c="dimmed">
							Nesta Página
						</Text>
					</div>
					{search && (
						<div>
							<Text size="xl" fw={700} c="orange">
								{vaccines.count}
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

			<VaccinesTable
				vaccines={vaccines.data}
				loading={isPending}
				page={currentPage}
				totalPages={vaccines.totalPages}
				onPageChange={setCurrentPage}
				onEdit={handleEditVaccine}
				onDelete={handleDeleteVaccine}
				onExportPdf={handleExportVaccineToPdf}
			/>
		</Stack>
	);
}
