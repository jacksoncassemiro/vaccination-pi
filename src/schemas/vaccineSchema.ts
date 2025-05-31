import { z } from "zod";

export const vaccineSchema = z.object({
	type: z
		.string()
		.min(2, "Tipo da vacina deve ter pelo menos 2 caracteres")
		.max(100, "Tipo da vacina deve ter no máximo 100 caracteres")
		.regex(
			/^[a-zA-ZÀ-ÿ0-9\s\-()]+$/,
			"Tipo da vacina deve conter apenas letras, números, espaços e hífens"
		),

	manufacturer: z
		.string()
		.min(2, "Fabricante deve ter pelo menos 2 caracteres")
		.max(100, "Fabricante deve ter no máximo 100 caracteres")
		.regex(
			/^[a-zA-ZÀ-ÿ0-9\s\-.,&()]+$/,
			"Fabricante deve conter apenas letras, números, espaços e caracteres válidos"
		),
});

export type VaccineFormData = z.infer<typeof vaccineSchema>;
