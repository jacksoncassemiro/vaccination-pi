import dayjs from "dayjs";

export function formatCpf(value: string): string {
	const cleanValue = value.replace(/\D/g, "");
	return cleanValue
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d{1,2})/, "$1-$2")
		.replace(/(-\d{2})\d+?$/, "$1");
}

export function formatPhone(value: string): string {
	const cleanValue = value.replace(/\D/g, "");
	if (cleanValue.length <= 10) {
		return cleanValue
			.replace(/(\d{2})(\d)/, "($1) $2")
			.replace(/(\d{4})(\d)/, "$1-$2")
			.replace(/(-\d{4})\d+?$/, "$1");
	} else {
		return cleanValue
			.replace(/(\d{2})(\d)/, "($1) $2")
			.replace(/(\d{5})(\d)/, "$1-$2")
			.replace(/(-\d{4})\d+?$/, "$1");
	}
}

export function formatCep(value: string): string {
	const cleanValue = value.replace(/\D/g, "");
	return cleanValue.replace(/(\d{5})(\d)/, "$1-$2");
}

/**
 * Converte uma data para string no formato YYYY-MM-DD preservando o fuso horário local
 * Evita problemas de conversão UTC que podem alterar o dia
 */
export function formatDateForForm(date: Date): string {
	return dayjs(date).format("YYYY-MM-DD");
}

/**
 * Converte uma string de data (YYYY-MM-DD) para objeto Date de forma segura
 * Evita problemas de interpretação UTC que podem alterar o dia
 */
export function parseDateFromString(dateString: string): Date {
	// Use dayjs para fazer o parsing da string de forma segura
	// Isso evita problemas de fuso horário que ocorrem com new Date("YYYY-MM-DD")
	const parsed = dayjs(dateString, "YYYY-MM-DD");

	if (!parsed.isValid()) {
		throw new Error(`Data inválida: ${dateString}`);
	}

	return parsed.toDate();
}

/**
 * Formata uma string de data para o formato brasileiro DD/MM/YYYY
 * Evita problemas de conversão UTC que podem alterar o dia
 */
export function formatDateToBrazilian(dateString: string): string {
	return dayjs(dateString).format("DD/MM/YYYY");
}
