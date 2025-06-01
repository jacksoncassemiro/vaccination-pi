"use client";

import { CrudPageLayout, VaccinationsTable } from "@/components";
import { useCrudPage, usePdfExport } from "@/hooks";
import type { VaccinationRecordWithDetails } from "@/types/vaccinations";
import { deleteVaccination, getVaccinations } from "./actions";

export default function VaccinationsPage() {
	const { exportVaccinationsToPdf, exportVaccinationToPdf } = usePdfExport();

	const {
		search,
		data: vaccinations,
		isPending,
		error,
		handleAdd,
		handleEdit,
		handleDelete,
		handlePageChange,
		handleSearchChange,
	} = useCrudPage<VaccinationRecordWithDetails>({
		initialData: {
			data: [],
			count: 0,
			page: 1,
			limit: 10,
			totalPages: 0,
		},
		fetchData: getVaccinations,
		deleteItem: deleteVaccination,
		formRoute: "/vaccinations/form",
		errorMessage: "Erro ao carregar vacinações. Tente novamente mais tarde.",
	});

	const handleExportToPdf = () => {
		if (vaccinations.data.length === 0) {
			return;
		}

		const title = search
			? `Vacinações - Busca: "${search}"`
			: "Lista de Vacinações";

		exportVaccinationsToPdf(vaccinations.data, { title });
	};

	const handleExportVaccinationToPdf = (
		vaccination: VaccinationRecordWithDetails
	) => {
		exportVaccinationToPdf(vaccination);
	};

	return (
		<CrudPageLayout
			title="Vacinações"
			addButtonLabel="Nova Vacinação"
			searchPlaceholder="Buscar por paciente, vacina ou local..."
			searchValue={search}
			onSearchChange={handleSearchChange}
			onAdd={handleAdd}
			onExportAll={handleExportToPdf}
			error={error}
		>
			<VaccinationsTable
				vaccinations={vaccinations.data}
				loading={isPending}
				page={vaccinations.page}
				totalPages={vaccinations.totalPages}
				onPageChange={handlePageChange}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onExportPdf={handleExportVaccinationToPdf}
			/>
		</CrudPageLayout>
	);
}
