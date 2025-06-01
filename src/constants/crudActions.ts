// Padrões para ações CRUD
export const CRUD_ACTION_COLORS = {
	edit: "blue",
	export: "green",
	delete: "red",
} as const;

export const CRUD_ACTION_ORDER = ["edit", "export", "delete"] as const;

export const CRUD_BUTTON_LABELS = {
	patients: "Paciente",
	vaccines: "Vacina",
	vaccinations: "Vacinação",
} as const;
