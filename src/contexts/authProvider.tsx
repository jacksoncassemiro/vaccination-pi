"use client";

import type {
	AuthContextType,
	AuthProviderProps,
} from "@/types/contexts/authContext";
import { browserClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const supabase = browserClient();

	useEffect(() => {
		const getUser = async () => {
			try {
				const {
					data: { user },
					error,
				} = await supabase.auth.getUser();
				if (error) {
					console.error("Erro ao obter usuário:", error);
				}
				setUser(user);
			} catch (error) {
				console.error("Erro inesperado ao obter usuário:", error);
			} finally {
				setLoading(false);
			}
		};

		getUser();

		// Escutar mudanças no estado de autenticação
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			setUser(session?.user ?? null);

			// Se o usuário fez logout, redirecionar para página de auth
			if (event === "SIGNED_OUT") {
				router.push("/auth");
			}

			// Se o usuário fez login, redirecionar para página inicial
			if (event === "SIGNED_IN" && session?.user) {
				router.push("/");
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase.auth, router]);

	const signOut = async () => {
		try {
			setLoading(true);
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error("Erro ao fazer logout:", error);
			}
		} catch (error) {
			console.error("Erro inesperado ao fazer logout:", error);
		} finally {
			setLoading(false);
		}
	};

	const value: AuthContextType = {
		user,
		loading,
		signOut,
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
