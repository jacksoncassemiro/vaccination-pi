"use client";

import { useSyncExternalStore } from "react";

/**
 * Store para sincronizar localStorage entre abas/janelas.
 * Utiliza useSyncExternalStore para detectar mudanças no localStorage.
 */
class LocalStorageStore {
	private listeners = new Set<() => void>();

	subscribe = (callback: () => void): (() => void) => {
		this.listeners.add(callback);

		// Listener para mudanças do localStorage de outras abas
		const handleStorageChange = (event: StorageEvent) => {
			if (event.storageArea === localStorage) {
				callback();
			}
		};

		window.addEventListener("storage", handleStorageChange);

		return () => {
			this.listeners.delete(callback);
			window.removeEventListener("storage", handleStorageChange);
		};
	};

	getSnapshot = <T>(key: string, defaultValue: T): T => {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch {
			return defaultValue;
		}
	};

	getServerSnapshot = <T>(defaultValue: T): T => {
		// No servidor, retorna o valor padrão
		return defaultValue;
	};

	setValue = <T>(key: string, value: T): void => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			// Notificar todos os listeners da mudança
			this.listeners.forEach((callback) => callback());
		} catch (error) {
			console.warn("Erro ao salvar no localStorage:", error);
		}
	};

	removeValue = (key: string): void => {
		try {
			localStorage.removeItem(key);
			// Notificar todos os listeners da mudança
			this.listeners.forEach((callback) => callback());
		} catch (error) {
			console.warn("Erro ao remover do localStorage:", error);
		}
	};
}

const localStorageStore = new LocalStorageStore();

/**
 * Hook para sincronizar estado com localStorage usando useSyncExternalStore.
 * Automaticamente sincroniza mudanças entre abas/janelas.
 *
 * @param key - Chave do localStorage
 * @param defaultValue - Valor padrão se a chave não existir
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
	key: string,
	defaultValue: T
): [T, (value: T) => void, () => void] {
	const value = useSyncExternalStore(
		localStorageStore.subscribe,
		() => localStorageStore.getSnapshot(key, defaultValue),
		() => localStorageStore.getServerSnapshot(defaultValue)
	);

	const setValue = (newValue: T) => {
		localStorageStore.setValue(key, newValue);
	};

	const removeValue = () => {
		localStorageStore.removeValue(key);
	};

	return [value, setValue, removeValue];
}
