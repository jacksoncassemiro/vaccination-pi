"use server";

import { type VaccinationFormData } from "@/schemas/vaccinationSchema";
import type {
	VaccinationsResponse,
	VaccinationsSearchFilters,
} from "@/types/vaccinations";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Tipo genérico para linhas do banco de dados
type DatabaseRow = Record<string, unknown>;

// Tipo específico para as actions que recebem FormData (dose_date como string)
type VaccinationActionData = Omit<VaccinationFormData, "dose_date"> & {
	dose_date: string;
};

export async function getVaccinations(
	filters: VaccinationsSearchFilters = {}
): Promise<VaccinationsResponse> {
	const supabase = await createClient();

	const { search = "", page = 1, limit = 10 } = filters;
	const from = (page - 1) * limit;
	const to = from + limit - 1;

	let query = supabase
		.from("vaccination_records")
		.select(
			`
			*,
			patient:patients(id, full_name, cpf),
			vaccine:vaccine_catalog(id, type, manufacturer)
		`,
			{ count: "exact" }
		)
		.order("dose_date", { ascending: false })
		.range(from, to);

	// Aplicar filtro de busca se fornecido
	if (search.trim()) {
		query = query.or(`
			batch_number.ilike.%${search}%,
			location.ilike.%${search}%,
			notes.ilike.%${search}%,
			patient.full_name.ilike.%${search}%,
			patient.cpf.ilike.%${search}%,
			vaccine.type.ilike.%${search}%,
			vaccine.manufacturer.ilike.%${search}%,
		`);
	}

	const { data, error, count } = await query;

	if (error) {
		throw new Error(`Erro ao buscar vacinações: ${error.message}`);
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

export async function getVaccinationById(id: string) {
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
		.from("vaccination_records")
		.select(
			`
			*,
			patient:patients!inner(id, full_name, cpf, user_id),
			vaccine:vaccine_catalog!inner(id, type, manufacturer, user_id)
		`
		)
		.eq("id", id)
		.eq("patient.user_id", user.id) // Garantir que o usuário só acesse suas próprias vacinações
		.eq("vaccine.user_id", user.id)
		.single();

	if (error) {
		throw new Error(`Erro ao buscar vacinação: ${error.message}`);
	}

	return data;
}

export async function createVaccination(formData: FormData) {
	const supabase = await createClient();

	// Extrair dados do FormData
	const vaccinationData: VaccinationActionData = {
		patient_id: formData.get("patient_id") as string,
		vaccine_id: formData.get("vaccine_id") as string,
		dose_date: formData.get("dose_date") as string,
		batch_number: formData.get("batch_number") as string,
		location: formData.get("location") as string,
		notes: (formData.get("notes") as string) || undefined,
	};

	// Obter ID do usuário autenticado
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return { success: false, error: "Usuário não autenticado" };
	}

	// Verificar se o paciente pertence ao usuário
	const { data: patient, error: patientError } = await supabase
		.from("patients")
		.select("id")
		.eq("id", vaccinationData.patient_id)
		.eq("user_id", user.id)
		.single();

	if (patientError || !patient) {
		return {
			success: false,
			error: "Paciente não encontrado ou não pertence ao usuário",
		};
	}

	// Verificar se a vacina pertence ao usuário
	const { data: vaccine, error: vaccineError } = await supabase
		.from("vaccine_catalog")
		.select("id")
		.eq("id", vaccinationData.vaccine_id)
		.eq("user_id", user.id)
		.single();

	if (vaccineError || !vaccine) {
		return {
			success: false,
			error: "Vacina não encontrada ou não pertence ao usuário",
		};
	}

	// Inserir vacinação
	const { data, error } = await supabase
		.from("vaccination_records")
		.insert(vaccinationData)
		.select()
		.single();

	if (error) {
		return {
			success: false,
			error: `Erro ao criar vacinação: ${error.message}`,
		};
	}

	revalidatePath("/vaccinations");
	return { success: true, data };
}

export async function updateVaccination(id: string, formData: FormData) {
	const supabase = await createClient();

	// Extrair dados do FormData
	const vaccinationData: VaccinationActionData = {
		patient_id: formData.get("patient_id") as string,
		vaccine_id: formData.get("vaccine_id") as string,
		dose_date: formData.get("dose_date") as string,
		batch_number: formData.get("batch_number") as string,
		location: formData.get("location") as string,
		notes: (formData.get("notes") as string) || undefined,
	};

	// Obter ID do usuário autenticado
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		return { success: false, error: "Usuário não autenticado" };
	}

	// Verificar se a vacinação existe e pertence ao usuário (através do paciente)
	const { data: existingRecord, error: recordError } = await supabase
		.from("vaccination_records")
		.select(
			`
			id,
			patient:patients!inner(user_id)
		`
		)
		.eq("id", id)
		.eq("patient.user_id", user.id)
		.single();

	if (recordError || !existingRecord) {
		return {
			success: false,
			error: "Vacinação não encontrada ou não pertence ao usuário",
		};
	}

	// Verificar se o paciente pertence ao usuário
	const { data: patient, error: patientError } = await supabase
		.from("patients")
		.select("id")
		.eq("id", vaccinationData.patient_id)
		.eq("user_id", user.id)
		.single();

	if (patientError || !patient) {
		return {
			success: false,
			error: "Paciente não encontrado ou não pertence ao usuário",
		};
	}

	// Verificar se a vacina pertence ao usuário
	const { data: vaccine, error: vaccineError } = await supabase
		.from("vaccine_catalog")
		.select("id")
		.eq("id", vaccinationData.vaccine_id)
		.eq("user_id", user.id)
		.single();

	if (vaccineError || !vaccine) {
		return {
			success: false,
			error: "Vacina não encontrada ou não pertence ao usuário",
		};
	}

	// Atualizar vacinação
	const { data, error } = await supabase
		.from("vaccination_records")
		.update({
			...vaccinationData,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id)
		.select()
		.single();

	if (error) {
		return {
			success: false,
			error: `Erro ao atualizar vacinação: ${error.message}`,
		};
	}

	revalidatePath("/vaccinations");
	return { success: true, data };
}

export async function deleteVaccination(id: string) {
	const supabase = await createClient();

	// Obter ID do usuário autenticado
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	// Verificar se a vacinação existe e pertence ao usuário (através do paciente)
	const { data: existingRecord, error: recordError } = await supabase
		.from("vaccination_records")
		.select(
			`
			id,
			patient:patients!inner(user_id)
		`
		)
		.eq("id", id)
		.eq("patient.user_id", user.id)
		.single();

	if (recordError || !existingRecord) {
		throw new Error("Vacinação não encontrada ou não pertence ao usuário");
	}

	// Deletar vacinação
	const { error } = await supabase
		.from("vaccination_records")
		.delete()
		.eq("id", id);

	if (error) {
		throw new Error(`Erro ao excluir vacinação: ${error.message}`);
	}

	revalidatePath("/vaccinations");
	return { success: true };
}

// Função auxiliar para buscar pacientes do usuário (para o formulário)
export async function getUserPatients(search: string = "", limit: number = 50) {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	let query = supabase
		.from("patients")
		.select("id, full_name, cpf")
		.eq("user_id", user.id);

	// Aplicar busca se fornecida
	if (search.trim()) {
		query = query.or(`full_name.ilike.%${search}%,cpf.ilike.%${search}%`);
	}

	// Aplicar limite e ordenação
	const { data, error } = await query.order("full_name").limit(limit);

	if (error) {
		throw new Error(`Erro ao buscar pacientes: ${error.message}`);
	}

	return data || [];
}

// Função auxiliar para buscar vacinas do usuário (para o formulário)
export async function getUserVaccines(search: string = "", limit: number = 50) {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	let query = supabase
		.from("vaccine_catalog")
		.select("id, type, manufacturer")
		.eq("user_id", user.id);

	// Aplicar busca se fornecida
	if (search.trim()) {
		query = query.or(`type.ilike.%${search}%,manufacturer.ilike.%${search}%`);
	}

	// Aplicar limite e ordenação
	const { data, error } = await query.order("type").limit(limit);

	if (error) {
		throw new Error(`Erro ao buscar vacinas: ${error.message}`);
	}

	return data || [];
}

// Funções para Dashboard
export async function getDashboardStats() {
	const supabase = await createClient();

	// Verificar autenticação
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	// Buscar total de pacientes
	const { count: totalPatients } = await supabase
		.from("patients")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id);

	// Buscar total de vacinas
	const { count: totalVaccines } = await supabase
		.from("vaccine_catalog")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id);

	// Buscar total de vacinações
	const { count: totalVaccinations } = await supabase
		.from("vaccination_records")
		.select(
			`
			*,
			patient:patients!inner(user_id)
		`,
			{ count: "exact", head: true }
		)
		.eq("patient.user_id", user.id);

	return {
		totalPatients: totalPatients || 0,
		totalVaccines: totalVaccines || 0,
		totalVaccinations: totalVaccinations || 0,
	};
}

