import type { Patient } from "@/types/patients";
import type { VaccinationRecordWithDetails } from "@/types/vaccinations";
import type { Vaccine } from "@/types/vaccines";
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
				orientation = "landscape",
			} = options;

			// Criar documento PDF
			const doc = new jsPDF({
				orientation,
				unit: "mm",
				format: "a4",
			});

			// Configurações de fonte
			doc.setFont("helvetica");

			let currentY = 20;

			// Cabeçalho
			if (includeHeader) {
				doc.setFontSize(20);
				doc.setFont("helvetica", "bold");
				doc.text(title, 14, currentY);
				currentY += 10;

				doc.setFontSize(12);
				doc.setFont("helvetica", "normal");
				doc.text(
					`Gerado em: ${new Date().toLocaleDateString(
						"pt-BR"
					)} às ${new Date().toLocaleTimeString("pt-BR")}`,
					14,
					currentY
				);
				currentY += 10;

				doc.text(`Total de pacientes: ${patients.length}`, 14, currentY);
				currentY += 15;
			}

			// Preparar dados para a tabela
			const tableData = patients.map((patient) => [
				patient.full_name,
				patient.cpf,
				new Date(patient.birth_date).toLocaleDateString("pt-BR"),
				patient.phone,
				`${patient.street}, ${patient.number}${
					patient.complement ? `, ${patient.complement}` : ""
				}`,
				`${patient.neighborhood} - ${patient.city}/${patient.state}`,
				patient.cep,
			]);

			// Criar tabela
			autoTable(doc, {
				head: [
					[
						"Nome Completo",
						"CPF",
						"Data de Nascimento",
						"Telefone",
						"Endereço",
						"Bairro/Cidade",
						"CEP",
					],
				],
				body: tableData,
				startY: currentY,
				styles: {
					fontSize: 8,
					cellPadding: 3,
				},
				headStyles: {
					fillColor: [79, 70, 229], // Cor azul do tema
					textColor: 255,
					fontStyle: "bold",
				},
				alternateRowStyles: {
					fillColor: [245, 245, 245],
				},
				columnStyles: {
					0: { cellWidth: 40 }, // Nome
					1: { cellWidth: 25 }, // CPF
					2: { cellWidth: 25 }, // Data
					3: { cellWidth: 25 }, // Telefone
					4: { cellWidth: 45 }, // Endereço
					5: { cellWidth: 40 }, // Bairro/Cidade
					6: { cellWidth: 20 }, // CEP
				},
				margin: { top: 20, right: 14, bottom: 20, left: 14 },
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
			unit: "mm",
			format: "a4",
		});

		doc.setFont("helvetica");
		let currentY = 20;

		// Título
		doc.setFontSize(20);
		doc.setFont("helvetica", "bold");
		doc.text("Ficha do Paciente", 14, currentY);
		currentY += 15;

		// Informações do paciente
		doc.setFontSize(12);
		doc.setFont("helvetica", "normal");

		const info = [
			["Nome Completo:", patient.full_name],
			["CPF:", patient.cpf],
			[
				"Data de Nascimento:",
				new Date(patient.birth_date).toLocaleDateString("pt-BR"),
			],
			["Telefone:", patient.phone],
			["CEP:", patient.cep],
			["Endereço:", `${patient.street}, ${patient.number}`],
			["Complemento:", patient.complement || "N/A"],
			["Bairro:", patient.neighborhood],
			["Cidade:", patient.city],
			["Estado:", patient.state],
		];

		info.forEach(([label, value]) => {
			doc.setFont("helvetica", "bold");
			doc.text(label, 14, currentY);
			doc.setFont("helvetica", "normal");
			doc.text(value, 60, currentY);
			currentY += 8;
		});

		// Data de geração
		currentY += 10;
		doc.setFontSize(10);
		doc.text(
			`Gerado em: ${new Date().toLocaleDateString(
				"pt-BR"
			)} às ${new Date().toLocaleTimeString("pt-BR")}`,
			14,
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
				orientation = "landscape",
			} = options;

			// Criar documento PDF
			const doc = new jsPDF({
				orientation,
				unit: "mm",
				format: "a4",
			});

			// Configurações de fonte
			doc.setFont("helvetica");

			let currentY = 20;

			// Cabeçalho
			if (includeHeader) {
				doc.setFontSize(20);
				doc.setFont("helvetica", "bold");
				doc.text(title, 14, currentY);
				currentY += 10;

				doc.setFontSize(12);
				doc.setFont("helvetica", "normal");
				doc.text(
					`Gerado em: ${new Date().toLocaleDateString(
						"pt-BR"
					)} às ${new Date().toLocaleTimeString("pt-BR")}`,
					14,
					currentY
				);
				currentY += 10;

				doc.text(`Total de vacinas: ${vaccines.length}`, 14, currentY);
				currentY += 15;
			}

			// Preparar dados para a tabela
			const tableData = vaccines.map((vaccine) => [
				vaccine.type,
				vaccine.manufacturer,
				new Date(vaccine.created_at).toLocaleDateString("pt-BR"),
				new Date(vaccine.updated_at).toLocaleDateString("pt-BR"),
			]);

			// Criar tabela
			autoTable(doc, {
				head: [
					[
						"Tipo da Vacina",
						"Fabricante",
						"Data de Criação",
						"Última Atualização",
					],
				],
				body: tableData,
				startY: currentY,
				styles: {
					fontSize: 10,
					cellPadding: 4,
				},
				headStyles: {
					fillColor: [79, 70, 229], // Cor azul do tema
					textColor: 255,
					fontStyle: "bold",
				},
				alternateRowStyles: {
					fillColor: [245, 245, 245],
				},
				columnStyles: {
					0: { cellWidth: 80 }, // Tipo
					1: { cellWidth: 80 }, // Fabricante
					2: { cellWidth: 40 }, // Data de Criação
					3: { cellWidth: 40 }, // Última Atualização
				},
				margin: { top: 20, right: 14, bottom: 20, left: 14 },
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
			const fileName = `vacinas_${new Date().toISOString().split("T")[0]}.pdf`;
			doc.save(fileName);
		},
		[]
	);

	const exportVaccineToPdf = useCallback((vaccine: Vaccine) => {
		const doc = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: "a4",
		});

		doc.setFont("helvetica");
		let currentY = 20;

		// Título
		doc.setFontSize(20);
		doc.setFont("helvetica", "bold");
		doc.text("Ficha da Vacina", 14, currentY);
		currentY += 15;

		// Informações da vacina
		doc.setFontSize(12);
		doc.setFont("helvetica", "normal");

		const info = [
			["Tipo da Vacina:", vaccine.type],
			["Fabricante:", vaccine.manufacturer],
			[
				"Data de Criação:",
				new Date(vaccine.created_at).toLocaleDateString("pt-BR"),
			],
			[
				"Última Atualização:",
				new Date(vaccine.updated_at).toLocaleDateString("pt-BR"),
			],
			["ID do Sistema:", vaccine.id],
		];

		info.forEach(([label, value]) => {
			doc.setFont("helvetica", "bold");
			doc.text(label, 14, currentY);
			doc.setFont("helvetica", "normal");
			doc.text(value, 60, currentY);
			currentY += 8;
		});

		// Data de geração
		currentY += 10;
		doc.setFontSize(10);
		doc.text(
			`Gerado em: ${new Date().toLocaleDateString(
				"pt-BR"
			)} às ${new Date().toLocaleTimeString("pt-BR")}`,
			14,
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
				orientation = "landscape",
			} = options;

			// Criar documento PDF
			const doc = new jsPDF({
				orientation,
				unit: "mm",
				format: "a4",
			});

			// Configurações de fonte
			doc.setFont("helvetica");

			let currentY = 20;

			// Cabeçalho
			if (includeHeader) {
				doc.setFontSize(20);
				doc.setFont("helvetica", "bold");
				doc.text(title, 14, currentY);
				currentY += 10;

				doc.setFontSize(12);
				doc.setFont("helvetica", "normal");
				doc.text(
					`Gerado em: ${new Date().toLocaleDateString(
						"pt-BR"
					)} às ${new Date().toLocaleTimeString("pt-BR")}`,
					14,
					currentY
				);
				currentY += 10;

				doc.text(`Total de vacinações: ${vaccinations.length}`, 14, currentY);
				currentY += 15;
			}

			// Preparar dados para a tabela
			const tableData = vaccinations.map((vaccination) => [
				vaccination.patient.full_name,
				vaccination.patient.cpf,
				vaccination.vaccine.type,
				vaccination.vaccine.manufacturer,
				new Date(vaccination.dose_date).toLocaleDateString("pt-BR"),
				vaccination.batch_number,
				vaccination.location,
				vaccination.notes || "-",
			]);

			// Criar tabela
			autoTable(doc, {
				head: [
					[
						"Paciente",
						"CPF",
						"Vacina",
						"Fabricante",
						"Data da Dose",
						"Lote",
						"Local",
						"Observações",
					],
				],
				body: tableData,
				startY: currentY,
				styles: {
					fontSize: 8,
					cellPadding: 2,
				},
				headStyles: {
					fillColor: [79, 70, 229], // Cor azul do tema
					textColor: 255,
					fontStyle: "bold",
				},
				alternateRowStyles: {
					fillColor: [245, 245, 245],
				},
				columnStyles: {
					0: { cellWidth: 35 }, // Paciente
					1: { cellWidth: 25 }, // CPF
					2: { cellWidth: 30 }, // Vacina
					3: { cellWidth: 25 }, // Fabricante
					4: { cellWidth: 20 }, // Data
					5: { cellWidth: 20 }, // Lote
					6: { cellWidth: 30 }, // Local
					7: { cellWidth: 30 }, // Observações
				},
				margin: { top: 20, right: 14, bottom: 20, left: 14 },
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
				unit: "mm",
				format: "a4",
			});

			doc.setFont("helvetica");
			let currentY = 20;

			// Título
			doc.setFontSize(20);
			doc.setFont("helvetica", "bold");
			doc.text("Comprovante de Vacinação", 14, currentY);
			currentY += 20;

			// Informações do paciente
			doc.setFontSize(14);
			doc.setFont("helvetica", "bold");
			doc.text("DADOS DO PACIENTE", 14, currentY);
			currentY += 10;

			doc.setFontSize(12);
			doc.setFont("helvetica", "normal");

			const patientInfo = [
				["Nome:", vaccination.patient.full_name],
				["CPF:", vaccination.patient.cpf],
			];

			patientInfo.forEach(([label, value]) => {
				doc.setFont("helvetica", "bold");
				doc.text(label, 14, currentY);
				doc.setFont("helvetica", "normal");
				doc.text(value, 50, currentY);
				currentY += 8;
			});

			currentY += 10;

			// Informações da vacinação
			doc.setFontSize(14);
			doc.setFont("helvetica", "bold");
			doc.text("DADOS DA VACINAÇÃO", 14, currentY);
			currentY += 10;

			doc.setFontSize(12);
			doc.setFont("helvetica", "normal");

			const vaccinationInfo = [
				["Vacina:", vaccination.vaccine.type],
				["Fabricante:", vaccination.vaccine.manufacturer],
				[
					"Data da Dose:",
					new Date(vaccination.dose_date).toLocaleDateString("pt-BR"),
				],
				["Lote:", vaccination.batch_number],
				["Local:", vaccination.location],
				["Observações:", vaccination.notes || "Nenhuma observação"],
			];

			vaccinationInfo.forEach(([label, value]) => {
				doc.setFont("helvetica", "bold");
				doc.text(label, 14, currentY);
				doc.setFont("helvetica", "normal");

				// Quebrar texto longo em múltiplas linhas
				const maxWidth = 140;
				const lines = doc.splitTextToSize(value, maxWidth);
				doc.text(lines, 60, currentY);
				currentY += lines.length * 6 + 2;
			});

			// Data de geração
			currentY += 20;
			doc.setFontSize(10);
			doc.text(
				`Documento gerado em: ${new Date().toLocaleDateString(
					"pt-BR"
				)} às ${new Date().toLocaleTimeString("pt-BR")}`,
				14,
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
					unit: "mm",
					format: "a4",
				});

				doc.setFont("helvetica");
				let currentY = 20;
				const pageWidth = doc.internal.pageSize.width;
				const pageHeight = doc.internal.pageSize.height;

				// Cabeçalho
				if (includeHeader) {
					doc.setFontSize(16);
					doc.setFont("helvetica", "bold");
					doc.text(title, pageWidth / 2, currentY, { align: "center" });
					currentY += 10;

					doc.setFontSize(10);
					doc.setFont("helvetica", "normal");
					doc.text(
						`Gerado em: ${new Date().toLocaleDateString(
							"pt-BR"
						)} às ${new Date().toLocaleTimeString("pt-BR")}`,
						pageWidth / 2,
						currentY,
						{ align: "center" }
					);
					currentY += 15;

					// Informações dos filtros aplicados
					if (filters) {
						doc.setFontSize(12);
						doc.setFont("helvetica", "bold");
						doc.text("Filtros Aplicados:", 14, currentY);
						currentY += 8;

						doc.setFontSize(10);
						doc.setFont("helvetica", "normal");

						if (filters.period) {
							doc.text(`• Período: ${filters.period}`, 14, currentY);
							currentY += 6;
						}
						if (filters.vaccineType) {
							doc.text(
								`• Tipo de Vacina: ${filters.vaccineType}`,
								14,
								currentY
							);
							currentY += 6;
						}
						if (filters.ageGroup) {
							doc.text(`• Faixa Etária: ${filters.ageGroup}`, 14, currentY);
							currentY += 6;
						}
						if (filters.patientId) {
							doc.text(
								`• Paciente Específico: ID ${filters.patientId}`,
								14,
								currentY
							);
							currentY += 6;
						}
						currentY += 10;
					}
				}

				// Estatísticas Gerais
				doc.setFontSize(14);
				doc.setFont("helvetica", "bold");
				doc.text("ESTATÍSTICAS GERAIS", 14, currentY);
				currentY += 10;

				const statsData = [
					["Total de Pacientes", dashboardData.stats.totalPatients.toString()],
					["Total de Vacinas", dashboardData.stats.totalVaccines.toString()],
					[
						"Total de Vacinações",
						dashboardData.stats.totalVaccinations.toString(),
					],
				];
				autoTable(doc, {
					body: statsData,
					startY: currentY,
					styles: {
						fontSize: 10,
						cellPadding: 4,
					},
					columnStyles: {
						0: { fontStyle: "bold", cellWidth: 60 },
						1: { cellWidth: 40, halign: "center" },
					},
					theme: "grid",
				});

				currentY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;

				// Indicadores de Saúde
				if (dashboardData.healthIndicators) {
					doc.setFontSize(14);
					doc.setFont("helvetica", "bold");
					doc.text("INDICADORES DE SAÚDE", 14, currentY);
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
							fontSize: 10,
							cellPadding: 4,
						},
						columnStyles: {
							0: { fontStyle: "bold", cellWidth: 80 },
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
				}

				// Vacinações por Tipo
				if (dashboardData.vaccinationsByType.length > 0) {
					doc.setFontSize(14);
					doc.setFont("helvetica", "bold");
					doc.text("VACINAÇÕES POR TIPO", 14, currentY);
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
							fontSize: 10,
							cellPadding: 3,
						},
						headStyles: {
							fillColor: [79, 70, 229],
							textColor: 255,
							fontStyle: "bold",
						},
						alternateRowStyles: {
							fillColor: [245, 245, 245],
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
					currentY = 20;
				}

				// Pacientes por Faixa Etária
				if (dashboardData.patientsByAge.length > 0) {
					doc.setFontSize(14);
					doc.setFont("helvetica", "bold");
					doc.text("PACIENTES POR FAIXA ETÁRIA", 14, currentY);
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
							fontSize: 10,
							cellPadding: 3,
						},
						headStyles: {
							fillColor: [79, 70, 229],
							textColor: 255,
							fontStyle: "bold",
						},
						alternateRowStyles: {
							fillColor: [245, 245, 245],
						},
						columnStyles: {
							0: { cellWidth: 60 },
							1: { cellWidth: 30, halign: "center" },
							2: { cellWidth: 30, halign: "center" },
						},
					});

					currentY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;
				}

				// Nova página para dados mensais
				if (dashboardData.vaccinationsByMonth.length > 0) {
					doc.addPage();
					currentY = 20;

					doc.setFontSize(14);
					doc.setFont("helvetica", "bold");
					doc.text("VACINAÇÕES POR MÊS", 14, currentY);
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
							fontSize: 10,
							cellPadding: 3,
						},
						headStyles: {
							fillColor: [79, 70, 229],
							textColor: 255,
							fontStyle: "bold",
						},
						alternateRowStyles: {
							fillColor: [245, 245, 245],
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
						currentY = 20;
					}

					doc.setFontSize(14);
					doc.setFont("helvetica", "bold");
					doc.text("DISTRIBUIÇÃO POR LOCAL", 14, currentY);
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
							fontSize: 10,
							cellPadding: 3,
						},
						headStyles: {
							fillColor: [79, 70, 229],
							textColor: 255,
							fontStyle: "bold",
						},
						alternateRowStyles: {
							fillColor: [245, 245, 245],
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
						doc.setFontSize(8);
						doc.setFont("helvetica", "normal");
						doc.text(`Página ${i} de ${pageCount}`, 14, pageHeight - 10);
						doc.text(
							"Sistema de Vacinação - Relatório Dashboard",
							pageWidth - 14,
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
