import type { Patient } from "@/types/patients";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCallback } from "react";

export interface PdfExportOptions {
	title?: string;
	includeHeader?: boolean;
	includeFooter?: boolean;
	orientation?: "portrait" | "landscape";
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

	return {
		exportPatientsToPdf,
		exportPatientToPdf,
	};
}