export async function getVaccinationsByVaccineType() {
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
		.from("vaccination_records")
		.select(
			`
			vaccine_catalog!inner(type, manufacturer),
			patients!inner(user_id)
		`
		)
		.eq("patients.user_id", user.id);

	if (error) {
		throw new Error(`Erro ao buscar vacinações por tipo: ${error.message}`);
	} // Agrupar por tipo de vacina
	const grouped = (data || []).reduce((acc, record: DatabaseRow) => {
		const vaccine = record.vaccine_catalog as {
			type?: string;
			manufacturer?: string;
		};
		if (vaccine && vaccine.type && vaccine.manufacturer) {
			const vaccineType = vaccine.type;
			const key = `${vaccineType} - ${vaccine.manufacturer}`;
			acc[key] = (acc[key] || 0) + 1;
		}
		return acc;
	}, {} as Record<string, number>);
	// Converter para formato do gráfico com cores
	const colors = [
		"blue.6",
		"green.6",
		"yellow.6",
		"red.6",
		"violet.6",
		"orange.6",
		"teal.6",
		"pink.6",
		"indigo.6",
		"cyan.6",
	];

	return Object.entries(grouped).map(([name, value], index) => ({
		name,
		value,
		color: colors[index % colors.length],
	}));
}

export async function getVaccinationsByMonth() {
	const supabase = await createClient();

	// Verificar autenticação
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	// Buscar vacinações dos últimos 12 meses
	const oneYearAgo = new Date();
	oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
	const { data, error } = await supabase
		.from("vaccination_records")
		.select(
			`
			dose_date,
			patients!inner(user_id)
		`
		)
		.eq("patients.user_id", user.id)
		.gte("dose_date", oneYearAgo.toISOString().split("T")[0])
		.order("dose_date");

	if (error) {
		throw new Error(`Erro ao buscar vacinações por mês: ${error.message}`);
	} // Agrupar por mês
	const grouped = (data || []).reduce((acc, record: DatabaseRow) => {
		const date = new Date(record.dose_date as string);
		const monthKey = `${date.getFullYear()}-${String(
			date.getMonth() + 1
		).padStart(2, "0")}`;
		const monthName = date.toLocaleDateString("pt-BR", {
			month: "long",
			year: "numeric",
		});
		acc[monthKey] = {
			month: monthName,
			count: (acc[monthKey]?.count || 0) + 1,
		};
		return acc;
	}, {} as Record<string, { month: string; count: number }>);

	// Converter para formato do gráfico e ordenar
	return Object.values(grouped)
		.sort((a, b) => a.month.localeCompare(b.month))
		.map(({ month, count }) => ({
			month,
			vacinações: count,
		}));
}

