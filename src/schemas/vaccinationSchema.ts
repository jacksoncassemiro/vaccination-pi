import { z } from "zod";

export const vaccinationSchema = z.object({
	patient_id: z
		.string()
		.min(1, "Paciente é obrigatório")
		.uuid("ID do paciente deve ser um UUID válido"),

	vaccine_id: z
		.string()
		.min(1, "Vacina é obrigatória")
		.uuid("ID da vacina deve ser um UUID válido"),
	dose_date: z.coerce
		.date({
			errorMap: (issue, { defaultError }) => ({
				message:
					issue.code === "invalid_date"
						? "Data da dose inválida"
						: defaultError,
			}),
		})
		.refine((date) => {
			const today = new Date();
			today.setHours(23, 59, 59, 999); // Permitir até o final do dia atual
			return date <= today && date >= new Date("1900-01-01");
		}, "Data da dose deve ser válida e não pode ser futura"),

	batch_number: z
		.string()
		.min(1, "Lote da vacina é obrigatório")
		.max(50, "Lote deve ter no máximo 50 caracteres")
		.regex(
			/^[a-zA-Z0-9\-_]+$/,
			"Lote deve conter apenas letras, números, hífens e sublinhados"
		),

	location: z
		.string()
		.min(2, "Local de aplicação deve ter pelo menos 2 caracteres")
		.max(100, "Local deve ter no máximo 100 caracteres"),

	notes: z
		.string()
		.max(500, "Observações devem ter no máximo 500 caracteres")
		.optional(),
});

export type VaccinationFormData = z.infer<typeof vaccinationSchema>;
