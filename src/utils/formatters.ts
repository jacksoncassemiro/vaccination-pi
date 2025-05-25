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