export async function getPatientsByAgeGroup() {
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
		.from("patients")
		.select("birth_date")
		.eq("user_id", user.id);

	if (error) {
		throw new Error(
			`Erro ao buscar pacientes por faixa etária: ${error.message}`
		);
	} // Calcular idades e agrupar
	const currentYear = new Date().getFullYear();
	const ageGroups = {
		"0-17": 0,
		"18-29": 0,
		"30-39": 0,
		"40-49": 0,
		"50-59": 0,
		"60+": 0,
	};
	(data || []).forEach((patient: DatabaseRow) => {
		const birthYear = new Date(patient.birth_date as string).getFullYear();
		const age = currentYear - birthYear;

		if (age <= 17) ageGroups["0-17"]++;
		else if (age <= 29) ageGroups["18-29"]++;
		else if (age <= 39) ageGroups["30-39"]++;
		else if (age <= 49) ageGroups["40-49"]++;
		else if (age <= 59) ageGroups["50-59"]++;
		else ageGroups["60+"]++;
	});

	// Converter para formato do gráfico
	return Object.entries(ageGroups).map(([group, count]) => ({
		group,
		pacientes: count,
	}));
}

// Tipos para filtros de período
export type PeriodFilter =
	| "day"
	| "week"
	| "month"
	| "semester"
	| "year"
	| "custom";

