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
	const [initialized, setInitialized] = useState(false);
	const router = useRouter();
	const supabase = browserClient();

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				// Primeiro, verificar se há uma sessão ativa
				const {
					data: { session },
					error: sessionError,
				} = await supabase.auth.getSession();

				if (sessionError) {
					console.warn(
						"Nenhuma sessão ativa encontrada:",
						sessionError.message
					);
					setUser(null);
				} else if (session?.user) {
					setUser(session.user);
				} else {
					setUser(null);
				}
			} catch (error) {
				console.error("Erro inesperado ao obter sessão:", error);
				setUser(null);
			} finally {
				setLoading(false);
				setInitialized(true);
			}
		};

		if (!initialized) {
			initializeAuth();
		}
		// Escutar mudanças no estado de autenticação
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			console.log(
				"Auth state changed:",
				event,
				session?.user ? "User logged in" : "No user"
			);

			setUser(session?.user ?? null);
			setLoading(false);

			// Se o usuário fez logout, redirecionar para página de auth
			if (event === "SIGNED_OUT") {
				router.push("/auth");
			}

			// Só redirecionar para home no login se estiver na página de auth
			// Isso evita redirecionamentos desnecessários de outras páginas
			if (
				event === "SIGNED_IN" &&
				session?.user &&
				window.location.pathname === "/auth"
			) {
				router.push("/");
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, [initialized, supabase.auth, router]);

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
