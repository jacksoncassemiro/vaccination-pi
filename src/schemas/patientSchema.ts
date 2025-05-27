import { z } from "zod";

// Função para validar CPF
function isValidCpf(cpf: string): boolean {
	const cleanCpf = cpf.replace(/\D/g, "");

	if (cleanCpf.length !== 11) return false;
	if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

	let sum = 0;
	for (let i = 0; i < 9; i++) {
		sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
	}
	let remainder = (sum * 10) % 11;
	if (remainder === 10 || remainder === 11) remainder = 0;
	if (remainder !== parseInt(cleanCpf.charAt(9))) return false;

	sum = 0;
	for (let i = 0; i < 10; i++) {
		sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
	}
	remainder = (sum * 10) % 11;
	if (remainder === 10 || remainder === 11) remainder = 0;
	if (remainder !== parseInt(cleanCpf.charAt(10))) return false;

	return true;
}

// Função para validar CEP
function isValidCep(cep: string): boolean {
	const cleanCep = cep.replace(/\D/g, "");
	return /^\d{8}$/.test(cleanCep);
}

export const patientSchema = z.object({
	full_name: z
		.string()
		.min(2, "Nome deve ter pelo menos 2 caracteres")
		.max(255, "Nome deve ter no máximo 255 caracteres")
		.regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

	cpf: z
		.string()
		.min(1, "CPF é obrigatório")
		.refine((cpf) => isValidCpf(cpf), "CPF inválido"),

	birth_date: z.coerce
		.date({
			errorMap: (issue, { defaultError }) => ({
				message:
					issue.code === "invalid_date"
						? "Data de nascimento inválida"
						: defaultError,
			}),
		})
		.refine((date) => {
			const today = new Date();
			const age = today.getFullYear() - date.getFullYear();
			const monthDiff = today.getMonth() - date.getMonth();
			if (
				monthDiff < 0 ||
				(monthDiff === 0 && today.getDate() < date.getDate())
			) {
				return age - 1 >= 0;
			}
			return age >= 0 && age <= 150;
		}, "Data de nascimento inválida ou idade fora do permitido (0-150 anos)"),
	phone: z
		.string()
		.min(1, "Telefone é obrigatório")
		.regex(
			/^\d{10,11}$/,
			"Telefone deve conter 10 ou 11 dígitos"
		),

	cep: z
		.string()
		.min(1, "CEP é obrigatório")
		.refine((cep) => isValidCep(cep), "CEP inválido"),

	street: z
		.string()
		.min(2, "Rua deve ter pelo menos 2 caracteres")
		.max(255, "Rua deve ter no máximo 255 caracteres"),

	number: z
		.string()
		.min(1, "Número é obrigatório")
		.max(10, "Número deve ter no máximo 10 caracteres"),

	complement: z
		.string()
		.max(100, "Complemento deve ter no máximo 100 caracteres")
		.optional(),

	neighborhood: z
		.string()
		.min(2, "Bairro deve ter pelo menos 2 caracteres")
		.max(100, "Bairro deve ter no máximo 100 caracteres"),

	city: z
		.string()
		.min(2, "Cidade deve ter pelo menos 2 caracteres")
		.max(100, "Cidade deve ter no máximo 100 caracteres"),

	state: z
		.string()
		.length(2, "Estado deve ter 2 caracteres")
		.regex(/^[A-Z]{2}$/, "Estado deve estar no formato de sigla (ex: PI)"),
});

export type PatientFormData = z.infer<typeof patientSchema>;