// Função para obter estatísticas avançadas por período
export async function getDashboardStatsByPeriod(
	period: PeriodFilter,
	customStart?: string,
	customEnd?: string
) {
	const supabase = await createClient();

	// Verificar autenticação
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	// Calcular datas baseado no período
	const now = new Date();
	let startDate: Date;
	let endDate = new Date(now);

	switch (period) {
		case "day":
			startDate = new Date(now);
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;
		case "week":
			startDate = new Date(now);
			startDate.setDate(now.getDate() - 7);
			break;
		case "month":
			startDate = new Date(now);
			startDate.setMonth(now.getMonth() - 1);
			break;
		case "semester":
			startDate = new Date(now);
			startDate.setMonth(now.getMonth() - 6);
			break;
		case "year":
			startDate = new Date(now);
			startDate.setFullYear(now.getFullYear() - 1);
			break;
		case "custom":
			if (!customStart || !customEnd) {
				throw new Error(
					"Datas customizadas são obrigatórias para período customizado"
				);
			}
			startDate = new Date(customStart);
			endDate = new Date(customEnd);
			break;
		default:
			startDate = new Date(now);
			startDate.setMonth(now.getMonth() - 1);
	}
	// Buscar vacinações no período
	const { count: vaccinationCount } = await supabase
		.from("vaccination_records")
		.select(
			`
			*,
			patient:patients!inner(user_id)
		`,
			{ count: "exact", head: true }
		)
		.eq("patient.user_id", user.id)
		.gte("dose_date", startDate.toISOString().split("T")[0])
		.lte("dose_date", endDate.toISOString().split("T")[0]);

	// Buscar dados do período anterior para calcular crescimento
	const periodDays = Math.ceil(
		(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
	);
	const previousStartDate = new Date(startDate);
	previousStartDate.setDate(previousStartDate.getDate() - periodDays);
	const previousEndDate = new Date(startDate);

	const { count: previousCount } = await supabase
		.from("vaccination_records")
		.select(
			`
			*,
			patient:patients!inner(user_id)
		`,
			{ count: "exact", head: true }
		)
		.eq("patient.user_id", user.id)
		.gte("dose_date", previousStartDate.toISOString().split("T")[0])
		.lte("dose_date", previousEndDate.toISOString().split("T")[0]);

	// Calcular taxa de crescimento
	const currentCount = vaccinationCount || 0;
	const prevCount = previousCount || 0;
	const growthRate =
		prevCount > 0 ? ((currentCount - prevCount) / prevCount) * 100 : 0;

	// Calcular média diária
	const dailyAverage = periodDays > 0 ? currentCount / periodDays : 0;

	// Buscar total de pacientes e vacinas para contexto
	const { count: totalPatients } = await supabase
		.from("patients")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id);

	const { count: totalVaccines } = await supabase
		.from("vaccine_catalog")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id);

	return {
		totalPatients: totalPatients || 0,
		totalVaccines: totalVaccines || 0,
		totalVaccinations: currentCount,
		growthRate,
		dailyAverage,
		period: {
			label: getPeriodLabel(period, startDate, endDate),
			startDate: startDate.toISOString().split("T")[0],
			endDate: endDate.toISOString().split("T")[0],
		},
	};
}

