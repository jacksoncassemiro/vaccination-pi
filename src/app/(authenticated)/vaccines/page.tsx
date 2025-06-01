"use client";

import { CrudPageLayout, VaccinesTable } from "@/components";
import { CRUD_BUTTON_LABELS } from "@/constants";
import { useCrudPage, usePdfExport } from "@/hooks";
import type { Vaccine } from "@/types/vaccines";
import { deleteVaccine, getVaccines } from "./actions";

export default function VaccinesPage() {
	const { exportVaccinesToPdf, exportVaccineToPdf } = usePdfExport();

	const {
		search,
		data: vaccines,
		isPending,
		error,
		handleAdd,
		handleEdit,
		handleDelete,
		handlePageChange,
		handleSearchChange,
	} = useCrudPage<Vaccine>({
		initialData: {
			data: [],
			count: 0,
			page: 1,
			limit: 10,
			totalPages: 0,
		},
		fetchData: getVaccines,
		deleteItem: deleteVaccine,
		formRoute: "/vaccines/form",
		errorMessage: "Erro ao carregar vacinas. Tente novamente mais tarde.",
	});

	const handleExportToPdf = () => {
		if (vaccines.data.length === 0) {
			return;
		}

		const title = search ? `Vacinas - Busca: "${search}"` : "Lista de Vacinas";

		exportVaccinesToPdf(vaccines.data, { title });
	};

	const handleExportVaccineToPdf = (vaccine: Vaccine) => {
		exportVaccineToPdf(vaccine);
	};

	return (
		<CrudPageLayout
			title="Vacinas"
			addButtonLabel={CRUD_BUTTON_LABELS.vaccines}
			searchPlaceholder="Buscar por tipo ou fabricante..."
			searchValue={search}
			onSearchChange={handleSearchChange}
			onAdd={handleAdd}
			onExportAll={handleExportToPdf}
			error={error}
		>
			<VaccinesTable
				vaccines={vaccines.data}
				loading={isPending}
				page={vaccines.page}
				totalPages={vaccines.totalPages}
				onPageChange={handlePageChange}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onExportPdf={handleExportVaccineToPdf}
			/>
		</CrudPageLayout>
	);
}
