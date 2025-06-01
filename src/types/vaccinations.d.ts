import type { Database } from "./utils/supabase/supabase";

export type VaccinationRecord =
	Database["public"]["Tables"]["vaccination_records"]["Row"];
export type VaccinationRecordInsert =
	Database["public"]["Tables"]["vaccination_records"]["Insert"];
export type VaccinationRecordUpdate =
	Database["public"]["Tables"]["vaccination_records"]["Update"];

export interface VaccinationFormData {
	patient_id: string;
	vaccine_id: string;
	dose_date: string;
	batch_number: string;
	location: string;
	notes?: string;
}

export interface VaccinationsSearchFilters {
	search?: string;
	page?: number;
	limit?: number;
}

export interface VaccinationsResponse {
	data: VaccinationRecordWithDetails[];
	count: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface VaccinationRecordWithDetails extends VaccinationRecord {
	patient: {
		id: string;
		full_name: string;
		cpf: string;
	};
	vaccine: {
		id: string;
		type: string;
		manufacturer: string;
	};
}
