"use client";

import { CrudPageLayout, PatientsTable } from "@/components";
import { CRUD_BUTTON_LABELS } from "@/constants";
import { useCrudPage, usePdfExport } from "@/hooks";
import type { Patient } from "@/types/patients";
import { deletePatient, getPatients } from "./actions";

export default function PatientsPage() {
	const { exportPatientsToPdf, exportPatientToPdf } = usePdfExport();

	const {
		search,
		data: patients,
		isPending,
		error,
		handleAdd,
		handleEdit,
		handleDelete,
		handlePageChange,
		handleSearchChange,
	} = useCrudPage<Patient>({
		initialData: {
			data: [],
			count: 0,
			page: 1,
			limit: 10,
			totalPages: 0,
		},
		fetchData: getPatients,
		deleteItem: deletePatient,
		formRoute: "/patients/form",
		errorMessage: "Erro ao carregar pacientes. Tente novamente mais tarde.",
	});

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

	return (
		<CrudPageLayout
			title="Pacientes"
			addButtonLabel={CRUD_BUTTON_LABELS.patients}
			searchPlaceholder="Buscar por nome, CPF ou telefone..."
			searchValue={search}
			onSearchChange={handleSearchChange}
			onAdd={handleAdd}
			onExportAll={handleExportToPdf}
			error={error}
		>
			<PatientsTable
				patients={patients.data}
				loading={isPending}
				page={patients.page}
				totalPages={patients.totalPages}
				onPageChange={handlePageChange}
				onEdit={handleEdit}
				onDelete={handleDelete}
				onExportPdf={handleExportPatientToPdf}
			/>
		</CrudPageLayout>
	);
}
