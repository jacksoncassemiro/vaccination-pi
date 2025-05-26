"use server";

import { type PatientFormData } from "@/schemas/patientSchema";
import type { PatientsResponse, PatientsSearchFilters } from "@/types/patients";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Tipo específico para as actions que recebem FormData (birth_date como string)
type PatientActionData = Omit<PatientFormData, "birth_date"> & {
	birth_date: string;
};

export async function getPatients(
	filters: PatientsSearchFilters = {}
): Promise<PatientsResponse> {
	const supabase = await createClient();

	const { search = "", page = 1, limit = 10 } = filters;
	const from = (page - 1) * limit;
	const to = from + limit - 1;

	let query = supabase
		.from("patients")
		.select("*", { count: "exact" })
		.order("created_at", { ascending: false })
		.range(from, to);

	// Aplicar filtro de busca se fornecido
	if (search.trim()) {
		query = query.or(
			`full_name.ilike.%${search}%,cpf.ilike.%${search}%,phone.ilike.%${search}%`
		);
	}

	const { data, error, count } = await query;

	if (error) {
		throw new Error(`Erro ao buscar pacientes: ${error.message}`);
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

export async function getPatientById(id: string) {
	const supabase = await createClient();

	// Verificar autenticação
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		redirect(
			"/auth?message=Você precisa estar logado para acessar esta página"
		);
	}

	const { data, error } = await supabase
		.from("patients")
		.select("*")
		.eq("id", id)
		.eq("user_id", user.id)
		.single();

	if (error) {
		throw new Error(`Erro ao buscar paciente: ${error.message}`);
	}

	return data;
}

export async function createPatient(formData: FormData) {
	const supabase = await createClient();

	// Verificar autenticação
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		redirect("/auth?error=unauthorized");
	}
	// Extrair dados do FormData
	const patientData: PatientActionData = {
		full_name: formData.get("full_name") as string,
		cpf: formData.get("cpf") as string,
		birth_date: formData.get("birth_date") as string,
		phone: formData.get("phone") as string,
		cep: formData.get("cep") as string,
		street: formData.get("street") as string,
		number: formData.get("number") as string,
		complement: (formData.get("complement") as string) || "",
		neighborhood: formData.get("neighborhood") as string,
		city: formData.get("city") as string,
		state: formData.get("state") as string,
	};

	// Verificar se CPF já existe
	const { data: existingPatient } = await supabase
		.from("patients")
		.select("id")
		.eq("cpf", patientData.cpf)
		.single();

	if (existingPatient) {
		throw new Error("CPF já cadastrado no sistema");
	}

	// Criar paciente
	const { data, error } = await supabase
		.from("patients")
		.insert({
			...patientData,
			user_id: user.id,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Erro ao criar paciente: ${error.message}`);
	}

	// Revalidar a página de pacientes
	revalidatePath("/patients");

	return { success: true, data };
}

export async function updatePatient(id: string, formData: FormData) {
	const supabase = await createClient();

	// Verificar autenticação
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		redirect("/auth?error=unauthorized");
	}
	// Extrair dados do FormData
	const patientData: Partial<PatientActionData> = {
		full_name: formData.get("full_name") as string,
		cpf: formData.get("cpf") as string,
		birth_date: formData.get("birth_date") as string,
		phone: formData.get("phone") as string,
		cep: formData.get("cep") as string,
		street: formData.get("street") as string,
		number: formData.get("number") as string,
		complement: (formData.get("complement") as string) || "",
		neighborhood: formData.get("neighborhood") as string,
		city: formData.get("city") as string,
		state: formData.get("state") as string,
	};

	// Verificar se CPF já existe (excluindo o paciente atual)
	if (patientData.cpf) {
		const { data: existingPatient } = await supabase
			.from("patients")
			.select("id")
			.eq("cpf", patientData.cpf)
			.neq("id", id)
			.single();

		if (existingPatient) {
			throw new Error("CPF já cadastrado no sistema");
		}
	}

	// Atualizar paciente
	const { data, error } = await supabase
		.from("patients")
		.update(patientData)
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw new Error(`Erro ao atualizar paciente: ${error.message}`);
	}

	// Revalidar a página de pacientes
	revalidatePath("/patients");

	return { success: true, data };
}

export async function deletePatient(id: string) {
	const supabase = await createClient();

	// Verificar autenticação
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		redirect("/auth?error=unauthorized");
	}

	const { error } = await supabase.from("patients").delete().eq("id", id);

	if (error) {
		throw new Error(`Erro ao excluir paciente: ${error.message}`);
	}

	// Revalidar a página de pacientes
	revalidatePath("/patients");

	return { success: true };
}