// Função para obter vacinações por horário do dia
export async function getVaccinationsByHour(period: PeriodFilter = "month") {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	// Calcular período (similar à função anterior)
	const { startDate, endDate } = calculatePeriodDates(period);

	const { data, error } = await supabase
		.from("vaccination_records")
		.select(
			`
			created_at,
			patient:patients!inner(user_id)
		`
		)
		.eq("patient.user_id", user.id)
		.gte("dose_date", startDate.toISOString().split("T")[0])
		.lte("dose_date", endDate.toISOString().split("T")[0]);

	if (error) {
		throw new Error(`Erro ao buscar vacinações por horário: ${error.message}`);
	}

	// Agrupar por horário
	const hourGroups = Array.from({ length: 24 }, (_, i) => ({
		hour: `${i.toString().padStart(2, "0")}:00`,
		vacinações: 0,
	}));

	(data || []).forEach((record: DatabaseRow) => {
		const date = new Date(record.created_at as string);
		const hour = date.getHours();
		hourGroups[hour].vacinações++;
	});

	return hourGroups;
}

// Função para obter distribuição por local
export async function getVaccinationsByLocation(
	period: PeriodFilter = "month"
) {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	const { startDate, endDate } = calculatePeriodDates(period);

	const { data, error } = await supabase
		.from("vaccination_records")
		.select(
			`
			location,
			patient:patients!inner(user_id)
		`
		)
		.eq("patient.user_id", user.id)
		.gte("dose_date", startDate.toISOString().split("T")[0])
		.lte("dose_date", endDate.toISOString().split("T")[0]);

	if (error) {
		throw new Error(`Erro ao buscar vacinações por local: ${error.message}`);
	}

	// Agrupar por local
	const grouped = (data || []).reduce((acc, record: DatabaseRow) => {
		const location = (record.location as string) || "Não informado";
		acc[location] = (acc[location] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	// Converter para formato do gráfico
	const colors = [
		"blue.6",
		"green.6",
		"yellow.6",
		"red.6",
		"violet.6",
		"orange.6",
		"teal.6",
		"pink.6",
		"indigo.6",
		"cyan.6",
	];

	return Object.entries(grouped).map(([name, value], index) => ({
		name,
		value,
		color: colors[index % colors.length],
	}));
}

// Função para indicadores de saúde
export async function getHealthIndicators() {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	const now = new Date();

	// Vacinações nos últimos 30 dias
	const thirtyDaysAgo = new Date(now);
	thirtyDaysAgo.setDate(now.getDate() - 30);

	const { count: vaccinations30Days } = await supabase
		.from("vaccination_records")
		.select(
			`
			*,
			patient:patients!inner(user_id)
		`,
			{ count: "exact", head: true }
		)
		.eq("patient.user_id", user.id)
		.gte("dose_date", thirtyDaysAgo.toISOString().split("T")[0]);

	// Vacinações nos últimos 7 dias
	const sevenDaysAgo = new Date(now);
	sevenDaysAgo.setDate(now.getDate() - 7);

	const { count: vaccinations7Days } = await supabase
		.from("vaccination_records")
		.select(
			`
			*,
			patient:patients!inner(user_id)
		`,
			{ count: "exact", head: true }
		)
		.eq("patient.user_id", user.id)
		.gte("dose_date", sevenDaysAgo.toISOString().split("T")[0]);

	// Pacientes ativos (com vacinação nos últimos 6 meses)
	const sixMonthsAgo = new Date(now);
	sixMonthsAgo.setMonth(now.getMonth() - 6);

	const { data: activePatients } = await supabase
		.from("vaccination_records")
		.select(
			`
			patient_id,
			patient:patients!inner(user_id)
		`
		)
		.eq("patient.user_id", user.id)
		.gte("dose_date", sixMonthsAgo.toISOString().split("T")[0]);

	const uniqueActivePatients = new Set(
		(activePatients || []).map((v: DatabaseRow) => v.patient_id)
	).size;

	// Total de pacientes
	const { count: totalPatients } = await supabase
		.from("patients")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id);

	const inactivePatients = (totalPatients || 0) - uniqueActivePatients;
	const vaccinationRate = totalPatients
		? (uniqueActivePatients / totalPatients) * 100
		: 0;

	// Tendências (crescimento semanal)
	const twoWeeksAgo = new Date(now);
	twoWeeksAgo.setDate(now.getDate() - 14);

	const { count: vaccinationsPreviousWeek } = await supabase
		.from("vaccination_records")
		.select(
			`
			*,
			patient:patients!inner(user_id)
		`,
			{ count: "exact", head: true }
		)
		.eq("patient.user_id", user.id)
		.gte("dose_date", twoWeeksAgo.toISOString().split("T")[0])
		.lt("dose_date", sevenDaysAgo.toISOString().split("T")[0]);

	const weeklyGrowth =
		vaccinationsPreviousWeek && vaccinations7Days
			? ((vaccinations7Days - vaccinationsPreviousWeek) /
					vaccinationsPreviousWeek) *
			  100
			: 0;

	return {
		vaccinations30Days: vaccinations30Days || 0,
		vaccinations7Days: vaccinations7Days || 0,
		inactivePatients,
		activePatients: uniqueActivePatients,
		vaccinationRate,
		trends: {
			weeklyGrowth,
			monthlyTotal: vaccinations30Days || 0,
		},
	};
}

// Função para tendências semanais
export async function getWeeklyTrends() {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	// Buscar vacinações das últimas 12 semanas
	const twelveWeeksAgo = new Date();
	twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 12 * 7);

	const { data, error } = await supabase
		.from("vaccination_records")
		.select(
			`
			dose_date,
			patient:patients!inner(user_id)
		`
		)
		.eq("patient.user_id", user.id)
		.gte("dose_date", twelveWeeksAgo.toISOString().split("T")[0])
		.order("dose_date");

	if (error) {
		throw new Error(`Erro ao buscar tendências semanais: ${error.message}`);
	}

	// Agrupar por semana
	const weeklyData: Record<string, number> = {};

	(data || []).forEach((record: DatabaseRow) => {
		const date = new Date(record.dose_date as string);
		const weekStart = new Date(date);
		weekStart.setDate(date.getDate() - date.getDay());
		const weekKey = weekStart.toISOString().split("T")[0];

		weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1;
	});

	// Converter para formato do gráfico
	return Object.entries(weeklyData)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([week, count]) => ({
			semana: new Date(week).toLocaleDateString("pt-BR", {
				day: "2-digit",
				month: "short",
			}),
			vacinações: count,
		}));
}

