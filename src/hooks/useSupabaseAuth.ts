"use client";

import { browserClient } from "@/utils/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useSyncExternalStore } from "react";

interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
}

/**
 * Store para gerenciar o estado de autenticação do Supabase.
 * Utiliza useSyncExternalStore para sincronizar mudanças de auth.
 */
class SupabaseAuthStore {
	private state: AuthState = {
		user: null,
		session: null,
		loading: true,
	};

	private listeners = new Set<() => void>();
	private initialized = false;
	private supabase = browserClient();

	// Cache do estado inicial do servidor para evitar recriação
	private serverSnapshot: AuthState = {
		user: null,
		session: null,
		loading: true,
	};

	subscribe = (callback: () => void): (() => void) => {
		this.listeners.add(callback);

		// Inicializar apenas uma vez
		if (!this.initialized) {
			this.initialize();
		}

		return () => {
			this.listeners.delete(callback);
		};
	};

	getSnapshot = (): AuthState => {
		return this.state;
	};

	getServerSnapshot = (): AuthState => {
		// No servidor, retorna sempre o mesmo objeto cached
		return this.serverSnapshot;
	};

	private notifyListeners = (): void => {
		this.listeners.forEach((callback) => callback());
	};

	private updateState = (updates: Partial<AuthState>): void => {
		this.state = { ...this.state, ...updates };
		this.notifyListeners();
	};

	private initialize = async (): Promise<void> => {
		this.initialized = true;

		try {
			// Verificar sessão inicial
			const {
				data: { session },
				error,
			} = await this.supabase.auth.getSession();

			if (error) {
				console.warn("Erro ao obter sessão:", error.message);
				this.updateState({
					user: null,
					session: null,
					loading: false,
				});
			} else {
				this.updateState({
					user: session?.user ?? null,
					session,
					loading: false,
				});
			}
		} catch (error) {
			console.error("Erro inesperado ao inicializar auth:", error);
			this.updateState({
				user: null,
				session: null,
				loading: false,
			});
		}

		// Escutar mudanças no estado de autenticação
		this.supabase.auth.onAuthStateChange((event, session) => {
			console.log(
				"Auth state changed:",
				event,
				session?.user ? "User logged in" : "No user"
			);

			this.updateState({
				user: session?.user ?? null,
				session,
				loading: false,
			});

			// Redirecionar baseado no evento
			if (typeof window !== "undefined") {
				if (event === "SIGNED_OUT") {
					window.location.href = "/auth";
				} else if (
					event === "SIGNED_IN" &&
					session?.user &&
					window.location.pathname === "/auth"
				) {
					window.location.href = "/";
				}
			}
		});
	};
}

const authStore = new SupabaseAuthStore();

/**
 * Hook otimizado para estado de autenticação usando useSyncExternalStore.
 * Sincroniza automaticamente mudanças de autenticação do Supabase.
 *
 * @returns AuthState com user, session e loading
 */
export function useSupabaseAuth(): AuthState {
	return useSyncExternalStore(
		authStore.subscribe,
		authStore.getSnapshot,
		authStore.getServerSnapshot
	);
}
