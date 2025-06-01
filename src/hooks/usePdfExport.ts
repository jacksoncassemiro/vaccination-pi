import {
	PDF_COLUMN_WIDTHS,
	PDF_CONFIG,
	PDF_TABLE_HEADERS,
	PDF_TEXTS,
} from "@/constants";
import type { Patient } from "@/types/patients";
import type { VaccinationRecordWithDetails } from "@/types/vaccinations";
import type { Vaccine } from "@/types/vaccines";
import { formatDateToBrazilian } from "@/utils/formatters";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCallback } from "react";

// Estender o tipo jsPDF para incluir lastAutoTable
interface jsPDFWithAutoTable extends jsPDF {
	lastAutoTable: {
		finalY: number;
	};
}

export interface PdfExportOptions {
	title?: string;
	includeHeader?: boolean;
	includeFooter?: boolean;
	orientation?: "portrait" | "landscape";
}

export interface DashboardData {
	stats: {
		totalPatients: number;
		totalVaccines: number;
		totalVaccinations: number;
	};
	vaccinationsByType: Array<{ name: string; value: number; color: string }>;
	vaccinationsByMonth: Array<{ month: string; vacinações: number }>;
	patientsByAge: Array<{ group: string; pacientes: number }>;
	healthIndicators: {
		vaccinations7Days: number;
		vaccinations30Days: number;
		activePatients: number;
		inactivePatients: number;
		vaccinationRate: number;
		trends: {
			weeklyGrowth: number;
			monthlyTotal: number;
		};
	} | null;
	weeklyTrends: Array<{ semana: string; vacinações: number }>;
	hourlyDistribution: Array<{ hour: string; vacinações: number }>;
	locationDistribution: Array<{ name: string; value: number; color: string }>;
}