// Funções auxiliares
function calculatePeriodDates(period: PeriodFilter) {
	const now = new Date();
	let startDate: Date;
	const endDate = new Date(now);

	switch (period) {
		case "day":
			startDate = new Date(now);
			startDate.setHours(0, 0, 0, 0);
			endDate.setHours(23, 59, 59, 999);
			break;
		case "week":
			startDate = new Date(now);
			startDate.setDate(now.getDate() - 7);
			break;
		case "month":
			startDate = new Date(now);
			startDate.setMonth(now.getMonth() - 1);
			break;
		case "semester":
			startDate = new Date(now);
			startDate.setMonth(now.getMonth() - 6);
			break;
		case "year":
			startDate = new Date(now);
			startDate.setFullYear(now.getFullYear() - 1);
			break;
		default:
			startDate = new Date(now);
			startDate.setMonth(now.getMonth() - 1);
	}

	return { startDate, endDate };
}

function getPeriodLabel(
	period: PeriodFilter,
	startDate: Date,
	endDate: Date
): string {
	const options: Intl.DateTimeFormatOptions = {
		day: "2-digit",
		month: "short",
		year: "numeric",
	};

	switch (period) {
		case "day":
			return `Hoje (${startDate.toLocaleDateString("pt-BR", options)})`;
		case "week":
			return `Última semana`;
		case "month":
			return `Último mês`;
		case "semester":
			return `Último semestre`;
		case "year":
			return `Último ano`;
		case "custom":
			return `${startDate.toLocaleDateString(
				"pt-BR",
				options
			)} - ${endDate.toLocaleDateString("pt-BR", options)}`;
		default:
			return `Período customizado`;
	}
}

