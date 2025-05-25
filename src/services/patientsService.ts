import type {
	Patient,
	PatientInsert,
	PatientUpdate,
	PatientsResponse,
	PatientsSearchFilters,
} from "@/types/patients";
import { browserClient } from "@/utils/supabase/client";

class PatientsService {
	private supabase = browserClient();

	async getPatients(
		filters: PatientsSearchFilters = {}
	): Promise<PatientsResponse> {
		const { search = "", page = 1, limit = 10 } = filters;
		const from = (page - 1) * limit;
		const to = from + limit - 1;

		let query = this.supabase
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

	async getPatientById(id: string): Promise<Patient> {
		const { data, error } = await this.supabase
			.from("patients")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			throw new Error(`Erro ao buscar paciente: ${error.message}`);
		}

		return data;
	}
	async createPatient(
		patient: Omit<PatientInsert, "user_id">
	): Promise<Patient> {
		const {
			data: { user },
		} = await this.supabase.auth.getUser();

		if (!user) {
			throw new Error("Usuário não autenticado");
		}

		const { data, error } = await this.supabase
			.from("patients")
			.insert({
				...patient,
				user_id: user.id,
			})
			.select()
			.single();

		if (error) {
			throw new Error(`Erro ao criar paciente: ${error.message}`);
		}

		return data;
	}

	async updatePatient(id: string, patient: PatientUpdate): Promise<Patient> {
		const { data, error } = await this.supabase
			.from("patients")
			.update(patient)
			.eq("id", id)
			.select()
			.single();

		if (error) {
			throw new Error(`Erro ao atualizar paciente: ${error.message}`);
		}

		return data;
	}

	async deletePatient(id: string): Promise<void> {
		const { error } = await this.supabase
			.from("patients")
			.delete()
			.eq("id", id);

		if (error) {
			throw new Error(`Erro ao excluir paciente: ${error.message}`);
		}
	}

	async checkCpfExists(cpf: string, excludeId?: string): Promise<boolean> {
		let query = this.supabase.from("patients").select("id").eq("cpf", cpf);

		if (excludeId) {
			query = query.neq("id", excludeId);
		}

		const { data, error } = await query;

		if (error) {
			throw new Error(`Erro ao verificar CPF: ${error.message}`);
		}

		return (data?.length || 0) > 0;
	}
}

export const patientsService = new PatientsService();
