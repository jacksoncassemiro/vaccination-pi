// Constantes para geração de PDFs
export const PDF_CONFIG = {
	// Configurações padrão do documento
	DEFAULT_ORIENTATION: "landscape" as const,
	DEFAULT_UNIT: "mm" as const,
	DEFAULT_FORMAT: "a4" as const,

	// Fontes
	FONT_FAMILY: "helvetica" as const,
	FONT_STYLES: {
		NORMAL: "normal" as const,
		BOLD: "bold" as const,
	},

	// Tamanhos de fonte
	FONT_SIZES: {
		TITLE: 20,
		SUBTITLE: 14,
		NORMAL: 12,
		SMALL: 10,
		TINY: 8,
	},

	// Margens e espaçamentos
	MARGINS: {
		TOP: 20,
		RIGHT: 14,
		BOTTOM: 20,
		LEFT: 14,
	},
	// Cores do tema
	COLORS: {
		PRIMARY: [79, 70, 229] as [number, number, number],
		WHITE: 255,
		ALTERNATE_ROW: [245, 245, 245] as [number, number, number],
	},

	// Configurações de tabela
	TABLE: {
		CELL_PADDING: 3,
		HEAD_CELL_PADDING: 4,
		ALTERNATE_ROW_PADDING: 2,
	},
} as const;

// Textos padrão para PDFs
export const PDF_TEXTS = {
	SYSTEM_NAME: "Sistema de Vacinação",
	GENERATED_AT: "Gerado em:",
	AT_TIME: "às",
	PAGE: "Página",
	OF: "de",
	TOTAL_PATIENTS: "Total de pacientes:",
	TOTAL_VACCINES: "Total de vacinas:",
	TOTAL_VACCINATIONS: "Total de vacinações:",
	NO_OBSERVATIONS: "Nenhuma observação",
	NOT_APPLICABLE: "N/A",
	DASH: "-",
} as const;

// Headers de tabelas
export const PDF_TABLE_HEADERS = {
	PATIENTS: [
		"Nome Completo",
		"CPF",
		"Data de Nascimento",
		"Telefone",
		"Endereço",
		"Bairro/Cidade",
		"CEP",
	] as string[],
	VACCINES: [
		"Tipo da Vacina",
		"Fabricante",
		"Data de Criação",
		"Última Atualização",
	] as string[],
	VACCINATIONS: [
		"Paciente",
		"CPF",
		"Vacina",
		"Fabricante",
		"Data da Dose",
		"Lote",
		"Local",
		"Observações",
	] as string[],
} as const;

// Larguras de colunas para tabelas
export const PDF_COLUMN_WIDTHS = {
	PATIENTS: {
		NAME: 40,
		CPF: 25,
		BIRTH_DATE: 25,
		PHONE: 25,
		ADDRESS: 45,
		NEIGHBORHOOD_CITY: 40,
		CEP: 20,
	},
	VACCINES: {
		TYPE: 80,
		MANUFACTURER: 80,
		CREATED_AT: 40,
		UPDATED_AT: 40,
	},
	VACCINATIONS: {
		PATIENT: 35,
		CPF: 25,
		VACCINE: 30,
		MANUFACTURER: 25,
		DOSE_DATE: 20,
		BATCH: 20,
		LOCATION: 30,
		NOTES: 30,
	},
} as const;
