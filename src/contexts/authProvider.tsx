"use client";

import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import type {
	AuthContextType,
	AuthProviderProps,
} from "@/types/contexts/authContext";
import { createContext, useContext } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
	// Usar o hook otimizado com useSyncExternalStore
	const { user, loading } = useSupabaseAuth();

	const value: AuthContextType = {
		user,
		loading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth deve ser usado dentro de um AuthProvider");
	}
	return context;
}
