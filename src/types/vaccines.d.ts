import type { Database } from "./utils/supabase/supabase";

export type Vaccine = Database["public"]["Tables"]["vaccine_catalog"]["Row"];
export type VaccineInsert =
	Database["public"]["Tables"]["vaccine_catalog"]["Insert"];
export type VaccineUpdate =
	Database["public"]["Tables"]["vaccine_catalog"]["Update"];

export interface VaccineFormData {
	type: string;
	manufacturer: string;
}

export interface VaccinesSearchFilters {
	search?: string;
	page?: number;
	limit?: number;
}

export interface VaccinesResponse {
	data: Vaccine[];
	count: number;
	page: number;
	limit: number;
	totalPages: number;
}