export function usePdfExport() {
	const exportPatientsToPdf = useCallback(
		(patients: Patient[], options: PdfExportOptions = {}) => {
			const {
				title = "Lista de Pacientes",
				includeHeader = true,
				includeFooter = true,
				orientation = PDF_CONFIG.DEFAULT_ORIENTATION,
			} = options;

			// Criar documento PDF
			const doc = new jsPDF({
				orientation,
				unit: PDF_CONFIG.DEFAULT_UNIT,
				format: PDF_CONFIG.DEFAULT_FORMAT,
			});

			// Configurações de fonte
			doc.setFont(PDF_CONFIG.FONT_FAMILY);
			let currentY = PDF_CONFIG.MARGINS.TOP;

			// Cabeçalho
			if (includeHeader) {
				doc.setFontSize(PDF_CONFIG.FONT_SIZES.TITLE);
				doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
				doc.text(title, PDF_CONFIG.MARGINS.LEFT, currentY);
				currentY += 10;

				doc.setFontSize(PDF_CONFIG.FONT_SIZES.NORMAL);
				doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);
				doc.text(
					`${PDF_TEXTS.GENERATED_AT} ${new Date().toLocaleDateString(
						"pt-BR"
					)} ${PDF_TEXTS.AT_TIME} ${new Date().toLocaleTimeString("pt-BR")}`,
					PDF_CONFIG.MARGINS.LEFT,
					currentY
				);
				currentY += 10;

				doc.text(
					`${PDF_TEXTS.TOTAL_PATIENTS} ${patients.length}`,
					PDF_CONFIG.MARGINS.LEFT,
					currentY
				);
				currentY += 15;
			} // Preparar dados para a tabela
			const tableData = patients.map((patient) => [
				patient.full_name,
				patient.cpf,
				formatDateToBrazilian(patient.birth_date),
				patient.phone,
				`${patient.street}, ${patient.number}${
					patient.complement ? `, ${patient.complement}` : ""
				}`,
				`${patient.neighborhood} - ${patient.city}/${patient.state}`,
				patient.cep,
			]); // Criar tabela
			autoTable(doc, {
				head: [PDF_TABLE_HEADERS.PATIENTS],
				body: tableData,
				startY: currentY,
				styles: {
					fontSize: PDF_CONFIG.FONT_SIZES.TINY,
					cellPadding: PDF_CONFIG.TABLE.CELL_PADDING,
				},
				headStyles: {
					fillColor: PDF_CONFIG.COLORS.PRIMARY,
					textColor: PDF_CONFIG.COLORS.WHITE,
					fontStyle: PDF_CONFIG.FONT_STYLES.BOLD,
				},
				alternateRowStyles: {
					fillColor: PDF_CONFIG.COLORS.ALTERNATE_ROW,
				},
				columnStyles: {
					0: { cellWidth: PDF_COLUMN_WIDTHS.PATIENTS.NAME },
					1: { cellWidth: PDF_COLUMN_WIDTHS.PATIENTS.CPF },
					2: { cellWidth: PDF_COLUMN_WIDTHS.PATIENTS.BIRTH_DATE },
					3: { cellWidth: PDF_COLUMN_WIDTHS.PATIENTS.PHONE },
					4: { cellWidth: PDF_COLUMN_WIDTHS.PATIENTS.ADDRESS },
					5: { cellWidth: PDF_COLUMN_WIDTHS.PATIENTS.NEIGHBORHOOD_CITY },
					6: { cellWidth: PDF_COLUMN_WIDTHS.PATIENTS.CEP },
				},
				margin: {
					top: PDF_CONFIG.MARGINS.TOP,
					right: PDF_CONFIG.MARGINS.RIGHT,
					bottom: PDF_CONFIG.MARGINS.BOTTOM,
					left: PDF_CONFIG.MARGINS.LEFT,
				},
			});

			// Rodapé
			if (includeFooter) {
				const pageCount = doc.getNumberOfPages();
				for (let i = 1; i <= pageCount; i++) {
					doc.setPage(i);
					const pageHeight = doc.internal.pageSize.height;
					doc.setFontSize(10);
					doc.setFont("helvetica", "normal");
					doc.text(`Página ${i} de ${pageCount}`, 14, pageHeight - 10);
					doc.text(
						"Sistema de Vacinação",
						doc.internal.pageSize.width - 14,
						pageHeight - 10,
						{ align: "right" }
					);
				}
			}

			// Salvar o arquivo
			const fileName = `pacientes_${
				new Date().toISOString().split("T")[0]
			}.pdf`;
			doc.save(fileName);
		},
		[]
	);
	const exportPatientToPdf = useCallback((patient: Patient) => {
		const doc = new jsPDF({
			orientation: "portrait",
			unit: PDF_CONFIG.DEFAULT_UNIT,
			format: PDF_CONFIG.DEFAULT_FORMAT,
		});

		doc.setFont(PDF_CONFIG.FONT_FAMILY);
		let currentY = PDF_CONFIG.MARGINS.TOP;

		// Título
		doc.setFontSize(PDF_CONFIG.FONT_SIZES.TITLE);
		doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
		doc.text("Ficha do Paciente", PDF_CONFIG.MARGINS.LEFT, currentY);
		currentY += 15;

		// Informações do paciente
		doc.setFontSize(PDF_CONFIG.FONT_SIZES.NORMAL);
		doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);

		const info = [
			["Nome Completo:", patient.full_name],
			["CPF:", patient.cpf],
			["Data de Nascimento:", formatDateToBrazilian(patient.birth_date)],
			["Telefone:", patient.phone],
			["CEP:", patient.cep],
			["Endereço:", `${patient.street}, ${patient.number}`],
			["Complemento:", patient.complement || PDF_TEXTS.NOT_APPLICABLE],
			["Bairro:", patient.neighborhood],
			["Cidade:", patient.city],
			["Estado:", patient.state],
		];

		info.forEach(([label, value]) => {
			doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
			doc.text(label, PDF_CONFIG.MARGINS.LEFT, currentY);
			doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);
			doc.text(value, 60, currentY);
			currentY += 8;
		});

		// Data de geração
		currentY += 10;
		doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL);
		doc.text(
			`${PDF_TEXTS.GENERATED_AT} ${new Date().toLocaleDateString("pt-BR")} ${
				PDF_TEXTS.AT_TIME
			} ${new Date().toLocaleTimeString("pt-BR")}`,
			PDF_CONFIG.MARGINS.LEFT,
			currentY
		);

		// Salvar
		const fileName = `paciente_${patient.full_name.replace(/\s+/g, "_")}_${
			new Date().toISOString().split("T")[0]
		}.pdf`;
		doc.save(fileName);
	}, []);
	const exportVaccinesToPdf = useCallback(
		(vaccines: Vaccine[], options: PdfExportOptions = {}) => {
			const {
				title = "Catálogo de Vacinas",
				includeHeader = true,
				includeFooter = true,
				orientation = PDF_CONFIG.DEFAULT_ORIENTATION,
			} = options;

			// Criar documento PDF
			const doc = new jsPDF({
				orientation,
				unit: PDF_CONFIG.DEFAULT_UNIT,
				format: PDF_CONFIG.DEFAULT_FORMAT,
			});

			// Configurações de fonte
			doc.setFont(PDF_CONFIG.FONT_FAMILY);

			let currentY = PDF_CONFIG.MARGINS.TOP;

			// Cabeçalho
			if (includeHeader) {
				doc.setFontSize(PDF_CONFIG.FONT_SIZES.TITLE);
				doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
				doc.text(title, PDF_CONFIG.MARGINS.LEFT, currentY);
				currentY += 10;

				doc.setFontSize(PDF_CONFIG.FONT_SIZES.NORMAL);
				doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);
				doc.text(
					`${PDF_TEXTS.GENERATED_AT} ${new Date().toLocaleDateString(
						"pt-BR"
					)} ${PDF_TEXTS.AT_TIME} ${new Date().toLocaleTimeString("pt-BR")}`,
					PDF_CONFIG.MARGINS.LEFT,
					currentY
				);
				currentY += 10;

				doc.text(
					`${PDF_TEXTS.TOTAL_VACCINES} ${vaccines.length}`,
					PDF_CONFIG.MARGINS.LEFT,
					currentY
				);
				currentY += 15;
			}

			// Preparar dados para a tabela
			const tableData = vaccines.map((vaccine) => [
				vaccine.type,
				vaccine.manufacturer,
				formatDateToBrazilian(vaccine.created_at),
				formatDateToBrazilian(vaccine.updated_at),
			]);

			// Criar tabela
			autoTable(doc, {
				head: [PDF_TABLE_HEADERS.VACCINES],
				body: tableData,
				startY: currentY,
				styles: {
					fontSize: PDF_CONFIG.FONT_SIZES.SMALL,
					cellPadding: PDF_CONFIG.TABLE.HEAD_CELL_PADDING,
				},
				headStyles: {
					fillColor: PDF_CONFIG.COLORS.PRIMARY,
					textColor: PDF_CONFIG.COLORS.WHITE,
					fontStyle: PDF_CONFIG.FONT_STYLES.BOLD,
				},
				alternateRowStyles: {
					fillColor: PDF_CONFIG.COLORS.ALTERNATE_ROW,
				},
				columnStyles: {
					0: { cellWidth: PDF_COLUMN_WIDTHS.VACCINES.TYPE },
					1: { cellWidth: PDF_COLUMN_WIDTHS.VACCINES.MANUFACTURER },
					2: { cellWidth: PDF_COLUMN_WIDTHS.VACCINES.CREATED_AT },
					3: { cellWidth: PDF_COLUMN_WIDTHS.VACCINES.UPDATED_AT },
				},
				margin: {
					top: PDF_CONFIG.MARGINS.TOP,
					right: PDF_CONFIG.MARGINS.RIGHT,
					bottom: PDF_CONFIG.MARGINS.BOTTOM,
					left: PDF_CONFIG.MARGINS.LEFT,
				},
			});

			// Rodapé
			if (includeFooter) {
				const pageCount = doc.getNumberOfPages();
				for (let i = 1; i <= pageCount; i++) {
					doc.setPage(i);
					const pageHeight = doc.internal.pageSize.height;
					doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL);
					doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);
					doc.text(
						`${PDF_TEXTS.PAGE} ${i} ${PDF_TEXTS.OF} ${pageCount}`,
						PDF_CONFIG.MARGINS.LEFT,
						pageHeight - 10
					);
					doc.text(
						PDF_TEXTS.SYSTEM_NAME,
						doc.internal.pageSize.width - PDF_CONFIG.MARGINS.RIGHT,
						pageHeight - 10,
						{ align: "right" }
					);
				}
			}

			// Salvar o arquivo
			const fileName = `vacinas_${new Date().toISOString().split("T")[0]}.pdf`;
			doc.save(fileName);
		},
		[]
	);
	const exportVaccineToPdf = useCallback((vaccine: Vaccine) => {
		const doc = new jsPDF({
			orientation: "portrait",
			unit: PDF_CONFIG.DEFAULT_UNIT,
			format: PDF_CONFIG.DEFAULT_FORMAT,
		});

		doc.setFont(PDF_CONFIG.FONT_FAMILY);
		let currentY = PDF_CONFIG.MARGINS.TOP;

		// Título
		doc.setFontSize(PDF_CONFIG.FONT_SIZES.TITLE);
		doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
		doc.text("Ficha da Vacina", PDF_CONFIG.MARGINS.LEFT, currentY);
		currentY += 15;

		// Informações da vacina
		doc.setFontSize(PDF_CONFIG.FONT_SIZES.NORMAL);
		doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);

		const info = [
			["Tipo da Vacina:", vaccine.type],
			["Fabricante:", vaccine.manufacturer],
			["Data de Criação:", formatDateToBrazilian(vaccine.created_at)],
			["Última Atualização:", formatDateToBrazilian(vaccine.updated_at)],
			["ID do Sistema:", vaccine.id],
		];

		info.forEach(([label, value]) => {
			doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
			doc.text(label, PDF_CONFIG.MARGINS.LEFT, currentY);
			doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);
			doc.text(value, 60, currentY);
			currentY += 8;
		});

		// Data de geração
		currentY += 10;
		doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL);
		doc.text(
			`${PDF_TEXTS.GENERATED_AT} ${new Date().toLocaleDateString("pt-BR")} ${
				PDF_TEXTS.AT_TIME
			} ${new Date().toLocaleTimeString("pt-BR")}`,
			PDF_CONFIG.MARGINS.LEFT,
			currentY
		);

		// Salvar
		const fileName = `vacina_${vaccine.type.replace(/\s+/g, "_")}_${
			new Date().toISOString().split("T")[0]
		}.pdf`;
		doc.save(fileName);
	}, []);
	const exportVaccinationsToPdf = useCallback(
		(
			vaccinations: VaccinationRecordWithDetails[],
			options: PdfExportOptions = {}
		) => {
			const {
				title = "Registro de Vacinações",
				includeHeader = true,
				includeFooter = true,
				orientation = PDF_CONFIG.DEFAULT_ORIENTATION,
			} = options;

			// Criar documento PDF
			const doc = new jsPDF({
				orientation,
				unit: PDF_CONFIG.DEFAULT_UNIT,
				format: PDF_CONFIG.DEFAULT_FORMAT,
			});

			// Configurações de fonte
			doc.setFont(PDF_CONFIG.FONT_FAMILY);

			let currentY = PDF_CONFIG.MARGINS.TOP;

			// Cabeçalho
			if (includeHeader) {
				doc.setFontSize(PDF_CONFIG.FONT_SIZES.TITLE);
				doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
				doc.text(title, PDF_CONFIG.MARGINS.LEFT, currentY);
				currentY += 10;

				doc.setFontSize(PDF_CONFIG.FONT_SIZES.NORMAL);
				doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);
				doc.text(
					`${PDF_TEXTS.GENERATED_AT} ${new Date().toLocaleDateString(
						"pt-BR"
					)} ${PDF_TEXTS.AT_TIME} ${new Date().toLocaleTimeString("pt-BR")}`,
					PDF_CONFIG.MARGINS.LEFT,
					currentY
				);
				currentY += 10;

				doc.text(
					`${PDF_TEXTS.TOTAL_VACCINATIONS} ${vaccinations.length}`,
					PDF_CONFIG.MARGINS.LEFT,
					currentY
				);
				currentY += 15;
			}

			// Preparar dados para a tabela
			const tableData = vaccinations.map((vaccination) => [
				vaccination.patient.full_name,
				vaccination.patient.cpf,
				vaccination.vaccine.type,
				vaccination.vaccine.manufacturer,
				formatDateToBrazilian(vaccination.dose_date),
				vaccination.batch_number,
				vaccination.location,
				vaccination.notes || PDF_TEXTS.DASH,
			]);

			// Criar tabela
			autoTable(doc, {
				head: [PDF_TABLE_HEADERS.VACCINATIONS],
				body: tableData,
				startY: currentY,
				styles: {
					fontSize: PDF_CONFIG.FONT_SIZES.TINY,
					cellPadding: PDF_CONFIG.TABLE.ALTERNATE_ROW_PADDING,
				},
				headStyles: {
					fillColor: PDF_CONFIG.COLORS.PRIMARY,
					textColor: PDF_CONFIG.COLORS.WHITE,
					fontStyle: PDF_CONFIG.FONT_STYLES.BOLD,
				},
				alternateRowStyles: {
					fillColor: PDF_CONFIG.COLORS.ALTERNATE_ROW,
				},
				columnStyles: {
					0: { cellWidth: PDF_COLUMN_WIDTHS.VACCINATIONS.PATIENT },
					1: { cellWidth: PDF_COLUMN_WIDTHS.VACCINATIONS.CPF },
					2: { cellWidth: PDF_COLUMN_WIDTHS.VACCINATIONS.VACCINE },
					3: { cellWidth: PDF_COLUMN_WIDTHS.VACCINATIONS.MANUFACTURER },
					4: { cellWidth: PDF_COLUMN_WIDTHS.VACCINATIONS.DOSE_DATE },
					5: { cellWidth: PDF_COLUMN_WIDTHS.VACCINATIONS.BATCH },
					6: { cellWidth: PDF_COLUMN_WIDTHS.VACCINATIONS.LOCATION },
					7: { cellWidth: PDF_COLUMN_WIDTHS.VACCINATIONS.NOTES },
				},
				margin: {
					top: PDF_CONFIG.MARGINS.TOP,
					right: PDF_CONFIG.MARGINS.RIGHT,
					bottom: PDF_CONFIG.MARGINS.BOTTOM,
					left: PDF_CONFIG.MARGINS.LEFT,
				},
			});

			// Rodapé
			if (includeFooter) {
				const pageCount = doc.getNumberOfPages();
				for (let i = 1; i <= pageCount; i++) {
					doc.setPage(i);
					const pageHeight = doc.internal.pageSize.height;
					doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL);
					doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);
					doc.text(
						`${PDF_TEXTS.PAGE} ${i} ${PDF_TEXTS.OF} ${pageCount}`,
						PDF_CONFIG.MARGINS.LEFT,
						pageHeight - 10
					);
					doc.text(
						PDF_TEXTS.SYSTEM_NAME,
						doc.internal.pageSize.width - PDF_CONFIG.MARGINS.RIGHT,
						pageHeight - 10,
						{ align: "right" }
					);
				}
			}

			// Salvar o arquivo
			const fileName = `vacinacoes_${
				new Date().toISOString().split("T")[0]
			}.pdf`;
			doc.save(fileName);
		},
		[]
	);
	const exportVaccinationToPdf = useCallback(
		(vaccination: VaccinationRecordWithDetails) => {
			const doc = new jsPDF({
				orientation: "portrait",
				unit: PDF_CONFIG.DEFAULT_UNIT,
				format: PDF_CONFIG.DEFAULT_FORMAT,
			});

			doc.setFont(PDF_CONFIG.FONT_FAMILY);
			let currentY = PDF_CONFIG.MARGINS.TOP;

			// Título
			doc.setFontSize(PDF_CONFIG.FONT_SIZES.TITLE);
			doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
			doc.text("Comprovante de Vacinação", PDF_CONFIG.MARGINS.LEFT, currentY);
			currentY += 20;

			// Informações do paciente
			doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE);
			doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
			doc.text("DADOS DO PACIENTE", PDF_CONFIG.MARGINS.LEFT, currentY);
			currentY += 10;

			doc.setFontSize(PDF_CONFIG.FONT_SIZES.NORMAL);
			doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);

			const patientInfo = [
				["Nome:", vaccination.patient.full_name],
				["CPF:", vaccination.patient.cpf],
			];

			patientInfo.forEach(([label, value]) => {
				doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
				doc.text(label, PDF_CONFIG.MARGINS.LEFT, currentY);
				doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);
				doc.text(value, 50, currentY);
				currentY += 8;
			});

			currentY += 10;

			// Informações da vacinação
			doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE);
			doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
			doc.text("DADOS DA VACINAÇÃO", PDF_CONFIG.MARGINS.LEFT, currentY);
			currentY += 10;

			doc.setFontSize(PDF_CONFIG.FONT_SIZES.NORMAL);
			doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);

			const vaccinationInfo = [
				["Vacina:", vaccination.vaccine.type],
				["Fabricante:", vaccination.vaccine.manufacturer],
				["Data da Dose:", formatDateToBrazilian(vaccination.dose_date)],
				["Lote:", vaccination.batch_number],
				["Local:", vaccination.location],
				["Observações:", vaccination.notes || PDF_TEXTS.NO_OBSERVATIONS],
			];

			vaccinationInfo.forEach(([label, value]) => {
				doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
				doc.text(label, PDF_CONFIG.MARGINS.LEFT, currentY);
				doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);

				// Quebrar texto longo em múltiplas linhas
				const maxWidth = 140;
				const lines = doc.splitTextToSize(value, maxWidth);
				doc.text(lines, 60, currentY);
				currentY += lines.length * 6 + 2;
			});

			// Data de geração
			currentY += 20;
			doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL);
			doc.text(
				`Documento gerado em: ${new Date().toLocaleDateString("pt-BR")} ${
					PDF_TEXTS.AT_TIME
				} ${new Date().toLocaleTimeString("pt-BR")}`,
				PDF_CONFIG.MARGINS.LEFT,
				currentY
			);

			// Salvar
			const fileName = `vacinacao_${vaccination.patient.full_name.replace(
				/\s+/g,
				"_"
			)}_${new Date().toISOString().split("T")[0]}.pdf`;
			doc.save(fileName);
		},
		[]
	);
	const exportDashboardToPdf = useCallback(
		async (
			dashboardData: DashboardData,
			filters?: {
				period?: string;
				vaccineType?: string;
				ageGroup?: string;
				patientId?: string;
			},
			options: PdfExportOptions = {}
		) => {
			const {
				title = "Relatório do Dashboard - Sistema de Vacinação",
				includeHeader = true,
				includeFooter = true,
				orientation = "portrait",
			} = options;

			try {
				const doc = new jsPDF({
					orientation,
					unit: PDF_CONFIG.DEFAULT_UNIT,
					format: PDF_CONFIG.DEFAULT_FORMAT,
				});

				doc.setFont(PDF_CONFIG.FONT_FAMILY);
				let currentY = PDF_CONFIG.MARGINS.TOP;
				const pageWidth = doc.internal.pageSize.width;
				const pageHeight = doc.internal.pageSize.height;

				// Cabeçalho
				if (includeHeader) {
					doc.setFontSize(16);
					doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
					doc.text(title, pageWidth / 2, currentY, { align: "center" });
					currentY += 10;

					doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL);
					doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);
					doc.text(
						`${PDF_TEXTS.GENERATED_AT} ${new Date().toLocaleDateString(
							"pt-BR"
						)} ${PDF_TEXTS.AT_TIME} ${new Date().toLocaleTimeString("pt-BR")}`,
						pageWidth / 2,
						currentY,
						{ align: "center" }
					);
					currentY += 15;

					// Informações dos filtros aplicados
					if (filters) {
						doc.setFontSize(PDF_CONFIG.FONT_SIZES.NORMAL);
						doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
						doc.text("Filtros Aplicados:", PDF_CONFIG.MARGINS.LEFT, currentY);
						currentY += 8;

						doc.setFontSize(PDF_CONFIG.FONT_SIZES.SMALL);
						doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);

						if (filters.period) {
							doc.text(
								`• Período: ${filters.period}`,
								PDF_CONFIG.MARGINS.LEFT,
								currentY
							);
							currentY += 6;
						}
						if (filters.vaccineType) {
							doc.text(
								`• Tipo de Vacina: ${filters.vaccineType}`,
								PDF_CONFIG.MARGINS.LEFT,
								currentY
							);
							currentY += 6;
						}
						if (filters.ageGroup) {
							doc.text(
								`• Faixa Etária: ${filters.ageGroup}`,
								PDF_CONFIG.MARGINS.LEFT,
								currentY
							);
							currentY += 6;
						}
						if (filters.patientId) {
							doc.text(
								`• Paciente Específico: ID ${filters.patientId}`,
								PDF_CONFIG.MARGINS.LEFT,
								currentY
							);
							currentY += 6;
						}
						currentY += 10;
					}
				}

				// Estatísticas Gerais
				doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE);
				doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
				doc.text("ESTATÍSTICAS GERAIS", PDF_CONFIG.MARGINS.LEFT, currentY);
				currentY += 10;

				const statsData = [
					[
						PDF_TEXTS.TOTAL_PATIENTS,
						dashboardData.stats.totalPatients.toString(),
					],
					[
						PDF_TEXTS.TOTAL_VACCINES,
						dashboardData.stats.totalVaccines.toString(),
					],
					[
						PDF_TEXTS.TOTAL_VACCINATIONS,
						dashboardData.stats.totalVaccinations.toString(),
					],
				];
				autoTable(doc, {
					body: statsData,
					startY: currentY,
					styles: {
						fontSize: PDF_CONFIG.FONT_SIZES.SMALL,
						cellPadding: PDF_CONFIG.TABLE.HEAD_CELL_PADDING,
					},
					columnStyles: {
						0: { fontStyle: PDF_CONFIG.FONT_STYLES.BOLD, cellWidth: 60 },
						1: { cellWidth: 40, halign: "center" },
					},
					theme: "grid",
				});

				currentY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

				// Indicadores de Saúde
				if (dashboardData.healthIndicators) {
					doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE);
					doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
					doc.text("INDICADORES DE SAÚDE", PDF_CONFIG.MARGINS.LEFT, currentY);
					currentY += 10;

					const healthData = [
						[
							"Vacinações (7 dias)",
							dashboardData.healthIndicators.vaccinations7Days.toString(),
						],
						[
							"Vacinações (30 dias)",
							dashboardData.healthIndicators.vaccinations30Days.toString(),
						],
						[
							"Pacientes Ativos",
							dashboardData.healthIndicators.activePatients.toString(),
						],
						[
							"Pacientes Inativos",
							dashboardData.healthIndicators.inactivePatients.toString(),
						],
						[
							"Taxa de Vacinação",
							`${dashboardData.healthIndicators.vaccinationRate.toFixed(1)}%`,
						],
						[
							"Crescimento Semanal",
							`${dashboardData.healthIndicators.trends.weeklyGrowth.toFixed(
								1
							)}%`,
						],
						[
							"Total Mensal",
							dashboardData.healthIndicators.trends.monthlyTotal.toString(),
						],
					];
					autoTable(doc, {
						body: healthData,
						startY: currentY,
						styles: {
							fontSize: PDF_CONFIG.FONT_SIZES.SMALL,
							cellPadding: PDF_CONFIG.TABLE.HEAD_CELL_PADDING,
						},
						columnStyles: {
							0: { fontStyle: PDF_CONFIG.FONT_STYLES.BOLD, cellWidth: 80 },
							1: { cellWidth: 40, halign: "center" },
						},
						theme: "grid",
					});

					currentY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;
				}

				// Verificar se precisa de nova página
				if (currentY > pageHeight - 60) {
					doc.addPage();
					currentY = 20;
				} // Vacinações por Tipo
				if (dashboardData.vaccinationsByType.length > 0) {
					doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE);
					doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
					doc.text("VACINAÇÕES POR TIPO", PDF_CONFIG.MARGINS.LEFT, currentY);
					currentY += 10;

					const typeData = dashboardData.vaccinationsByType.map((item) => [
						item.name,
						item.value.toString(),
						`${(
							(item.value / dashboardData.stats.totalVaccinations) *
							100
						).toFixed(1)}%`,
					]);
					autoTable(doc, {
						head: [["Tipo de Vacina", "Quantidade", "Percentual"]],
						body: typeData,
						startY: currentY,
						styles: {
							fontSize: PDF_CONFIG.FONT_SIZES.SMALL,
							cellPadding: PDF_CONFIG.TABLE.CELL_PADDING,
						},
						headStyles: {
							fillColor: PDF_CONFIG.COLORS.PRIMARY,
							textColor: PDF_CONFIG.COLORS.WHITE,
							fontStyle: PDF_CONFIG.FONT_STYLES.BOLD,
						},
						alternateRowStyles: {
							fillColor: PDF_CONFIG.COLORS.ALTERNATE_ROW,
						},
						columnStyles: {
							0: { cellWidth: 80 },
							1: { cellWidth: 30, halign: "center" },
							2: { cellWidth: 30, halign: "center" },
						},
					});

					currentY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;
				}

				// Verificar se precisa de nova página
				if (currentY > pageHeight - 60) {
					doc.addPage();
					currentY = PDF_CONFIG.MARGINS.TOP;
				}

				// Pacientes por Faixa Etária
				if (dashboardData.patientsByAge.length > 0) {
					doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE);
					doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
					doc.text(
						"PACIENTES POR FAIXA ETÁRIA",
						PDF_CONFIG.MARGINS.LEFT,
						currentY
					);
					currentY += 10;

					const ageData = dashboardData.patientsByAge.map((item) => [
						item.group,
						item.pacientes.toString(),
						`${(
							(item.pacientes / dashboardData.stats.totalPatients) *
							100
						).toFixed(1)}%`,
					]);
					autoTable(doc, {
						head: [["Faixa Etária", "Quantidade", "Percentual"]],
						body: ageData,
						startY: currentY,
						styles: {
							fontSize: PDF_CONFIG.FONT_SIZES.SMALL,
							cellPadding: PDF_CONFIG.TABLE.CELL_PADDING,
						},
						headStyles: {
							fillColor: PDF_CONFIG.COLORS.PRIMARY,
							textColor: PDF_CONFIG.COLORS.WHITE,
							fontStyle: PDF_CONFIG.FONT_STYLES.BOLD,
						},
						alternateRowStyles: {
							fillColor: PDF_CONFIG.COLORS.ALTERNATE_ROW,
						},
						columnStyles: {
							0: { cellWidth: 60 },
							1: { cellWidth: 30, halign: "center" },
							2: { cellWidth: 30, halign: "center" },
						},
					});

					currentY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;
				} // Nova página para dados mensais
				if (dashboardData.vaccinationsByMonth.length > 0) {
					doc.addPage();
					currentY = PDF_CONFIG.MARGINS.TOP;

					doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE);
					doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
					doc.text("VACINAÇÕES POR MÊS", PDF_CONFIG.MARGINS.LEFT, currentY);
					currentY += 10;

					const monthData = dashboardData.vaccinationsByMonth.map((item) => [
						item.month,
						item.vacinações.toString(),
					]);
					autoTable(doc, {
						head: [["Mês", "Vacinações"]],
						body: monthData,
						startY: currentY,
						styles: {
							fontSize: PDF_CONFIG.FONT_SIZES.SMALL,
							cellPadding: PDF_CONFIG.TABLE.CELL_PADDING,
						},
						headStyles: {
							fillColor: PDF_CONFIG.COLORS.PRIMARY,
							textColor: PDF_CONFIG.COLORS.WHITE,
							fontStyle: PDF_CONFIG.FONT_STYLES.BOLD,
						},
						alternateRowStyles: {
							fillColor: PDF_CONFIG.COLORS.ALTERNATE_ROW,
						},
						columnStyles: {
							0: { cellWidth: 80 },
							1: { cellWidth: 40, halign: "center" },
						},
					});

					currentY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;
				}

				// Distribuição por Local
				if (dashboardData.locationDistribution.length > 0) {
					if (currentY > pageHeight - 100) {
						doc.addPage();
						currentY = PDF_CONFIG.MARGINS.TOP;
					}

					doc.setFontSize(PDF_CONFIG.FONT_SIZES.SUBTITLE);
					doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.BOLD);
					doc.text("DISTRIBUIÇÃO POR LOCAL", PDF_CONFIG.MARGINS.LEFT, currentY);
					currentY += 10;

					const locationData = dashboardData.locationDistribution.map(
						(item) => [
							item.name,
							item.value.toString(),
							`${(
								(item.value / dashboardData.stats.totalVaccinations) *
								100
							).toFixed(1)}%`,
						]
					);

					autoTable(doc, {
						head: [["Local", "Quantidade", "Percentual"]],
						body: locationData,
						startY: currentY,
						styles: {
							fontSize: PDF_CONFIG.FONT_SIZES.SMALL,
							cellPadding: PDF_CONFIG.TABLE.CELL_PADDING,
						},
						headStyles: {
							fillColor: PDF_CONFIG.COLORS.PRIMARY,
							textColor: PDF_CONFIG.COLORS.WHITE,
							fontStyle: PDF_CONFIG.FONT_STYLES.BOLD,
						},
						alternateRowStyles: {
							fillColor: PDF_CONFIG.COLORS.ALTERNATE_ROW,
						},
						columnStyles: {
							0: { cellWidth: 80 },
							1: { cellWidth: 30, halign: "center" },
							2: { cellWidth: 30, halign: "center" },
						},
					});
				}

				// Rodapé
				if (includeFooter) {
					const pageCount = doc.getNumberOfPages();
					for (let i = 1; i <= pageCount; i++) {
						doc.setPage(i);
						doc.setFontSize(PDF_CONFIG.FONT_SIZES.TINY);
						doc.setFont(PDF_CONFIG.FONT_FAMILY, PDF_CONFIG.FONT_STYLES.NORMAL);
						doc.text(
							`${PDF_TEXTS.PAGE} ${i} ${PDF_TEXTS.OF} ${pageCount}`,
							PDF_CONFIG.MARGINS.LEFT,
							pageHeight - 10
						);
						doc.text(
							"Sistema de Vacinação - Relatório Dashboard",
							pageWidth - PDF_CONFIG.MARGINS.RIGHT,
							pageHeight - 10,
							{ align: "right" }
						);
					}
				}

				// Salvar o arquivo
				const fileName = `dashboard_relatorio_${
					new Date().toISOString().split("T")[0]
				}.pdf`;
				doc.save(fileName);

				return { success: true, fileName };
			} catch (error) {
				console.error("Erro ao gerar PDF do dashboard:", error);
				return {
					success: false,
					error: error instanceof Error ? error.message : "Erro desconhecido",
				};
			}
		},
		[]
	);

	return {
		exportPatientsToPdf,
		exportPatientToPdf,
		exportVaccinesToPdf,
		exportVaccineToPdf,
		exportVaccinationsToPdf,
		exportVaccinationToPdf,
		exportDashboardToPdf,
	};
}