// Função para buscar tipos de vacina disponíveis para os filtros
export async function getAvailableVaccineTypes() {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	const { data, error } = await supabase
		.from("vaccine_catalog")
		.select("type, manufacturer")
		.eq("user_id", user.id)
		.order("type");

	if (error) {
		throw new Error(`Erro ao buscar tipos de vacina: ${error.message}`);
	}

	// Criar lista única de tipos de vacina para o filtro
	const uniqueTypes = Array.from(
		new Set((data || []).map((v) => `${v.type} - ${v.manufacturer}`))
	).map((type) => ({
		value: type,
		label: type,
	}));

	return uniqueTypes;
}

// Função para obter dados do dashboard com filtros avançados
export async function getDashboardDataWithFilters(
	period: PeriodFilter = "month",
	vaccineType?: string,
	ageGroup?: string,
	patientId?: string,
	customStart?: string,
	customEnd?: string
) {
	const supabase = await createClient();

	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) {
		throw new Error("Usuário não autenticado");
	}

	// Calcular datas baseado no período
	const { startDate, endDate } =
		period === "custom" && customStart && customEnd
			? { startDate: new Date(customStart), endDate: new Date(customEnd) }
			: calculatePeriodDates(period);

	// Query base para vacinações com filtros
	let vaccinationsQuery = supabase
		.from("vaccination_records")
		.select(
			`
			*,
			patient:patients!inner(user_id, birth_date),
			vaccine:vaccine_catalog!inner(type, manufacturer, user_id)
		`
		)
		.eq("patient.user_id", user.id)
		.eq("vaccine.user_id", user.id)
		.gte("dose_date", startDate.toISOString().split("T")[0])
		.lte("dose_date", endDate.toISOString().split("T")[0]);
	// Aplicar filtro de tipo de vacina
	if (vaccineType && vaccineType !== "all") {
		const [type, manufacturer] = vaccineType.split(" - ");
		if (type && manufacturer) {
			vaccinationsQuery = vaccinationsQuery
				.eq("vaccine.type", type)
				.eq("vaccine.manufacturer", manufacturer);
		}
	}

	// Aplicar filtro de paciente
	if (patientId) {
		vaccinationsQuery = vaccinationsQuery.eq("patient_id", patientId);
	}

	const { data: vaccinations, error: vaccinationsError } =
		await vaccinationsQuery;

	if (vaccinationsError) {
		throw new Error(
			`Erro ao buscar vacinações filtradas: ${vaccinationsError.message}`
		);
	}
	// Filtrar por faixa etária se especificado
	let filteredVaccinations = vaccinations || [];
	if (ageGroup && ageGroup !== "all") {
		const currentYear = new Date().getFullYear();
		filteredVaccinations = filteredVaccinations.filter(
			(vaccination: DatabaseRow) => {
				const patient = vaccination.patient as { birth_date: string };
				const birthYear = new Date(patient.birth_date).getFullYear();
				const age = currentYear - birthYear;

				switch (ageGroup) {
					case "0-17":
						return age <= 17;
					case "18-29":
						return age >= 18 && age <= 29;
					case "30-39":
						return age >= 30 && age <= 39;
					case "40-49":
						return age >= 40 && age <= 49;
					case "50-59":
						return age >= 50 && age <= 59;
					case "60+":
						return age >= 60;
					default:
						return true;
				}
			}
		);
	}

	return {
		totalVaccinations: filteredVaccinations.length,
		vaccinations: filteredVaccinations,
		period: {
			label: getPeriodLabel(period, startDate, endDate),
			startDate: startDate.toISOString().split("T")[0],
			endDate: endDate.toISOString().split("T")[0],
		},
	};
}
