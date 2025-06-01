import type { Database } from "./utils/supabase/supabase";

export type Patient = Database["public"]["Tables"]["patients"]["Row"];
export type PatientInsert = Database["public"]["Tables"]["patients"]["Insert"];
export type PatientUpdate = Database["public"]["Tables"]["patients"]["Update"];

export interface PatientFormData {
	full_name: string;
	cpf: string;
	birth_date: string;
	phone: string;
	cep: string;
	street: string;
	number: string;
	complement?: string;
	neighborhood: string;
	city: string;
	state: string;
}

export interface PatientsSearchFilters {
	search?: string;
	page?: number;
	limit?: number;
}

export interface PatientsResponse {
	data: Patient[];
	count: number;
	page: number;
	limit: number;
	totalPages: number;
}
