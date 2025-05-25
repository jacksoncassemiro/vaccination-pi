import type { User } from "@supabase/supabase-js";

export interface AuthContextType {
	user: User | null;
	loading: boolean;
}

export interface AuthProviderProps {
	children: React.ReactNode;
}
