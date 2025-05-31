"use server";

import { type VaccineFormData } from "@/schemas/vaccineSchema";
import type { VaccinesResponse, VaccinesSearchFilters } from "@/types/vaccines";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getVaccines(
	filters: VaccinesSearchFilters = {}
): Promise<VaccinesResponse> {
	const supabase = await createClient();

	const { search = "", page = 1, limit = 10 } = filters;
	const from = (page - 1) * limit;
	const to = from + limit - 1;

	let query = supabase
		.from("vaccine_catalog")
		.select("*", { count: "exact" })
		.order("created_at", { ascending: false })
		.range(from, to);

	// Aplicar filtro de busca se fornecido
	if (search.trim()) {
		query = query.or(`type.ilike.%${search}%,manufacturer.ilike.%${search}%`);
	}

	const { data, error, count } = await query;

	if (error) {
		throw new Error(`Erro ao buscar vacinas: ${error.message}`);
	}

	const totalPages = Math.ceil((count || 0) / limit);

	return {
		data: data || [],
		count: count || 0,
		page,
		limit,
		totalPages,
	};
}

export async function getVaccineById(id: string) {
	const supabase = await createClient();

	// Verificar autenticação
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	const { data, error } = await supabase
		.from("vaccine_catalog")
		.select("*")
		.eq("id", id)
		.eq("user_id", user.id) // Garantir que o usuário só acesse suas próprias vacinas
		.single();

	if (error) {
		throw new Error(`Erro ao buscar vacina: ${error.message}`);
	}

	return data;
}

export async function createVaccine(formData: FormData) {
	const supabase = await createClient();

	// Extrair dados do FormData
	const vaccineData: VaccineFormData = {
		type: formData.get("type") as string,
		manufacturer: formData.get("manufacturer") as string,
	};

	// Obter ID do usuário autenticado
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return { success: false, error: "Usuário não autenticado" };
	}

	// Verificar se a combinação tipo/fabricante já existe
	const { data: existingVaccine } = await supabase
		.from("vaccine_catalog")
		.select("id")
		.eq("type", vaccineData.type)
		.eq("manufacturer", vaccineData.manufacturer)
		.eq("user_id", user.id)
		.single();

	if (existingVaccine) {
		return {
			success: false,
			error: "Esta combinação de tipo e fabricante já existe no catálogo",
		};
	}

	// Inserir vacina
	const { data, error } = await supabase
		.from("vaccine_catalog")
		.insert({
			...vaccineData,
			user_id: user.id,
		})
		.select()
		.single();

	if (error) {
		return {
			success: false,
			error: `Erro ao criar vacina: ${error.message}`,
		};
	}

	revalidatePath("/vaccines");
	return { success: true, data };
}

export async function updateVaccine(id: string, formData: FormData) {
	const supabase = await createClient();

	// Extrair dados do FormData
	const vaccineData: VaccineFormData = {
		type: formData.get("type") as string,
		manufacturer: formData.get("manufacturer") as string,
	};

	// Obter ID do usuário autenticado
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return { success: false, error: "Usuário não autenticado" };
	}

	// Verificar se a combinação tipo/fabricante já existe (excluindo a vacina atual)
	const { data: existingVaccine } = await supabase
		.from("vaccine_catalog")
		.select("id")
		.eq("type", vaccineData.type)
		.eq("manufacturer", vaccineData.manufacturer)
		.eq("user_id", user.id)
		.neq("id", id)
		.single();

	if (existingVaccine) {
		return {
			success: false,
			error: "Esta combinação de tipo e fabricante já existe no catálogo",
		};
	}

	// Atualizar vacina
	const { data, error } = await supabase
		.from("vaccine_catalog")
		.update({
			...vaccineData,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id)
		.eq("user_id", user.id)
		.select()
		.single();

	if (error) {
		return {
			success: false,
			error: `Erro ao atualizar vacina: ${error.message}`,
		};
	}

	revalidatePath("/vaccines");
	return { success: true, data };
}

export async function deleteVaccine(id: string) {
	const supabase = await createClient();

	// Obter ID do usuário autenticado
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	// Verificar se a vacina está sendo usada em registros de vacinação
	const { count: recordsCount, error: recordsError } = await supabase
		.from("vaccination_records")
		.select("*", { count: "exact", head: true })
		.eq("vaccine_id", id);

	if (recordsError) {
		throw new Error(
			`Erro ao verificar registros de vacinação: ${recordsError.message}`
		);
	}

	if (recordsCount && recordsCount > 0) {
		throw new Error(
			"Não é possível excluir esta vacina pois ela está sendo usada em registros de vacinação"
		);
	}

	// Deletar vacina
	const { error } = await supabase
		.from("vaccine_catalog")
		.delete()
		.eq("id", id)
		.eq("user_id", user.id); // Garantir que o usuário só delete suas próprias vacinas

	if (error) {
		throw new Error(`Erro ao excluir vacina: ${error.message}`);
	}

	revalidatePath("/vaccines");
	return { success: true };
}
